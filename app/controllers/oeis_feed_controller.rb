class OeisFeedController < ApplicationController

  def feed
    author = params[:author]

    search_params = author.blank? ? "keyword%3Anice" : "author%3A#{author}&"
    url = URI.parse("http://oeis.org/search?q=#{search_params}&sort=created&fmt=json")
    req = Net::HTTP::Get.new(url.to_s)
    res = Net::HTTP.start(url.host, url.port) { |http| http.request(req) }
    @oeis_sequences = JSON.parse(res.body)["results"] || []

    @author_name = author.blank? ? "OEIS contributors" : author.split(",").map(&:camelize).join(" ")
    @description = "Most recent OEIS Sequences authored by #{@author_name}"
    @title = "New OEIS Sequences from #{@author_name}"

    respond_to do |format|
      format.rss { render :layout => false }
    end
  end

end
