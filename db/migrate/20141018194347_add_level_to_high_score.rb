class AddLevelToHighScore < ActiveRecord::Migration[7.0]
  def change
    add_column :high_scores, :level, :integer
  end
end
