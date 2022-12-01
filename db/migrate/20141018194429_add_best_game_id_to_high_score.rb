class AddBestGameIdToHighScore < ActiveRecord::Migration[7.0]
  def change
    add_column :high_scores, :best_game_id, :integer
  end
end
