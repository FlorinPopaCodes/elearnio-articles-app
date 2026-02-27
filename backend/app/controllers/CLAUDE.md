# Controller Guidelines

## Constraints

- 5-10 lines per action, max
- Zero business logic — delegate to models or namespaced classes
- Guard clauses over nested conditionals
- Flat namespace (no `Api::` module), routes provide the `/api` prefix via `scope`

## Patterns

```ruby
# Good: guard clause
return head :not_found unless @article

# Good: delegate to model
articles = Article.most_commented

# Bad: business logic in controller
if params[:sort] == "popular"
  @articles = Article.where("comments_count > ?", 5).order(...)
end
```

## Caching

Each action should use one or both:
- `Rails.cache.fetch("key") { expensive_query }` for data caching
- `stale?(record)` for HTTP conditional GET (ETag/304)

## Error Handling

- `rescue_from ActiveRecord::RecordNotFound` in `ApplicationController` returns 404
- Validation errors: `render json: { errors: record.errors }, status: :unprocessable_content`
- Use `:unprocessable_content` (not `:unprocessable_entity`, deprecated in Rack)

## Strong Parameters

Use `params.expect(resource: [:field1, :field2])` (Rails 8 style).
