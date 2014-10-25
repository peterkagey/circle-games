class Game < ActiveRecord::Base

  belongs_to :high_score
  before_save :simp_sol
  after_save :update_high_score
  attr_accessor :alec

  def high_score
    begin
      HighScore.find(level)
    rescue ActiveRecord::RecordNotFound
      HighScore.create(id:level, level:level)
    end
  end

  def update_high_score
    hs = high_score
    if hs.best_score.nil? || self.vertices <= hs.best_score
      hs.update(best_score: self.vertices, best_game_id: self.id, level: self.level)
    end
  end

  def simplify_solution(solution_string, max_a, max_b, sa, sb) # fix start_a and start_b when updating
    solution_ary = solution_string.split(",").map(&:to_i)
    a = max_a.to_i; b = max_b.to_i
    rows_removed = []; columns_removed = []

    for i in (0...solution_ary.length)
      start_a = i % a
      start_b = i / a
      break if solution_ary[i] > 0
    end

    solution_ary.each_slice(a){|s| s.sum != 0 ? rows_removed << s : b -= 1}
    rows_removed.transpose.each{|s| s.sum != 0 ? columns_removed << s : a -= 1}
    solution_ary = columns_removed.transpose.flatten
    solution_ary.each{|e| e == 0 ? start_a -= 1 : break}
    solution_string = solution_ary.join(",")
    if solution_string.blank?
      a = 1; b = 1; start_a = 0; start_b = 0
    end
    { 
      :solution => solution_string, 
      :new_a => a, 
      :new_b => b, 
      :start_a => sa.blank? ? start_a : sa.to_i, 
      :start_b => sb.blank? ? start_b : sb.to_i
    }
  end

  def simp_sol
    update = simplify_solution(self.solution, self.max_a.to_i, self.max_b.to_i, self.start_a, self.start_b)
    self.solution = update[:solution]
    self.max_a = update[:new_a]
    self.max_b = update[:new_b]
    self.start_a = update[:start_a]
    self.start_b = update[:start_b]
  end

  def self.string_to_text(string, a_width)
    ary = string.split(",")
    max_string_length = ary.map{|x| x.length}.max
    m = "%#{max_string_length}.#{max_string_length}s"
    new_string = ""
    ary.each_slice(a_width) do |s|
      new_string += s.map{|x| m % (x == "0" ? "" : x)}.join(" ") + "\n"
    end
    new_string
  end

  def self.peteys_little_special_function(n)
    seq = [0]
    k = a = 0
    (1..n).to_a.each do |i| 
      2.times do
        k.times do 
          a+=2
          seq << a
        end
        a += 1
        seq << a
      end
      k += 1
    end
    return seq
  end

  def self.a123663
    [0, 1, 2, 4, 5, 7, 8, 10, 12, 13, 15, 17, 18, 20, 22, 24, 25, 27, 29, 31, 32, 34, 36, 38, 40, 41, 43, 45, 47, 49, 50, 52, 54, 56, 58, 60, 61, 63, 65, 67, 69, 71, 72, 74, 76, 78, 80, 82, 84, 85, 87, 89, 91, 93, 95, 97, 98, 100, 102, 104, 106, 108, 110, 112, 113, 115, 117, 119]
  end
end
