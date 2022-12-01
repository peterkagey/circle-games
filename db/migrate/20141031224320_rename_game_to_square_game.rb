class RenameGameToSquareGame < ActiveRecord::Migration[7.0]
    def change
        rename_table :games, :square_games
    end
 end
