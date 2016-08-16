class CreateTreeGenerators < ActiveRecord::Migration
  def change
    create_table :tree_generators do |t|

      t.timestamps null: false
    end
  end
end
