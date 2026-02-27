require "rails_helper"

RSpec.describe Article do
  describe "validations" do
    it "is valid with all required attributes" do
      article = build(:article)
      expect(article).to be_valid
    end

    it "requires a title" do
      article = build(:article, title: nil)
      expect(article).not_to be_valid
      expect(article.errors[:title]).to include("can't be blank")
    end

    it "requires a body" do
      article = build(:article, body: nil)
      expect(article).not_to be_valid
      expect(article.errors[:body]).to include("can't be blank")
    end

    it "requires an author_name" do
      article = build(:article, author_name: nil)
      expect(article).not_to be_valid
      expect(article.errors[:author_name]).to include("can't be blank")
    end
  end

  describe ".most_commented" do
    it "returns articles ordered by comments_count descending, limited to 5" do
      articles = create_list(:article, 7)
      articles.each_with_index { |a, i| create_list(:comment, i, article: a) }

      result = described_class.most_commented
      expect(result.size).to eq(5)
      expect(result.first.comments_count).to be >= result.last.comments_count
    end
  end

  describe "counter_cache" do
    it "increments comments_count when a comment is added" do
      article = create(:article)
      expect { create(:comment, article: article) }
        .to change { article.reload.comments_count }.from(0).to(1)
    end
  end
end
