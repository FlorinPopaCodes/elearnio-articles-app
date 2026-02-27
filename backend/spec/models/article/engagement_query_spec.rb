require "rails_helper"

RSpec.describe Article::EngagementQuery do
  describe ".call" do
    it "returns total articles and comments from a single query" do
      articles = create_list(:article, 3)
      articles.each { |a| create_list(:comment, 2, article: a) }

      result = described_class.call

      expect(result.total_articles).to eq(3)
      expect(result.total_comments).to eq(6)
    end

    it "returns the top 5 most commented articles" do
      articles = create_list(:article, 7)
      articles.each_with_index { |a, i| create_list(:comment, i, article: a) }

      result = described_class.call

      expect(result.most_commented.size).to eq(5)
      expect(result.most_commented.first.comments_count).to be >= result.most_commented.last.comments_count
    end

    it "returns zeros when no data exists" do
      result = described_class.call

      expect(result.total_articles).to eq(0)
      expect(result.total_comments).to eq(0)
      expect(result.most_commented).to be_empty
    end
  end
end
