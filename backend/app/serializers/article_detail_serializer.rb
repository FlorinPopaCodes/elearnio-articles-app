class ArticleDetailSerializer < ArticleSerializer
  include Typelizer::DSL

  typelize_from Article

  attributes :body
end
