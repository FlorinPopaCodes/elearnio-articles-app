class EngagementSerializer
  include Alba::Resource

  attributes :total_articles, :total_comments

  many :most_commented, resource: ArticleSerializer
end
