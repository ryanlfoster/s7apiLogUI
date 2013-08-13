class CreateCompanyEvents < ActiveRecord::Migration
  def change
    create_table :company_events do |t|
      t.text :companyID
      t.string :company
      t.text :geo
      t.text :logType
      t.text :fileType
      t.text :selectedDisplays
      t.date :startDate
      t.date :endDate
      t.string :dateGroup
      t.string :aggregateLogs
      t.string :aggregateFiles
      t.string :aggregateCompanies

      t.timestamps
    end
  end
end
