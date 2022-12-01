class CreateTriangleGames < ActiveRecord::Migration[7.0]
  def change
    create_table :triangle_games do |t|
      t.integer :vertices
      t.integer :level
      t.integer :start_a
      t.integer :start_b
      t.text :solution

      t.timestamps
    end
  end
end
