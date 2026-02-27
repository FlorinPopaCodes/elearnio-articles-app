class CommentSerializer
  include Alba::Resource

  attributes :id, :body, :author_name, :created_at
end
