require "rails_helper"

RSpec.describe "Engagement API" do
  describe "GET /api/engagement" do
    it "returns total articles and comments counts" do
      articles = create_list(:article, 3)
      articles.each { |a| create_list(:comment, 2, article: a) }

      get "/api/engagement"

      expect(response).to have_http_status(:ok)

      body = response.parsed_body
      expect(body["total_articles"]).to eq(3)
      expect(body["total_comments"]).to eq(6)
    end

    it "returns the top 5 most commented articles" do
      articles = create_list(:article, 7)
      articles.each_with_index { |a, i| create_list(:comment, i, article: a) }

      get "/api/engagement"

      most_commented = response.parsed_body["most_commented"]
      expect(most_commented.size).to eq(5)
      expect(most_commented.first["comments_count"]).to be >= most_commented.last["comments_count"]
    end

    it "returns empty data when no articles exist" do
      get "/api/engagement"

      body = response.parsed_body
      expect(body["total_articles"]).to eq(0)
      expect(body["total_comments"]).to eq(0)
      expect(body["most_commented"]).to be_empty
    end

    it "reflects new data after article creation" do
      get "/api/engagement"
      expect(response.parsed_body["total_articles"]).to eq(0)

      create(:article)

      get "/api/engagement"
      expect(response.parsed_body["total_articles"]).to eq(1)
    end
  end
end
