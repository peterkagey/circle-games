class SquareGamesController < ApplicationController

	def index
		@game = SquareGame.new
		@jshash = "", 0, 0, 0, 0
	end

	def create #FIXME, confirm score
		@game = SquareGame.new(params.require(:square_game).permit(:vertices, :level, :solution, :max_a, :max_b, :start_a, :start_b))
		if @game.save
			redirect_to(@game)
		else
			g2 = SquareGame.where(solution:@game.solution, max_a:@game.max_a).first
			redirect_to(g2)
		end
	end

	def show #FIXME, confirm score
		begin
			@game = SquareGame.find(params[:id])
			@jshash = @game.solution, @game.max_a, @game.max_b, @game.start_a, @game.start_b
		rescue ActiveRecord::RecordNotFound
			@game = SquareGame.new
			@jshash = "", 0, 0, 0, 0
		end
	end	

	def level_solution
		@games = params[:game_id].nil? ? SquareGame.all : SquareGame.where(level:params[:game_id])
		# @games = params[:game_id].nil? ? "SquareGame.all" : "foobar"

	end

end
