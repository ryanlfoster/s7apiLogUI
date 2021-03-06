# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130801201139) do

  create_table "company_asset_stats", :force => true do |t|
    t.text     "companyID"
    t.string   "company"
    t.text     "geo"
    t.text     "assetType"
    t.date     "startDate"
    t.date     "endDate"
    t.text     "selectedDisplays"
    t.string   "dateGroup"
    t.string   "aggregateAssets"
    t.string   "aggregateCompanies"
    t.text     "statsToShow"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  create_table "company_events", :force => true do |t|
    t.text     "companyID"
    t.string   "company"
    t.text     "geo"
    t.text     "logType"
    t.text     "fileType"
    t.text     "selectedDisplays"
    t.date     "startDate"
    t.date     "endDate"
    t.string   "dateGroup"
    t.string   "aggregateLogs"
    t.string   "aggregateFiles"
    t.string   "aggregateCompanies"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  create_table "db_calls", :force => true do |t|
    t.string   "indVars"
    t.string   "statsQueried"
    t.string   "pipelineTask"
    t.string   "selectedDisplays"
    t.date     "startDate"
    t.date     "endDate"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
    t.string   "dateGroup"
  end

end
