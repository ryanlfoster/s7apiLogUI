module CompanyEventsHelper

  def eventTableData(event)
    mongoData = eventAggregateDB(event)
    return [] if mongoData.empty?
    mongoData = processData(mongoData, event)
    toReturn = [mongoData[0].keys]
    mongoData.each do |instance|
      toReturn.push(instance.values)
    end
    return toReturn
  end

  def eventBarChartData(event)
    mongoData = eventAggregateDB(event)
    return [] if mongoData.empty?
    mongoData = processData(mongoData, event)
    depVars = ["totalNumber", "collectionTime"]
    indVars = mongoData[0].except(*depVars).keys
    toVary = eventMostVaried(mongoData, indVars)
    bucketedData = bucketData(mongoData, depVars+[toVary])
    toReturn = eventToGoogleCFormBar(bucketedData, toVary)
    return toReturn
  end

  def eventPieChartData(event)
    mongoData = eventAggregateDB(event)
    return [] if mongoData.empty?
    mongoData = processData(mongoData, event)
    depVars = ["totalNumber", "collectionTime"]
    indVars = mongoData[0].except(*depVars).keys
    toVary = eventMostVaried(mongoData, indVars)
    bucketedData = bucketData(mongoData, depVars+[toVary])
    p bucketedData
    toReturn = eventToGoogleCFormPie(bucketedData, toVary)
    return toReturn
  end

  def bucketData(mongoData, keysToVaryBy)
    toReturn = {}
    mongoData.each do |instance|
      instKey = instance.except(*keysToVaryBy)
      toReturn[instKey].nil? ? toReturn[instKey] = [instance] : toReturn[instKey].push(instance)
    end
    return toReturn
  end

  def eventToGoogleCFormBar(bucketedData, toVary, groupBy = "collectionTime")
    toReturn = {}
    bucketedData.each do |labelHash, instances|
      currLabel = labelHash.keys.map {|k| k + " #{labelHash[k]}"}.join(" ")
      groupVars = allHashFieldValues(instances, groupBy).sort
      indVars = allHashFieldValues(instances, toVary).sort
      currChartArr = [[groupBy, *indVars]]
      currChartArr = addDepVars(currChartArr, instances, groupVars, indVars, groupBy, toVary)
      toReturn[currLabel] = currChartArr
    end
    return toReturn
  end

  def eventToGoogleCFormPie(bucketedData, toVary)
    toReturn = {}
    bucketedData.each do |labelHash, instances|
      currLabel = labelHash.keys.map {|k| k + " #{labelHash[k]}"}.join(" ")
      currChartHash = {}
      instances.each do |instance|
        p instance
        currIndVar = instance[toVary]
        currValue = instance["totalNumber"]
        currChartHash[currIndVar].nil? ? currChartHash[currIndVar] = currValue : currChartHash[currIndVar] += currValue
      end
      toReturn[currLabel] = [["",""]]+currChartHash.to_a
    end
    p toReturn
    return toReturn
  end

  def allHashFieldValues(instances, toVary)
    return instances.map{|x| x[toVary]}.uniq
  end

  def addDepVars(currChartArr, instances, groupVars, indVars, groupBy, toVary)
    groupVars.length.times {|x| currChartArr.push(Array.new(indVars.length+1, 0))}
    instances.each do |instance|
      groupIndex = groupVars.index(instance[groupBy]) + 1
      indVarIndex = indVars.index(instance[toVary]) + 1
      depVar = instance["totalNumber"]
      currChartArr[groupIndex][indVarIndex] = depVar
      currChartArr[groupIndex][0] = instance[groupBy]
    end
    return currChartArr
  end

## mongoData Prettify Methods ##

def processData(mongoData, event)
    mongoData = mergeIDHash(mongoData)
    mongoData = eventDateGroupData(mongoData, event)
    mongoData = verbosifyTypeFields(mongoData)
    return mongoData
  end

  def mergeIDHash(mongoData)
    toReturn = []
    mongoData.each do |instance|
      currHash = instance.except("_id")
      instance["_id"].keys.each do |var|
        currHash[var] = instance["_id"][var]
      end
      toReturn.push(currHash)
    end
    return toReturn
  end

  def eventMostVaried(mongoData, vars)
    temp = {}
    mongoData.each do |instance|
      vars.each do |var|
        if temp[var].nil?
          temp[var] = [instance[var]]
        elsif not temp[var].include? instance[var]
          temp[var].push(instance[var])
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

  def verbosifyTypeFields(mongoData)
    fields = mongoData[0].except("totalNumber", "collectionTime", "geo").keys
    @company, @fileType, @eventType = {}, {}, {}
    mongoData.each do |instance|
      fields.each do |field|
        if not instance_variable_get("@#{field}")[instance[field]].nil?
          instance[field] = instance_variable_get("@#{field}")[instance[field]]
        else
          instance_variable_get("@#{field}")[instance[field]] = fieldLookup(field, instance[field])
          instance[field] = instance_variable_get("@#{field}")[instance[field]]
        end
      end
    end
    return mongoData
  end

## End mongoData Prettify Methods ##

## Mongo Aggregation methods ##

  def eventAggregateDB(event)
    client = MongoClient.new("s7devdb2.corp.adobe.com", 27017, :pool_size => 15, :pool_timeout => 15)
    db = client['s7reporting']
    coll = db['companyEvent']

    matchVars = {"geo" => event.geo, "company" => event.companyID.map{|x| db['company'].find('companyName' => x).to_a[0]["company"]}, "eventType" => event.logType.map{|x| x.to_i}, "fileType" => event.fileType.map{|x| x.to_i}}
    # filters based on date fields
    dateMatchQuery = [{"$match" => {"collectionTime" => {"$gte" => toUTC(event.startDate), "$lte" => toUTC(event.endDate)}}}]
    # filters based on event instance variable values
    varMatchQuery = eventGenMongoMatchQuery(event, matchVars)
    # generates mongo aggregation framework group pipelineTask
    varGroupQuery = eventGenMongoGroupQuery(event)
    # gets queried data from mongo
    aggOutput = coll.aggregate(dateMatchQuery + varMatchQuery + varGroupQuery)
    p dateMatchQuery + varMatchQuery + varGroupQuery
    return aggOutput
  end

  # input: companyEvent instance
  # output: Hash of the form {"$match" => {"companyName": "asics", "apiEvent": "searchAssets"}}
  def eventGenMongoMatchQuery(event, matchVars)
    queryHash = {}    
    matchVars.each do |name, values|
      if values.include? "Select All" or values.include? "Select None" or values.include? 0
        next
      elsif values.length > 1
        queryHash[name] = {"$in" => values}
      elsif values.length == 1
        queryHash[name] = values[0]
      end
    end
    return [{"$match" => queryHash}]
  end

  # input input: String of the format "companyName, apiEvent - numExecs:sum"
  # expected output: Hash of the form {"$group" => {_id: {companyName: "$companyName", apiEvent: "$apiEvent"}, sumnumExecs: {"$sum" => "$numExecs"}}}
  def eventGenMongoGroupQuery(event)
    queryHash = {"_id" => {"collectionTime" => "$collectionTime"}}
    queryHash["_id"]["eventType"] = "$eventType" if not event[:aggregateLogs] and not event[:logType].empty? and not event[:logType].include? "Select None"
    queryHash["_id"]["fileType"] = "$fileType" if not event[:aggregateFiles] and not event[:fileType].empty? and not event[:fileType].include? "Select None"
    queryHash["_id"]["company"] = "$company" if event[:company] and not event[:aggregateCompanies]
    queryHash["totalNumber"] = {"$sum" => "$totalNumber"}

    return [{"$group" => queryHash}]
  end

## End of Mongo Aggregation methods ##

## Date Grouping methods ##

  def eventDateGroupData(mongoData, company_event)
    groupBy = company_event.dateGroup
    if groupBy == "daily"
      mongoData.each do |instance|
        instance["collectionTime"] = instance["collectionTime"].to_s.split(" ")[0]
      end
    else 
      dateRanges = eventGenDateRanges(company_event)
      mongoData.each do |instance|
        instance["collectionTime"] = selectDateRange(instance["collectionTime"], dateRanges)
      end
    end
    mongoData = eventAccumulateStats(mongoData)
    return mongoData.values
  end

  def eventAccumulateStats(mongoData)
    toReturn = {}
    mongoData.each do |instance|
      instKey = instance.except("totalNumber")
      if toReturn[instKey].nil?
      	toReturn[instKey] = instance.except("_id")
      else
      	toReturn[instKey]["totalNumber"] += instance["totalNumber"]
      end
    end
    return toReturn
  end

  def eventGenDateRanges(company_event)
    toReturn = []
    startDate = company_event.startDate
    endDate = company_event.endDate
    intervalTime = genTimeInterval(company_event.dateGroup)
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

## End of Date Grouping Methods ##

end