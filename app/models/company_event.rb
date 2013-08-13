class CompanyEvent < ActiveRecord::Base
  attr_accessible :companyID, :endDate, :fileType, :geo, :logType, :selectedDisplays, :startDate, :dateGroup, :company, :aggregateLogs, :aggregateFiles, :aggregateCompanies

  serialize :selectedDisplays, Array
  serialize :companyID, Array
  serialize :logType, Array
  serialize :fileType, Array
  serialize :geo, Array

  validates :startDate, :presence => true
  validates :endDate, :presence => true
  validate :valid_date_range_required

  def valid_date_range_required
    if (startDate && endDate) && (endDate < startDate)
      errors.add(:endDate, "cannot be earlier than startDate")
    end
  end
end
