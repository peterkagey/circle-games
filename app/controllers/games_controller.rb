class GamesController < ApplicationController

	def index
		@game = Game.new
	end

	def create #FIXME, confirm score
		@game = Game.new(params.require(:game).permit(:vertices, :level, :solution, :max_a, :max_b, :start_a, :start_b))
		if @game.save
			redirect_to(@game)
		else
			g2 = Game.where(solution:@game.solution, max_a:@game.max_a).first
			redirect_to(g2)
		end
	end

	def show #FIXME, confirm score
		@game = params[:id].nil? ? Game.new : Game.find(params[:id])
	end	

	def level_solution
		@games = params[:game_id].nil? ? "Game.all" : Game.where(level:params[:game_id])
		# @games = params[:game_id].nil? ? "Game.all" : "foobar"

	end

end
