class GamesController < ApplicationController

	def index
		@game = Game.new
	end

	def create #FIXME, confirm score
		Game.create(params.require(:game).permit(:vertices, :level, :solution, :max_a))
		redirect_to games_path
	end
end
