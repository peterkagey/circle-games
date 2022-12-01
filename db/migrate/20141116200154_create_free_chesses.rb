class CreateFreeChesses < ActiveRecord::Migration[7.0]
  def change
    create_table :free_chesses do |t|

      t.timestamps
    end
  end
end
