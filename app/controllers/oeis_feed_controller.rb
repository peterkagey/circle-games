class OeisFeedController < ApplicationController

  def feed
    author = params[:author]
    search = params[:search]
    sort_order   = params[:sort] || "created"

    search_params = []
    search_params << "author%3A#{author}" unless author.blank?
    search_params << search               unless search.blank?
    search_params = ["keyword%3Anice"]    if search_params.empty?
    search_params = search_params.join("+")

    url = URI.parse("http://oeis.org/search?q=#{search_params}&sort=#{sort_order}&fmt=json")
    req = Net::HTTP::Get.new(url.to_s)
    res = Net::HTTP.start(url.host, url.port) { |http| http.request(req) }
    @oeis_sequences = JSON.parse(res.body)["results"] || []

    @author_name = author.blank? ? "OEIS contributors" : author.split(/,|%2c/i).map(&:camelize).join(" ")
    @description = "Most recent OEIS Sequences authored by #{@author_name}"
    @title = url

    respond_to do |format|
      format.rss { render :layout => false }
    end
  end

end
