class EngagementController < ApplicationController
  def show
    data = Rails.cache.fetch("engagement") { Article::EngagementQuery.call }

    render json: EngagementSerializer.new(data).serialize
  end
end
