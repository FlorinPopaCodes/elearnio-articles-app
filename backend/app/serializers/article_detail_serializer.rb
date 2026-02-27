class ArticleDetailSerializer < ArticleSerializer
  include Typelizer::DSL

  attributes :body
end
