class Comment < ApplicationRecord
  belongs_to :article, counter_cache: true, touch: true

  validates :body, :author_name, presence: true

  after_commit :invalidate_caches

  private

  def invalidate_caches
    article.invalidate_caches
  end
end
