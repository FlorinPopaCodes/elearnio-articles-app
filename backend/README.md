# Articles API

Rails 8.1 API backend for the Elearnio coding challenge. Serves articles, comments, and engagement stats over a RESTful JSON API.

## Stack

| Component    | Choice                  |
|-------------|-------------------------|
| Framework   | Rails 8.1, API-only     |
| Ruby        | 3.4+ (YJIT enabled)    |
| Database    | SQLite (WAL mode)       |
| Web server  | Puma                    |
| Serializers | Alba + Typelizer        |
| Testing     | RSpec + FactoryBot      |

## Prerequisites

- Ruby 3.4+
- Bundler
- SQLite3

## Setup

```sh
bin/setup        # install gems, create + migrate db, seed data
bin/rails server # start on http://localhost:3000
```

Seed data includes 7 articles with varying comment counts for a populated demo.

## API Endpoints

All routes are scoped under `/api`.

| Method | Path                           | Description               | Status Codes |
|--------|--------------------------------|---------------------------|-------------|
| GET    | `/api/articles`                | List all articles         | 200         |
| POST   | `/api/articles`                | Create an article         | 201 / 422   |
| GET    | `/api/articles/:id`            | Show article detail       | 200 / 404   |
| GET    | `/api/articles/:id/comments`   | List comments for article | 200         |
| POST   | `/api/articles/:id/comments`   | Create a comment          | 201 / 422   |
| GET    | `/api/engagement`              | Engagement overview       | 200         |
| GET    | `/up`                          | Health check              | 200         |

### Response shapes

**Articles list:** `[{ id, title, author_name, created_at, comments_count }]`

**Article detail:** `{ id, title, body, author_name, created_at, comments_count }`

**Comments list:** `[{ id, body, author_name, created_at }]`

**Engagement:** `{ total_articles, total_comments, most_commented: [top 5] }`

**Validation errors (422):** `{ errors: { field: ["message"] } }`

## Database

SQLite with production-tuned PRAGMAs (WAL mode, 20MB cache, foreign keys enforced).

Two tables:

- **articles** - `title`, `body`, `author_name`, `comments_count` (counter cache)
- **comments** - `body`, `author_name`, `article_id` (FK)

```sh
bin/rails db:migrate  # run migrations
bin/rails db:seed     # populate sample data
```

## Caching

Two-layer strategy with eager invalidation:

1. **Rails.cache.fetch** (`:memory_store`) - caches article lists, comments, and engagement stats
2. **HTTP ETags** (`stale?`) - conditional GET returns 304 when data hasn't changed

Cache invalidation is owned by models via `after_commit` callbacks. Creating an article or comment invalidates all affected cache keys.

## Serialization & Type Sharing

Alba serializers define JSON response shapes. Typelizer generates TypeScript interfaces from these serializers into `../frontend/src/app/types/`, keeping backend and frontend types in sync.

## Architecture

- Controllers stay under 10 lines per action, zero business logic
- Complex queries extracted into namespaced model classes (e.g., `Article::EngagementQuery`)
- No service objects, no concerns for business logic
- No authentication (public API by design)

## Testing

```sh
bundle exec rspec           # run all specs
bundle exec rspec spec/requests  # request specs only
bundle exec rspec spec/models    # model specs only
```

Tests include request specs (BDD style) and model specs for validations and query objects.

## Environment Variables

| Variable          | Default                  | Description          |
|-------------------|--------------------------|----------------------|
| `CORS_ORIGINS`    | `http://localhost:4200`  | Allowed CORS origins |
| `RAILS_LOG_LEVEL` | `info`                   | Log verbosity        |
| `RAILS_MAX_THREADS`| `3`                     | Puma thread count    |

## Deployment

Deployed to Fly.io (`elearnio-articles-api`, `ams` region).

- Multi-stage Dockerfile, runs as non-root `rails` user
- SQLite database on a persistent volume at `/rails/storage`
- `bin/docker-entrypoint` runs `db:prepare` on boot
- Health check: `GET /up` every 15s

```sh
fly deploy  # deploy to production
```

## Scripts

| Command              | Description                    |
|----------------------|--------------------------------|
| `bin/setup`          | Dev environment setup          |
| `bin/rails server`   | Start dev server               |
| `bin/rails db:seed`  | Load seed data                 |
| `bin/ci`             | CI pipeline (setup + audit)    |
| `bin/bundler-audit`  | Gem vulnerability scan         |
| `bundle exec rspec`  | Run test suite                 |

## Future Considerations

- Authentication/authorization (User model, JWT)
- Pagination (Pagy, cursor-based)
- Full-text search
- WebSocket live comments
- Rate limiting
- Monitoring/observability
- Length validations beyond presence
- CI/CD pipeline
