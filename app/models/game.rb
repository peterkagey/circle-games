class Game < ActiveRecord::Base
	
# before_save :simp_sol
# attr_accessor :max_a, :max_b
# end

# pk = some_string
# pk2 = pk.split(",").map(&:to_i)

  def simplify_solution(pk, a_size)
    pk2 = pk.split(",").map(&:to_i)
    a = []; a2 = []
    pk2.each_slice(a_size){|s| a << s if s.sum != 0}
    a.transpose.each{|s| a2 << s if s.sum != 0}
    a2.transpose.flatten.join(",")
  end

  def simp_sol
    self.solution = simplify_solution(self.solution, self.max_a.to_i)
  end

  def string_to_text(string, a_width)
    ary = string.split(",")
    max_string_length = ary.map{|x| x.length}.max
    m = "%#{max_string_length}.#{max_string_length}s"
    new_string = ""
    ary.each_slice(a_width) do |s|
      new_string += s.map{|x| m % (x == "0" ? "" : x)}.join(" ") + "\n"
    end
    new_string
  end
end