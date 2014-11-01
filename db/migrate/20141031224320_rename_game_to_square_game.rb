class RenameGameToSquareGame < ActiveRecord::Migration
    def change
        rename_table :games, :square_games
    end 
 end