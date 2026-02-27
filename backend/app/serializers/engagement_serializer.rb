class EngagementSerializer
  include Alba::Resource
  include Typelizer::DSL

  attributes :total_articles, :total_comments

  many :most_commented, resource: ArticleSerializer
end
