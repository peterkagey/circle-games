class AddBestScoreToHighScore < ActiveRecord::Migration[7.0]
  def change
    add_column :high_scores, :best_score, :integer
  end
end
