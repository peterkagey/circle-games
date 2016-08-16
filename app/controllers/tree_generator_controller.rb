class TreeGeneratorController < ApplicationController
  def index
    @random_tree = TreeGenerator.new(40).tree.to_s
  end
end
