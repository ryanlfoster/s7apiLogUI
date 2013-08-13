class CompanyAssetStat < ActiveRecord::Base
  attr_accessible :assetType, :companyID, :endDate, :geo, :startDate, :selectedDisplays, :dateGroup, :company, :aggregateAssets, :aggregateCompanies, :statsToShow
  serialize :selectedDisplays, Array
  serialize :companyID, Array
  serialize :assetType, Array
  serialize :geo, Array
  serialize :statsToShow, Array

  validates :startDate, :presence => true
  validates :endDate, :presence => true
  validate :valid_date_range_required

  def valid_date_range_required
    if (startDate && endDate) && (endDate < startDate)
      errors.add(:endDate, "cannot be earlier than startDate")
    end
  end
end