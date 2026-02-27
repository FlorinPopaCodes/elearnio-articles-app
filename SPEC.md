# Elearnio Coding Challenge - Articles App

## Overview

A small web application (Ruby on Rails API + Angular SPA) for creating articles, adding comments, and viewing engagement stats. Built to demonstrate staff-level engineering: restraint in scope, thoughtful decisions, and documentation of what comes next.

## Stack

| Layer       | Choice                          | Rationale                                    |
|-------------|----------------------------------|----------------------------------------------|
| Backend     | Rails 8.0, API-only mode        | Latest stable, lean middleware stack          |
| Ruby        | 3.3+ (YJIT enabled)            | Performance out of the box                   |
| Frontend    | Angular 19+ (signals, @defer)   | Modern Angular idioms                        |
| Database    | SQLite                          | Sufficient for scope, zero config            |
| Styling     | Tailwind CSS                    | Utility-first, fast to build                 |
| Serializers | Alba + Typelizer                | Lightweight serialization + auto TS types    |
| Testing     | RSpec (request specs as BDD)    | Full-stack API testing, behavior-driven style|
| Cache       | Rails.cache (:memory_store) + HTTP ETags | Two-layer caching, zero deps       |

## Data Structures

### Article
- `id` (integer, PK)
- `title` (string, required)
- `body` (text, required)
- `author_name` (string, required)
- `comments_count` (integer, default: 0) - counter_cache, atomic updates
- `created_at` (datetime)

### Comment
- `id` (integer, PK)
- `body` (text, required)
- `author_name` (string, required)
- `article_id` (FK, required) - belongs_to with counter_cache: true
- `created_at` (datetime)

## API Endpoints

| Method | Path                          | Description                     | Caching                          |
|--------|-------------------------------|---------------------------------|----------------------------------|
| GET    | /api/articles                 | List all articles               | Rails.cache.fetch + ETag         |
| POST   | /api/articles                 | Create article                  | Invalidates articles cache       |
| GET    | /api/articles/:id             | Show article (no comments)      | ETag based on updated_at         |
| GET    | /api/articles/:id/comments    | List comments for article       | Rails.cache.fetch + ETag         |
| POST   | /api/articles/:id/comments    | Create comment                  | Invalidates article + engagement |
| GET    | /api/engagement               | Engagement overview             | Rails.cache.fetch + ETag         |

### Response Shapes

**Articles list:** `[{ id, title, author_name, created_at, comments_count }]`

**Article detail:** `{ id, title, body, author_name, created_at, comments_count }`

**Comments list:** `[{ id, body, author_name, created_at }]`

**Engagement:** `{ total_articles, total_comments, most_commented: [top 5 articles by comments_count] }`

**Errors (422):** `{ errors: { field: ["message"] } }` - standard Rails format, maps to Angular form controls

## Validations

- Presence only: `title`, `body`, `author_name` on both models
- No length limits for now (document as future consideration)

## Caching Strategy

Two layers, both with eager invalidation:

1. **Rails.cache.fetch** - `:memory_store` for all environments. Cache keys include model fingerprints. Invalidated via `after_commit` callbacks on Comment creation and Article creation.
2. **HTTP conditional GET** - `stale?` with ETag/Last-Modified in controllers. Angular skips re-parsing unchanged responses (304 Not Modified).

### Cache Invalidation

- Comment created -> invalidate: article's comments cache, engagement cache, articles list cache
- Article created -> invalidate: articles list cache, engagement cache

## Angular Architecture

### Routing (3 routes + layout)

```
/articles              -> ArticleListPage
/articles/:id          -> ArticleDetailPage
/engagement            -> EngagementPage (optional standalone, also in sidebar)
```

### Layout

- **Sidebar** (always visible): Engagement widget showing total articles, total comments, top 5 most commented. Fetches from `/api/engagement`.
- **Main content**: Route outlet

### Component Architecture (Smart/Dumb separation)

**Smart (container) components** - inject services, manage state:
- `ArticleListContainer` - fetches articles, handles create
- `ArticleDetailContainer` - fetches article + deferred comments
- `EngagementContainer` - fetches engagement stats

**Dumb (presentational) components** - pure inputs/outputs:
- `ArticleCard` - displays article summary
- `ArticleForm` - reactive form for creating articles
- `CommentList` - renders list of comments
- `CommentForm` - reactive form for adding comments
- `EngagementPanel` - renders engagement stats

### Deferral Strategy (@defer)

- **Comments section** on article detail: `@defer (on viewport)` - defers both fetch AND render until the comment section scrolls into view
- **Engagement sidebar**: `@defer (on idle)` - loads after main content is interactive
- **Route-level**: All routes use standalone components (tree-shakeable by default)

### Forms

- Reactive forms (FormGroup/FormControl)
- Server-side validation errors mapped to form controls via errors hash keys

### State & Signals

- `signal()` for component state
- `computed()` for derived state
- Observables for HTTP calls (HttpClient)
- `toSignal()` to bridge HTTP observables into signal-based templates

### Optimistic UI

- Comment creation: insert into list immediately, rollback on server error
- Show inline error toast if rollback occurs

### Article Body

- Stored as plain text/markdown
- Rendered on frontend with a lightweight markdown pipe/library

## Testing

### Backend (RSpec)

Red/green TDD. Request specs written in BDD style:

```ruby
describe "POST /api/articles" do
  context "with valid params" do
    it "creates an article and returns 201" do ...
  end

  context "with missing title" do
    it "returns 422 with validation errors" do ...
  end
end
```

Test pyramid: model specs (validations, scopes) + request specs (full stack API behavior). No system/E2E specs from Rails side.

### Frontend

Angular built-in testing (Jasmine/Karma or Jest) for component unit tests.

## Serialization & Type Sharing

- **Alba** serializers define the JSON shape for each resource
- **Typelizer** auto-generates TypeScript interfaces from Alba serializers
- Frontend imports generated types - single source of truth, no drift

## Dev Setup

### Option A: Docker Compose (for reviewers)

```
docker compose up
# Rails API on :3000, Angular on :4200
```

### Option B: Native (for development)

```
bin/setup    # installs deps, creates db, seeds
bin/dev      # starts Rails + Angular via Procfile.dev
```

### Seed Data

`db/seeds.rb` populates 5-10 articles with varying comment counts so the reviewer sees a populated app with meaningful engagement data on first run.

## Guidelines

- **Rails**: Based on [Palkan's Rails guidelines](https://gist.github.com/palkan/482010bd6ec434685f106779e863d0ef), adapted to our stack. Generic guidelines in CLAUDE.md, specific guidelines in sub-folder CLAUDE.md files (e.g., `app/controllers/CLAUDE.md`).
- **Angular**: Sub-agent configured with [Angular AI development guide](https://angular.dev/ai/develop-with-ai).

## Decisions & Restraint

Things we deliberately chose NOT to build (document in README "Future" section):
- No authentication/authorization (would add User model, Devise/JWT, ownership)
- No pagination (would add Pagy, cursor-based for scale)
- No full-text search
- No WebSocket live comments
- No rate limiting
- No monitoring/observability
- No length validations beyond presence
- No rich text editor (markdown rendering only)
- No CI/CD pipeline

## Deliverables

- Source code: Rails API backend + Angular SPA frontend
- Docker Compose for one-command setup
- bin/setup + bin/dev for native development
- Seed data for immediate demo
- README with: setup instructions, architecture overview, time spent, future considerations
