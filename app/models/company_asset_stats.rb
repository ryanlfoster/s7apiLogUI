class CompanyAssetStats < ActiveRecord::Base
  attr_accessible :assetType, :companyID, :endTime, :geo, :startTime
  serialize :companyID, Array
  serialize :assetType, Array
  serialize :geo, Array

  validates :startTime, :presence => true
  validates :endTime, :presence => true
  validate :valid_date_range_required

  def valid_date_range_required
    if (startTime && endTime) && (endTime < startTime)
      errors.add(:endTime, "must be later than start date")
    end
  end
end
