class HighScore < ActiveRecord::Base

has_many :square_games, foreign_key: "level"
after_save :make_level_match_id

def make_level_match_id
	if self.level.nil?
		self.level = self.id
	end
end

end
