# Model Guidelines

## Organization Order

1. Associations (`has_many`, `belongs_to`)
2. Validations (`validates`)
3. Scopes (`scope :name, -> { ... }`)
4. Callbacks (`after_commit`)
5. Public methods
6. Private methods

## Associations

- Every `has_many` should consider `counter_cache: true` on the inverse `belongs_to`
- Use `dependent: :destroy` when children should be removed with parent

## Validations

- Presence validations on required fields
- Match DB-level NOT NULL constraints

## Complex Logic

Extract methods over 15 lines into namespaced classes:
- `Article::EngagementQuery` — not `EngagementService`
- Lives in `app/models/article/engagement_query.rb`

## Cache Invalidation

Models own their cache invalidation via `after_commit` callbacks.
Cache keys must be consistent with what controllers use for `Rails.cache.fetch`.

## Scopes

Keep scopes simple and composable:
```ruby
scope :most_commented, ->(limit = 5) { order(comments_count: :desc).limit(limit) }
```
