class AddBestGameIdToHighScore < ActiveRecord::Migration
  def change
    add_column :high_scores, :best_game_id, :integer
  end
end
