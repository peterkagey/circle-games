class GamesController < ApplicationController

	def index
		@game = Game.new
	end

	def create #FIXME, confirm score
		Game.create(params.require(:game).permit(:vertices, :level, :solution, :max_a, :max_b))
		redirect_to games_path
	end

	def show #FIXME, confirm score
		@game = Game.find(params[:id])
	end	

end
