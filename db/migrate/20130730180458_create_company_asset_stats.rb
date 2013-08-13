class CreateCompanyAssetStats < ActiveRecord::Migration
  def change
    create_table :company_asset_stats do |t|
      t.text :companyID
      t.string :company
      t.text :geo
      t.text :assetType
      t.date :startDate
      t.date :endDate
      t.text :selectedDisplays
      t.string :dateGroup
      t.string :aggregateAssets
      t.string :aggregateCompanies
      t.text :statsToShow

      t.timestamps
    end
  end
end