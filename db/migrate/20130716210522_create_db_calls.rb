class CreateDbCalls < ActiveRecord::Migration
  def change
    create_table :db_calls do |t|
      t.string :indVars
      t.string :statsQueried
      t.string :pipelineTask
      t.string :selectedDisplays
      t.date :startDate
      t.date :endDate

      t.timestamps
    end
  end
end
