# Backend Guidelines

Based on [Palkan's Rails guidelines](https://gist.github.com/palkan/482010bd6ec434685f106779e863d0ef), adapted for this project.

## Stack

- Rails 8.1, API-only mode
- Ruby 3.4+ (YJIT enabled)
- SQLite
- Alba serializers + Typelizer for TS type generation
- RSpec for testing
- FactoryBot + Faker for test data

## Core Principles

- Generated code should be so simple and clear that reading it feels like reading well-written documentation
- Trust Rails conventions, don't fight them
- No service objects, no concerns for business logic, no result objects
- Extract complex logic into namespaced model classes (e.g., `Article::EngagementQuery`)
- Keep controllers under 10 lines per action, zero business logic

## Naming

Use domain language. Not `User` but `Author`. Not `GenericService` but `Article::EngagementQuery`.

## Model Organization

Follow this order in model files:
1. Associations
2. Validations
3. Scopes
4. Callbacks
5. Public methods
6. Private methods

## Testing

- RSpec with FactoryBot + Faker
- Request specs written as BDD (`describe`/`context`/`it`)
- Model specs for validations, scopes, and custom logic
- Don't test framework behavior (associations, basic AR)
- Use `:unprocessable_content` not `:unprocessable_entity` (Rack deprecation)

## Caching

- Two layers: `Rails.cache.fetch` (:memory_store) + HTTP ETags (`stale?`)
- Eager invalidation via `after_commit` callbacks
- Cache keys: `"articles/list"`, `"articles/:id/comments"`, `"engagement"`

## Serialization

- Alba serializers in `app/serializers/`
- Typelizer generates TypeScript interfaces from serializers
- Output dir: `../frontend/src/app/types/`

## Forbidden Patterns

- Service objects (`app/services/`)
- Concerns for business logic
- Devise, CanCanCan
- Complex state machines
- Result objects / fancy error handling
- `ENV` access outside initializers (use Rails config)
