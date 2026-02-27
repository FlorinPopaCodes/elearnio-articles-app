class ArticlesController < ApplicationController
  def index
    articles = Rails.cache.fetch("articles/list") { Article.order(created_at: :desc).to_a }

    render json: ArticleSerializer.new(articles).serialize
  end

  def show
    article = Article.find(params[:id])
    return unless stale?(article)

    render json: ArticleDetailSerializer.new(article).serialize
  end

  def create
    article = Article.new(article_params)

    if article.save
      render json: ArticleDetailSerializer.new(article).serialize, status: :created
    else
      render json: { errors: article.errors }, status: :unprocessable_content
    end
  end

  private

  def article_params
    params.expect(article: [:title, :body, :author_name])
  end
end
