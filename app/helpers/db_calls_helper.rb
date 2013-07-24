module DbCallsHelper

  def barGraphData(db_call, groupBy = "requestDate")
    mongoData = aggregateDB(db_call)
    if mongoData.empty?
      return {}
    end
    indVars = Array.class_eval(db_call.indVars)
    statsToShow = Array.class_eval(db_call.statsQueried)
    dateGroupedData = dateGroupData(mongoData, db_call)
    varyBy = mostVaried(mongoData, indVars) # variable with most possible values
    startingLabel = genStartingLabel(mongoData[0]["_id"].keys - indVars - [groupBy], mongoData[0]["_id"])  # clean this
    filteredLogs = filterLogs(mongoData, indVars - [varyBy], startingLabel)
    toReturn = toGoogleCForm(filteredLogs, varyBy, groupBy)

    return toReturn
  end

  def genStartingLabel(singleVars, sampleInstanceID)
    toReturn = []
    singleVars.each do |var|
      toReturn.push(var + " " + sampleInstanceID[var])
    end
    return toReturn
  end

## Date Grouping methods ##

  def dateGroupData(mongoData, db_call)
    groupBy = db_call.dateGroup
    if groupBy == "daily"
      mongoData.each do |instance|
        instance["_id"]["requestDate"] = instance["_id"]["requestDate"].to_s.split(" ")[0]
      end
    else #something is wrong with this monthly!!!
      dateRanges = genDateRanges(db_call)
      mongoData.each do |instance|
        instance["_id"]["requestDate"] = selectDateRange(instance["_id"]["requestDate"], dateRanges)
      end
      mongoData = accumulateStats(mongoData)
    end
    return mongoData
  end

  def accumulateStats(mongoData)
    toReturn = {}
    mongoData.each do |instance|
      if toReturn[instance["_id"]].nil?
        toReturn[instance["_id"]] = instance
      else
        toReturn[instance["_id"]].except("_id").keys.each do |stat|
          toReturn[instance["_id"]][stat] += instance[stat]
        end
      end
    end
    return toReturn
  end

  def genDateRanges(db_call)
    toReturn = []
    startDate = db_call.startDate
    endDate = db_call.endDate
    intervalTime = genTimeInterval(db_call.dateGroup)
    while startDate < endDate do
      tempDate = startDate + intervalTime
      if tempDate > endDate
        toReturn.push([startDate, endDate])
      else
        toReturn.push([startDate, tempDate])
      end
      startDate = tempDate
    end
    return toReturn
  end

  def genTimeInterval(dateGroup)
    if dateGroup == "weekly"
      return 7
    elsif dateGroup == "monthly"
      return 30
    end
    raise "invalid dateGroup"
  end

  def selectDateRange(date, dateRanges)
    dateRanges.each do |range|
      if date <= range[1]
        return dateRangeToStr(range)
      end
    end
  end

  def dateRangeToStr(dateRange)
    return dateRange[0].to_s + " - " + dateRange[1].to_s
  end

## End of Date Grouping Methods ##

  def mostVaried(mongoData, indVars)
    temp = {}
    mongoData.each do |instance|
      indVars.each do |var|
        if temp[var].nil?
          temp[var] = [instance["_id"][var]]
        elsif not temp[var].include? instance["_id"][var]
          temp[var].push(instance["_id"][var])
        end
      end
    end
    if temp.empty?
      raise "indVars not found in mongoData"
    else
      longest = nil
      temp.each do |key, values|
        longest = key if (longest.nil? or temp[longest].length < values.length)
      end
      return longest
    end
  end

  def filterLogs(mongoData, indVars, startingLabel)
    mongoData.each do |logInstance|
      startingLabel.each {|var| logInstance["_id"].delete(var)}
    end

    toReturn = {}
    toReturn[startingLabel] = mongoData

    indVars.each do |indVar| # should use all the indVars except for varyBy
      toReplace = {}
      toReturn.each do |labels, instances|
        instances.each do |instance|
          currKey = labels + [indVar + " " + instance["_id"][indVar]]
          instance["_id"].delete(indVar)
          if toReplace[currKey].nil?
            toReplace[currKey] = [instance]  
          else
            toReplace[currKey].push(instance)
          end
        end
      end
      toReturn = toReplace
    end
    return toReturn
  end

  def toGoogleCForm(hashOfLogs, varyBy, groupBy)
    toReturn = {}
    hashOfLogs.each do |labels, instances|
      varyByVars = allVarValues(varyBy, instances)
      groupByVars = allVarValues(groupBy, instances)

      varyByHash = arrToHash(varyByVars)
      groupByHash = arrToHash(groupByVars, 1)
      statsToShow = instances[0].except("_id").keys

      statsToShow.each do |stat| #check this
        graphArr = genGraphArr(groupBy, varyByVars, groupByVars, varyByHash, groupByHash)
        instances.each do |instance|
          ids = instance["_id"]
          graphArr[groupByHash[ids[groupBy]]][varyByHash[ids[varyBy]]+1] = instance[stat]
        end
        toReturn[[stat]+labels] = graphArr
      end
    end
    return toReturn
  end

  def allVarValues(var, instances)
    toReturn = []
    instances.each do |instance|
      id = instance["_id"]
      toReturn.push(id[var]) if not toReturn.include? id[var]
    end
    return toReturn
  end

  def arrToHash(vars, offset = 0)
    toReturn = {}
    vars = vars.sort
    vars.each do |var|
      toReturn[var] = toReturn.length + offset
    end
    return toReturn
  end

  def genGraphArr(groupBy, varyByVars, groupByVars, varyByHash, groupByHash)
    toReturn = [[groupBy] + varyByVars.sort]
    (1..groupByVars.length).each do |i|
      toReturn.push((0..varyByVars.length).map{|j| 0})
    end
    (1..groupByVars.length).each {|x| toReturn[x][0] = groupByVars.sort[x-1]}
    return toReturn
  end

  def tableData(db_call, groupBy = "requestDate")
    mongoData = aggregateDB(db_call)
    if mongoData.empty?
      return []
    end
    indVars = Array.class_eval(db_call.indVars) + [groupBy]
    statsToShow = Array.class_eval(db_call.statsQueried)
    varyBy = mostVaried(mongoData, indVars)
    indVars = [varyBy] + (indVars - [varyBy])
    labels = indVars + statsToShow
    toReturn = [labels]
    mongoData.each do |instance|
      dataRow = []
      labels.each do |label|
        if not instance["_id"][label].nil?
          dataRow.push(instance["_id"][label])
        else
          dataRow.push(instance[label])
        end
      end
      toReturn.push(dataRow)
    end
    return toReturn
  end

  def pieData(db_call, groupBy = "requestDate")
    mongoData = aggregateDB(db_call)
    if mongoData.empty?
      return {}
    end
    indVars = Array.class_eval(db_call.indVars)
    statsToShow = Array.class_eval(db_call.statsQueried)
    varyBy = mostVaried(mongoData, indVars)
    toReturn = {}
    statsToShow.each do |stat|
      labels = [varyBy] + [stat]
      newGraph = {}
      mongoData.each do |instance|
        if newGraph[instance["_id"][varyBy]].nil?
          newGraph[instance["_id"][varyBy]] = instance[stat]
        else
          newGraph[instance["_id"][varyBy]] += instance[stat]
        end
      end
      toReturn[labels] = [labels] + newGraph.to_a
    end
    return toReturn
  end

  def aggregateDB(db_call)
    client = MongoClient.new('localhost', 27017, :pool_size => 10, :pool_timeout => 15)
    db     = client['s7db']
    coll   = db['apiLog']

    # filters based on date fields
    dateMatchQuery = [{"$match" => {"requestDate" => {"$gte" => toUTC(db_call.startDate), "$lte" => toUTC(db_call.endDate)}}}]
    
    aggOutput = coll.aggregate(dateMatchQuery + Array.class_eval(db_call.pipelineTask))
    
    # verifies that query returns data
    return aggOutput
  end

  def toUTC(date)
    return Time.utc(date.year, date.month, date.day)
  end

  def toCheck(db_call, toFind)
    if db_call.nil? or db_call.pipelineTask.nil?
      return false
    elsif db_call.pipelineTask.include? '"'+toFind+'"' or db_call.pipelineTask.include? '"$'+toFind+'"'
      return true
    elsif db_call.selectedDisplays.include? toFind
      return true
    end
  end

  def toFill(db_call, toFind)
    if not toCheck(db_call, toFind)
      return nil
    end
    matchQuery = Array.class_eval(db_call.pipelineTask)[0]['$match']
    if matchQuery[toFind].nil?
      return nil
    elsif matchQuery[toFind].class == String
      return matchQuery[toFind]
    elsif matchQuery[toFind].class == Hash
      return matchQuery[toFind]['$in'].join(", ")
    end
  end

  def createLabel(labels)
    toReturn = labels.join(" ")
    return toReturn 
  end
end