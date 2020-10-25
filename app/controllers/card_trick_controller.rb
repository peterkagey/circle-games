class CardTrickController < ApplicationController
  include CardTrickHelper
  def index
    audience_numbers = params[:audience_numbers] || ""
    parsed_audience_sequence = audience_numbers.split(",").map(&:to_i)
    @audience_numbers_text = parsed_audience_sequence.empty? ? "27, 87, 93, 23, 59" : audience_numbers
    @assistant_list = parsed_audience_sequence.empty? ? "[?, ?, ?, ?]" : assistant_order(parsed_audience_sequence)

    ordered_sequence_from_assistant = params[:ordered_sequence_from_assistant] || ""
    parsed_assistant_sequence = ordered_sequence_from_assistant.split(",").map(&:to_i)
    @assistant_numbers_text = parsed_assistant_sequence.empty? ? "59, 87, 27, 23" : ordered_sequence_from_assistant
    @magician_number = parsed_assistant_sequence.empty? ? "???" : magician_guess(parsed_assistant_sequence)
  end
end
