class CreateTreeGenerators < ActiveRecord::Migration[7.0]
  def change
    create_table :tree_generators do |t|

      t.timestamps null: false
    end
  end
end
