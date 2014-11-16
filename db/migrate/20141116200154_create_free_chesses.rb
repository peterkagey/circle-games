class CreateFreeChesses < ActiveRecord::Migration
  def change
    create_table :free_chesses do |t|

      t.timestamps
    end
  end
end
