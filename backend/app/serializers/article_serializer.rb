class ArticleSerializer
  include Alba::Resource

  attributes :id, :title, :author_name, :comments_count, :created_at
end
