module CompanyAssetStatsHelper
  
  def assetTableData(asset)
    mongoData = assetAggregateDB(asset)
    return [] if mongoData.empty?
    mongoData = processData(mongoData, asset)
    toReturn = [mongoData[0].keys]
    mongoData.each do |instance|
      toReturn.push(instance.values)
    end
    return toReturn
  end

  def assetBarChartData(asset)
    mongoData = assetAggregateDB(asset)
    return [] if mongoData.empty?
    mongoData = processData(mongoData, asset)
    depVars = ["totalNumber", "collectionTime"]
    indVars = mongoData[0].except(*depVars).keys
    toVary = assetMostVaried(mongoData, indVars)
    bucketedData = bucketData(mongoData, depVars+[toVary])
    toReturn = assetToGoogleCFormBar(bucketedData, toVary)
    return toReturn
  end

  def assetPieChartData(asset)
    mongoData = assetAggregateDB(asset)
    return [] if mongoData.empty?
    mongoData = processData(mongoData, asset)
    depVars = ["totalNumber", "collectionTime"]
    indVars = mongoData[0].except(*depVars).keys
    toVary = assetMostVaried(mongoData, indVars)
    bucketedData = bucketData(mongoData, depVars+[toVary])
    p bucketedData
    toReturn = assetToGoogleCFormPie(bucketedData, toVary)
    return toReturn
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
    assetTypeQueried = (not asset[:aggregateAssets] and not asset[:assetType].empty? and not asset[:assetType].include? "Select None")
    companyQueried = asset[:company] and not asset[:aggregateCompanies]
    queryHash["_id"]["assetType"] = "$assetType" if assetTypeQueried
    queryHash["_id"]["company"] = "$company" if companyQueried

    if asset[:statsToShow].include? "total"
      if asset[:aggregateCompanies] or asset[:aggregateAssets]
        queryHash["totalFileSize"] = {"$sum" => "$totalFileSize"}
      else
        queryHash["_id"]["totalFileSize"] = "$totalFileSize"
      end
    end
    if asset[:statsToShow].include? "size"
      if asset[:aggregateCompanies] or asset[:aggregateAssets]
        queryHash["totalNumber"] = {"$sum" => "$totalNumber"}
      else
        queryHash["_id"]["totalNumber"] = "$totalNumber"
      end
    end

    return [{"$group" => queryHash}]
  end

## End of Mongo Aggregation methods ##

end