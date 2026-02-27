class CommentsController < ApplicationController
  def index
    article = Article.find(params[:article_id])

    comments = Rails.cache.fetch("articles/#{article.id}/comments") do
      article.comments.order(created_at: :desc).to_a
    end

    render json: CommentSerializer.new(comments).serialize
  end

  def create
    article = Article.find(params[:article_id])
    comment = article.comments.new(comment_params)

    if comment.save
      render json: CommentSerializer.new(comment).serialize, status: :created
    else
      render json: { errors: comment.errors }, status: :unprocessable_content
    end
  end

  private

  def comment_params
    params.expect(comment: [:body, :author_name])
  end
end
