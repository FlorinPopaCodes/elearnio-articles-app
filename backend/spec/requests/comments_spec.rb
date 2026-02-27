require "rails_helper"

RSpec.describe "Comments API" do
  let(:article) { create(:article) }

  describe "GET /api/articles/:article_id/comments" do
    it "returns comments for the article ordered by newest first" do
      older = create(:comment, article: article, created_at: 1.day.ago)
      newer = create(:comment, article: article, created_at: Time.current)

      get "/api/articles/#{article.id}/comments"

      expect(response).to have_http_status(:ok)

      comments = response.parsed_body
      expect(comments.size).to eq(2)
      expect(comments.first["id"]).to eq(newer.id)
    end

    it "does not include comments from other articles" do
      create(:comment, article: article)
      other_article = create(:article)
      create(:comment, article: other_article)

      get "/api/articles/#{article.id}/comments"

      expect(response.parsed_body.size).to eq(1)
    end
  end

  describe "POST /api/articles/:article_id/comments" do
    context "with valid params" do
      it "creates a comment and returns 201" do
        params = { comment: { body: "Great article!", author_name: "Bob" } }

        expect { post "/api/articles/#{article.id}/comments", params: params, as: :json }
          .to change(article.comments, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(response.parsed_body["body"]).to eq("Great article!")
      end

      it "increments the article comments_count" do
        params = { comment: { body: "Nice!", author_name: "Bob" } }

        expect { post "/api/articles/#{article.id}/comments", params: params, as: :json }
          .to change { article.reload.comments_count }.by(1)
      end
    end

    context "with missing body" do
      it "returns 422 with validation errors" do
        params = { comment: { body: "", author_name: "Bob" } }

        post "/api/articles/#{article.id}/comments", params: params, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body["errors"]["body"]).to include("can't be blank")
      end
    end

    context "with non-existent article" do
      it "returns 404" do
        params = { comment: { body: "Hello", author_name: "Bob" } }

        post "/api/articles/999/comments", params: params, as: :json

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
