module CompanyAssetStatsHelper
  
  def assetTableData(asset)
    mongoData = assetAggregateDB(asset)
    return [] if mongoData.empty?
    mongoData = assetProcessData(mongoData, asset)
    toReturn = [mongoData[0].keys]
    mongoData.each do |instance|
      toReturn.push(instance.values)
    end
    return toReturn
  end

  def assetBarChartData(asset)
    mongoData = assetAggregateDB(asset)
    return [] if mongoData.empty?
    mongoData = assetProcessData(mongoData, asset)

    fixedGraphVar = defineFixedGraphVar(asset)
    indepGraphVar = defineIndepGraphVar(asset, fixedGraphVar)
    bucketedData = assetBucketData(mongoData, fixedGraphVar)
    toReturn = assetToGoogleCFormBar(asset, bucketedData, indepGraphVar)
    p toReturn
    return toReturn
    # return {}
  end

  def assetPieChartData(asset)
    mongoData = assetAggregateDB(asset)
    return [] if mongoData.empty?
    mongoData = assetProcessData(mongoData, asset)
    fixedGraphVar = defineFixedGraphVar(asset)
    indepGraphVar = defineIndepGraphVar(asset, fixedGraphVar)
    bucketedData = assetBucketData(mongoData, fixedGraphVar)
    toReturn = assetToGoogleCFormPie(bucketedData, indepGraphVar)
    return toReturn
  end

  def defineFixedGraphVar(asset)
    (asset.assetType.length == 1 and not asset.assetType.include? "Display All" and not asset.assetType.include? "Display All" or asset.company.nil? or asset.aggregateCompanies) ? "assetType" : "company"
  end

  def defineIndepGraphVar(asset, fixedGraphVar)
    (fixedGraphVar == "assetType" and not (asset.company.nil? or asset.aggregateCompanies)) ? "company" : "assetType"
  end

  def assetBucketData(mongoData, fixedGraphVar)
    mongoData = bucketDataBy(mongoData, fixedGraphVar)
    # mongoData.each do |bucketKey, bucketVals|
    #   mongoData[bucketKey] = bucketDataBy(bucketVals, "collectionTime")
    # end
    return mongoData
  end

  def bucketDataByDate(mongoData)
    mongoData.each do |bucketKey, bucketVals|
      mongoData[bucketKey] = bucketByDate(bucketVals, "collectionTime")
    end
    return mongoData
  end

  def bucketByDate(mongoData, bucketBy)
    toReturn = {}
    mongoData.each do |instance|
      toReturn[instance[bucketBy]].nil? ? toReturn[instance[bucketBy]] = [instance] : toReturn[instance[bucketBy]].push(instance)
    end
    return toReturn
  end

  def bucketDataBy(mongoData, bucketBy)
    toReturn = {}
    mongoData.each do |instance|
      keyHash = {bucketBy => instance[bucketBy]}
      toReturn[keyHash].nil? ? toReturn[keyHash] = [instance] : toReturn[keyHash].push(instance)
    end
    return toReturn
  end

  def assetToGoogleCFormBar(asset, bucketedData, toVary, groupBy = "collectionTime")
    p toVary
    p bucketedData
    toReturn = {}
    bucketedData.each do |labelHash, instances|
      asset.statsToShow.each do |stat|
        currLabel = labelHash.keys.map {|k| k + " #{labelHash[k]}" }.join(" ") + " #{stat}"
        groupVars = allHashFieldValues(instances, groupBy).sort
        indVars = allHashFieldValues(instances, toVary).sort
        currChartArr = [[groupBy, *indVars, "average"]]
        currChartArr = assetAddDepVars(currChartArr, instances, groupVars, indVars, groupBy, toVary, stat)
        toReturn[currLabel] = currChartArr
      end
    end
    return toReturn
  end

  def assetToGoogleCFormPie(bucketedData, toVary)
    toReturn = {}
    bucketedData = bucketDataByDate(bucketedData)
    p bucketedData
    bucketedData.each do |labelHash, dateHash|
      dateHash.each do |date, instances|
        p labelHash.keys[0]
        p labelHash.values[0]
        p date
        currLabel = "#{labelHash.keys[0]} #{labelHash.values[0]} #{date}"
        currChartHash = {}
        instances.each do |instance|
          currIndVar = instance[toVary]
          currValue = instance["totalNumber"]
          currChartHash[currIndVar].nil? ? currChartHash[currIndVar] = currValue : currChartHash[currIndVar] = currValue
        end
        toReturn[currLabel] = [["",""]]+currChartHash.to_a
      end
    end
    return toReturn
  end

  def assetAddDepVars(currChartArr, instances, groupVars, indVars, groupBy, toVary, stat)
    groupVars.length.times {|x| currChartArr.push(Array.new(indVars.length+1, 0))}
    instances.each do |instance|
      groupIndex = groupVars.index(instance[groupBy]) + 1
      indVarIndex = indVars.index(instance[toVary]) + 1
      depVar = instance[stat]
      currChartArr[groupIndex][indVarIndex] = depVar
      currChartArr[groupIndex][0] = instance[groupBy]
    end
    currChartArr[1..-1].each do |dataArray|
      dataArray.push(dataArray[1..-1].sum/(dataArray.length-dataArray.count(0)-1))
    end
    return currChartArr
  end

## Mongo Aggregation methods ##

  def assetAggregateDB(asset)
    client = MongoClient.new("s7devdb2.corp.adobe.com", 27017, :pool_size => 15, :pool_timeout => 15)
    db = client['s7reporting']
    coll = db['companyAssetStats']

    matchVars = {"geo" => asset.geo, "company" => asset.companyID.map{|x| db['company'].find('companyName' => x).to_a[0]["company"]}, "assetType" => asset.assetType.map{|x| x.to_i}}
    # filters based on date fields
    dateMatchQuery = [{"$match" => {"collectionTime" => {"$gte" => toUTC(asset.startDate), "$lte" => toUTC(asset.endDate)}}}]
    # filters based on asset instance variable values
    varMatchQuery = assetGenMongoMatchQuery(asset, matchVars)
    # generates mongo aggregation framework group pipelineTask
    varGroupQuery = assetGenMongoGroupQuery(asset)
    # gets queried data from mongo
    aggOutput = coll.aggregate(dateMatchQuery + varMatchQuery + varGroupQuery)
    p dateMatchQuery + varMatchQuery + varGroupQuery
    client.close
    return aggOutput
  end

  # input: companyasset instance
  # output: Hash of the form {"$match" => {"companyName": "asics", "apiasset": "searchAssets"}}
  def assetGenMongoMatchQuery(asset, matchVars)
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

  # input input: String of the format "companyName, apiasset - numExecs:sum"
  # expected output: Hash of the form {"$group" => {_id: {companyName: "$companyName", apiasset: "$apiasset"}, sumnumExecs: {"$sum" => "$numExecs"}}}
  def assetGenMongoGroupQuery(asset)
    queryHash = {"_id" => {"collectionTime" => "$collectionTime"}}
    queryHash["_id"]["assetType"] = "$assetType" if not asset[:aggregateAssets] and not asset[:assetType].empty? and (asset[:assetType].length != 1 or asset[:assetType].include? "Display All")
    queryHash["_id"]["company"] = "$company" if asset[:company] and not asset[:aggregateCompanies] and asset[:companyID].length != 1

    if asset[:statsToShow].include? "totalFileSize"
      if asset[:aggregateCompanies] or asset[:aggregateAssets]
        queryHash["totalFileSize"] = {"$sum" => "$totalFileSize"}
      else
        queryHash["_id"]["totalFileSize"] = "$totalFileSize"
      end
    end
    if asset[:statsToShow].include? "totalNumber"
      if asset[:aggregateCompanies] or asset[:aggregateAssets]
        queryHash["totalNumber"] = {"$sum" => "$totalNumber"}
      else
        queryHash["_id"]["totalNumber"] = "$totalNumber"
      end
    end

    return [{"$group" => queryHash}]
  end

## End of Mongo Aggregation methods ##

## mongoData Prettify Methods ##

  def assetProcessData(mongoData, asset)
    mongoData = mergeIDHash(mongoData)
    mongoData = assetDateGroupData(mongoData, asset)
    mongoData = assetVerbosifyTypeFields(mongoData)
    return mongoData
  end

  def mergeIDHash(mongoData)
    toReturn = []
    mongoData.each do |instance|
      currHash = instance["_id"]
      instance.except("_id").keys.each do |var|
        currHash[var] = instance[var]
      end
      toReturn.push(currHash)
    end
    return toReturn
  end

  def assetVerbosifyTypeFields(mongoData)
    fields = mongoData[0].except("totalNumber", "totalFileSize", "collectionTime", "geo").keys
    @company, @assetType = {}, {}
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

## Date Grouping methods ##

  def assetDateGroupData(mongoData, asset)
    groupBy = asset.dateGroup
    if groupBy == "daily"
      mongoData.each do |instance|
        instance["collectionTime"] = instance["collectionTime"].to_s.split(" ")[0]
      end
      # return mongoData
    else 
      dateRanges = assetGenDateRanges(asset)
      mongoData.each do |instance|
        instance["collectionTime"] = selectDateRange(instance["collectionTime"], dateRanges)
      end
    end
    mongoData = assetAccumulateStats(mongoData)
    return mongoData.values
  end

  def assetAccumulateStats(mongoData)
    toReturn = {}
    stats = mongoData[0].except("collectionTime", "company", "geo", "assetType").keys
    mongoData.each do |instance|
      instKey = instance.except(*stats)
      if toReturn[instKey].nil?
        toReturn[instKey] = [instance.except("_id"), 1]
      else
        toReturn[instKey][1] += 1
        stats.each do |stat|
          toReturn[instKey][0][stat] += instance[stat]
        end
      end
    end
    toReturn.each do |key, valArr|
      stats.each do |stat|
          toReturn[key][0][stat] = valArr[0][stat]/valArr[1]
      end
      toReturn[key] = valArr[0]
    end
    return toReturn
  end

  def assetGenDateRanges(asset)
    toReturn = []
    startDate = asset.startDate
    endDate = asset.endDate
    intervalTime = genTimeInterval(asset.dateGroup)
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