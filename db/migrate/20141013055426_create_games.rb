class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :vertices
      t.integer :level
      t.text :solution
      t.integer :max_a
      t.integer :max_b
      t.integer :start_a
      t.integer :start_b

      t.timestamps
    end
  end
end
