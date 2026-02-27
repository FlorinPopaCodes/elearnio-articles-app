class ArticleSerializer
  include Alba::Resource
  include Typelizer::DSL

  attributes :id, :title, :author_name, :comments_count, :created_at
end
