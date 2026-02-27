class EngagementSerializer
  include Alba::Resource
  include Typelizer::DSL

  typelize total_articles: :number, total_comments: :number

  attributes :total_articles, :total_comments

  many :most_commented, resource: ArticleSerializer
end
