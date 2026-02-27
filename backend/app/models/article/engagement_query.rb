class Article::EngagementQuery
  Result = Data.define(:total_articles, :total_comments, :most_commented)

  def self.call
    total_articles, total_comments = Article.pick(Arel.sql("COUNT(*), COALESCE(SUM(comments_count), 0)"))

    Result.new(
      total_articles:,
      total_comments:,
      most_commented: Article.most_commented.to_a
    )
  end
end
