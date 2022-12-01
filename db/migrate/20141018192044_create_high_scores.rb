class CreateHighScores < ActiveRecord::Migration[7.0]
  def change
    create_table :high_scores do |t|

      t.timestamps
    end
  end
end
