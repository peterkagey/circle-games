class CreateHighScores < ActiveRecord::Migration
  def change
    create_table :high_scores do |t|

      t.timestamps
    end
  end
end
