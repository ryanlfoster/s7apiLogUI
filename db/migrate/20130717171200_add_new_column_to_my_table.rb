class AddNewColumnToMyTable < ActiveRecord::Migration
  def change
  	add_column :db_calls, :dateGroup, :string
  end
end
