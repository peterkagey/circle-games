class TreeGeneratorController < ApplicationController
  def index
    @foo = TreeGenerator.new(40).tree.to_s
  end
end
