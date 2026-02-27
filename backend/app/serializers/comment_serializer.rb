class CommentSerializer
  include Alba::Resource
  include Typelizer::DSL

  attributes :id, :body, :author_name, :created_at
end
