class HighScoresController < ApplicationController

	def show #FIXME, confirm score
		@high_score = HighScore.find(params[:id])
	end	
end
