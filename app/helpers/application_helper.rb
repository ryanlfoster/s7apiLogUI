module ApplicationHelper

  # Given a string, returns an array separating the string by commas with white space removed
  def arrToString(inputArray)
    return inputArray.join(", ")
  end

  def fieldLookup(fieldName, docID)
    fieldName != "company" ? typeName = "typeName" : typeName = "companyName"
    fieldName != "company" ? collection = fieldName + "s" : collection = fieldName
    client = MongoClient.new("s7devdb2.corp.adobe.com", 27017, :pool_size => 15, :pool_timeout => 15)
    db = client['s7reporting']
    coll = db[collection]
    doc = coll.find(fieldName => docID).to_a
    return doc[0][typeName]
  end

  def allFieldValues(collection, nameField, idField)
    client = MongoClient.new("s7devdb2.corp.adobe.com", 27017, :pool_size => 15, :pool_timeout => 15)
    db = client['s7reporting']
    coll = db[collection]
    toReturn = []
    coll.find.each { |doc| toReturn.push([doc[nameField], doc[idField]]) }
    return toReturn.uniq.sort
  end

end
