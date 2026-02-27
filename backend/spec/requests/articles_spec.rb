require "rails_helper"

RSpec.describe "Articles API" do
  describe "GET /api/articles" do
    it "returns all articles ordered by creation date descending" do
      older = create(:article, created_at: 1.day.ago)
      newer = create(:article, created_at: Time.current)

      get "/api/articles"

      expect(response).to have_http_status(:ok)

      articles = response.parsed_body
      expect(articles.size).to eq(2)
      expect(articles.first["id"]).to eq(newer.id)
    end

    it "includes comments_count in the response" do
      article = create(:article)
      create_list(:comment, 3, article: article)

      get "/api/articles"

      expect(response.parsed_body.first["comments_count"]).to eq(3)
    end

    it "does not include the article body" do
      create(:article)

      get "/api/articles"

      expect(response.parsed_body.first).not_to have_key("body")
    end
  end

  describe "GET /api/articles/:id" do
    it "returns the article with body" do
      article = create(:article)

      get "/api/articles/#{article.id}"

      expect(response).to have_http_status(:ok)

      body = response.parsed_body
      expect(body["id"]).to eq(article.id)
      expect(body["title"]).to eq(article.title)
      expect(body["body"]).to eq(article.body)
    end

    it "returns 404 for non-existent article" do
      get "/api/articles/999"

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/articles" do
    context "with valid params" do
      it "creates an article and returns 201" do
        params = { article: { title: "New Article", body: "Content", author_name: "Alice" } }

        expect { post "/api/articles", params: params, as: :json }
          .to change(Article, :count).by(1)

        expect(response).to have_http_status(:created)

        body = response.parsed_body
        expect(body["title"]).to eq("New Article")
        expect(body["body"]).to eq("Content")
      end
    end

    context "with missing title" do
      it "returns 422 with validation errors" do
        params = { article: { title: "", body: "Content", author_name: "Alice" } }

        post "/api/articles", params: params, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body["errors"]["title"]).to include("can't be blank")
      end
    end

    context "with missing body" do
      it "returns 422 with validation errors" do
        params = { article: { title: "Title", body: "", author_name: "Alice" } }

        post "/api/articles", params: params, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body["errors"]["body"]).to include("can't be blank")
      end
    end

    context "with missing author_name" do
      it "returns 422 with validation errors" do
        params = { article: { title: "Title", body: "Content", author_name: "" } }

        post "/api/articles", params: params, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body["errors"]["author_name"]).to include("can't be blank")
      end
    end
  end

  describe "cache invalidation" do
    it "reflects new articles in subsequent list requests" do
      get "/api/articles"
      expect(response.parsed_body.size).to eq(0)

      create(:article)

      get "/api/articles"
      expect(response.parsed_body.size).to eq(1)
    end

    it "reflects updated comments_count after a comment is added" do
      article = create(:article)

      get "/api/articles"
      expect(response.parsed_body.first["comments_count"]).to eq(0)

      create(:comment, article: article)

      get "/api/articles"
      expect(response.parsed_body.first["comments_count"]).to eq(1)
    end
  end
end
