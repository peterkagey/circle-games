class AddLevelToHighScore < ActiveRecord::Migration
  def change
    add_column :high_scores, :level, :integer
  end
end
