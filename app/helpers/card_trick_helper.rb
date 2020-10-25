module CardTrickHelper
  def cards_to_show(cards)
    number_of_cards = cards.length
    remainder = cards.reduce(:+) % number_of_cards
    sorted_cards = cards.sort
    sorted_cards[0...remainder] + sorted_cards[remainder + 1...number_of_cards]
  end

  # Shown cards: {23, 27, 59, 87}
  # The card could be congruent to 4 and (0, 23)
  # The card could be congruent to 0 and (24,27)
  # The card could be congruent to 1 and (28,59)
  # The card could be congruent to 2 and (60,87)
  # The card could be congruent to 3 and (87,125)
  def possible_values(shown_cards)
    n = shown_cards.length + 1
    remainder = shown_cards.reduce(:+) % n
    ranges = [0] + shown_cards.sort + [a030495(shown_cards.length) + 1]
    ranges
      .zip(ranges.drop(1))[0...-1]
      .map { |a,b| (a+1...b) }
      .each_with_index.flat_map { |r, i| r.select { |x| (x + remainder) % n == i} }
  end

  def assistant_order(cards)
    shown_cards = cards_to_show(cards)
    missing_card = (cards - shown_cards)[0]
    cards_that_can_be_communicated = possible_values(shown_cards)
    card_index = cards_that_can_be_communicated.find_index(missing_card)
    (0...shown_cards.length)
      .to_a
      .permutation
      .to_a[card_index]
      .map { |i| shown_cards[i] }
  end

  def magician_guess(shown_cards)
    possibilities = possible_values(shown_cards)
    index = shown_cards.sort.permutation.to_a.find_index(shown_cards)
    possibilities[index]
  end

  def a030495(n);
    (2..n+1).reduce(1, :*) + n
  end
end
