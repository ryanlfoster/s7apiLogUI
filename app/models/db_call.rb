class DbCall < ActiveRecord::Base
  attr_accessible :statsQueried, :pipelineTask, :indVars, :startDate, :endDate, :selectedDisplays, :dateGroup

  validates :startDate, :presence => true
  validates :endDate, :presence => true
  validate :valid_date_range_required

  def valid_date_range_required
    if (startDate && endDate) && (endDate < startDate)
      errors.add(:endDate, "must be later than start date")
    end
  end
end
