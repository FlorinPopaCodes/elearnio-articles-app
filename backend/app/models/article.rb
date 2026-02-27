class Article < ApplicationRecord
  has_many :comments, dependent: :destroy

  validates :title, :body, :author_name, presence: true

  scope :most_commented, ->(limit = 5) { order(comments_count: :desc).limit(limit) }

  after_commit :invalidate_caches

  def invalidate_caches
    Rails.cache.delete("articles/#{id}/comments")

    Rails.cache.delete("articles/list")
    Rails.cache.delete("engagement")
  end

end
