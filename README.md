# Elearnio Articles

A web application for creating articles, adding comments, and viewing engagement stats. Built as an Elearnio coding challenge to demonstrate staff-level engineering: restraint in scope, thoughtful decisions, and clear documentation.

**Live demo:** https://elearnio-articles.fly.dev

## Stack

| Layer       | Choice                        |
|-------------|-------------------------------|
| Backend     | Rails 8.1, API-only, SQLite   |
| Frontend    | Angular 21, Signals, Tailwind |
| Serializers | Alba + Typelizer (auto TS types) |
| Testing     | RSpec (backend), Vitest (frontend) |
| Deployment  | Fly.io (Amsterdam)            |

## Quick Start

### Prerequisites

- Ruby 3.4+
- Node 22+
- SQLite3

### Run locally

```sh
# Terminal 1 — backend
cd backend
bin/setup
bin/rails server    # http://localhost:3000

# Terminal 2 — frontend
cd frontend
npm install
npm start           # http://localhost:4200
```

The frontend dev server proxies `/api` to the backend automatically.

### Seed data

The backend seeds 7 articles with varying comment counts for a populated demo. Run `bin/rails db:seed` if needed.

### API Endpoints

| Method | Path                           | Description               |
|--------|--------------------------------|---------------------------|
| GET    | `/api/articles`                | List all articles         |
| POST   | `/api/articles`                | Create an article         |
| GET    | `/api/articles/:id`            | Show article detail       |
| GET    | `/api/articles/:id/comments`   | List comments for article |
| POST   | `/api/articles/:id/comments`   | Create a comment          |
| GET    | `/api/engagement`              | Engagement overview       |

### Key Design Decisions

- **SQLite in production** — zero infrastructure, WAL mode for concurrent reads, persistent volume on Fly.io
- **Two-layer caching** — `Rails.cache.fetch` (memory store) + HTTP ETags with eager invalidation via `after_commit` callbacks
- **Signal-driven UI** — `signal()` + `computed()` + `toSignal()` for reactive state, no third-party store
- **Deferred loading** — `@defer (on idle)` for engagement panel, `@defer (on viewport)` for comments
- **Optimistic comments** — new comments appear instantly via local signal, no re-fetch needed
- **Type sharing** — Typelizer generates TypeScript interfaces from Alba serializers, single source of truth
- **No authentication** — public API by design, keeps scope focused

## Testing

```sh
# Backend
cd backend && bundle exec rspec

# Frontend
cd frontend && npm test
```

## Deployment

Both apps are deployed to Fly.io in the Amsterdam region.

| App                  | URL                                        | Resources          |
|----------------------|--------------------------------------------|--------------------|
| Frontend (nginx)     | https://elearnio-articles.fly.dev          | shared-cpu, 256MB  |
| Backend (Rails/Puma) | https://elearnio-articles-api.fly.dev      | shared-cpu, 512MB  |

The frontend nginx proxies `/api/` to the backend over Fly.io's private network. The backend stores SQLite on a persistent volume.

```sh
# Deploy
cd backend  && fly deploy
cd frontend && fly deploy
```

## Project Structure

```
.
├── backend/           # Rails 8.1 API (see backend/README.md)
├── frontend/          # Angular 21 SPA (see frontend/README.md)
└── SPEC.md            # Original architecture spec
```

See each sub-project's README for detailed documentation.

## Future Considerations

- Authentication / authorization
- Pagination (cursor-based)
- Full-text search
- WebSocket live comments
- Rate limiting
- CI/CD pipeline
- Monitoring / observability
- Dark mode
