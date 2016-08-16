class Tree
  attr_reader :right, :left

  def self.build(size)
  end

  def initialize(left, right)
    @left, @right = left, right
  end

  def ==(other)
    !(is_a?(Leaf) ^ other.is_a?(Leaf)) &&
    left == other.left && right == other.right
  end

  def to_s; @to_s ||= TreeDrawer.make_string(self) end
  def to_a; @to_a ||= TreeDrawer.make_array(self) end

  # def inspect
  #   return "L" if is_a?(Leaf)
  #   return "*" if nil?
  #   "T(#{@left.inspect}, #{@right.inspect})"
  # end
end

class Leaf < Tree; def initialize; end end

class TreeDrawer; class << self
  def make_array(tree)
    return [] if tree == Leaf.new
    base = concat(tree.left.to_a, tree.right.to_a)
    with_a_top(base)
  end

  def make_string(tree)
    array = make_array(tree)
    len = array.length

    array
    .each_with_index
    .map { |row, i| " " * (len - i - 1) + row }
    .join(?\n)
  end

  private

  def smoosh(left, right)
    left.zip(right).map { |l, r| l + r }
  end

  def concat(l, r)
    l.length > r.length ? concat_right(l, r) : concat_left(l, r)
  end

  def concat_right(left, right)
    right_addendum = Array.new(left.length - right.length) {"#{buffer(right)}╲"}
    right_justified = right.map { |str| str.rjust(2 * right.length + 2) }
    new_right = right_addendum + right_justified
    smoosh(left, new_right)
  end

  def concat_left(left, right)
    left_addendum = Array.new(right.length - left.length) { "╱#{buffer(left)}" }
    left_justified = left.map { |str| str.ljust(2 * left.length + 2) }
    new_left = left_addendum + left_justified
    smoosh(new_left, right)
  end

  def buffer(ary)
    size = ary == [] ? 1 : ary.last.length + 1
    " " * size
  end

  def with_a_top(ary)
    return ["╱╲"] if ary == []
    levels_needed = ary.last.length/2 - ary.length
    top = (0...levels_needed).map { |i| ?╱ + " " * i * 2 + ?╲ }
    top + ary
  end

end end

###############################################

class Array
  def cumulative_sum
    sum = 0
    map { |i| sum += i }
  end
end

class TreeGenerator

  def initialize(size)
    @size = size
  end

  def tree
    return Leaf.new if @size == 0
    sub_tree_size = first_tree_size(@size)
    @right_tree = TreeGenerator.new(sub_tree_size).tree
    @left_tree = TreeGenerator.new(@size - sub_tree_size - 1).tree
    Tree.new(@right_tree, @left_tree)
  end

  def catalan(n)
    return 1 if n < 2
    (2..n).map { |k| Rational(n + k)/k }.reduce(:*).to_i
  end

  def distribution(n)
    (0..n-1).map { |i| catalan(i) * catalan(n - i - 1) }
  end

  def first_tree_size(n)
    cum_sum = distribution(n).cumulative_sum
    threshold = rand(1..cum_sum.last)
    cum_sum.each_with_index.find { |e, _| e >= threshold }.last
  end

end
