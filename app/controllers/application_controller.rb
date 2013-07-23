require 'mongo'

include Mongo

class ApplicationController < ActionController::Base
  protect_from_forgery

  # Given a string, returns an array separating the string by commas with white space removed
  def sepByComma(inputString)
    return inputString.split(",").collect(&:strip)
  end

  # Given a string, returns an array separating the string by colons with white space removed
  def sepByColon(kvString)
    return kvString.split(":").collect{|x| x.strip}
  end

  # input input: String of the format "companyName: asics, apiEvent: searchAssets"
  # expected output: Hash of the form {"$match" => {"companyName": "asics", "apiEvent": "searchAssets"}}
  def genMongoMatchQuery(toDefine)
    queryHash = {}
    toDefine.each do |key, valArr|
      if valArr.length > 1
        queryHash[key] = {"$in" => valArr}
      elsif valArr.length == 1
        queryHash[key] = valArr[0]
      end
    end
    return {"$match" => queryHash}
  end

  # input input: String of the format "numExecs, meanExecTime"
  # expected output: Hash of the form {"$project" => {companyName: 1, apiEvent: 1, numExecs: 1, meanExecTime: 1}}
  def genMongoProjQuery(toShow)
    queryHash = {}
    toShow.each do |var|
      queryHash[var] = 1
    end
    return {"$project" => queryHash}
  end

  # input input: String of the format "companyName, apiEvent - numExecs:sum"
  # expected output: Hash of the form {"$group" => {_id: {companyName: "$companyName", apiEvent: "$apiEvent"}, sumnumExecs: {"$sum" => "$numExecs"}}}
  def genMongoGroupQuery(toGroup, statsQueried)
    queryHash = {"_id" => {"requestDate" => "$requestDate"}}
    toGroup.each do |var|
        queryHash["_id"].nil? ? queryHash["_id"] = {var => "$#{var}"} : queryHash["_id"][var] = "$#{var}"
    end

    statOperation = { "numExecs" => "sum",
                      "minExecTime" => "min",
                      "maxExecTime" => "max",
                      "medExecTime" => "avg",
                      "meanExecTime" => "avg" }

    statsQueried.each do |stat|
      queryHash[stat] = {"$#{statOperation[stat]}" => "$#{stat}"}
    end

    return {"$group" => queryHash}
  end

  def genPipeline(db_call, toDefine, toGroup, statsQueried)
    pipelineTasks = []

    if not toDefine.empty?
      pipelineTasks.push(genMongoMatchQuery(toDefine))
    end
    
    if not toGroup.empty?
      if statsQueried.empty?
        pipelineTasks.push(genMongoProjQuery(toGroup))
      else
        pipelineTasks.push(genMongoGroupQuery(toGroup, statsQueried))
      end
    end

    return pipelineTasks.to_s
  end
end
