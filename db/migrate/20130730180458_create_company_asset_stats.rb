class CreateCompanyAssetStats < ActiveRecord::Migration
  def change
    create_table :company_asset_stats do |t|
      t.integer :companyID
      t.string :geo
      t.integer :assetType
      t.date :startTime
      t.date :endTime

      t.timestamps
    end
  end
end
