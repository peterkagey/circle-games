class AddBestScoreToHighScore < ActiveRecord::Migration
  def change
    add_column :high_scores, :best_score, :integer
  end
end
