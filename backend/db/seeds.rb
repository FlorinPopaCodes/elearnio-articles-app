articles_data = [
  {
    title: "Getting Started with Ruby on Rails 8",
    body: "Rails 8 introduces several exciting features including built-in authentication, Solid Cache, and Solid Queue. This article explores the key changes and how to leverage them in your next project.\n\nThe new `rails generate authentication` command provides a complete authentication solution out of the box, eliminating the need for gems like Devise in many cases.\n\nSolid Cache and Solid Queue replace the need for Redis in many deployments, simplifying infrastructure while maintaining performance.",
    author_name: "Sarah Chen",
    comments: [
      { body: "Great overview! The built-in auth generator is a game changer.", author_name: "Marcus Rivera" },
      { body: "I've been waiting for Solid Queue. No more Redis dependency for simple background jobs.", author_name: "Priya Patel" },
      { body: "How does Solid Cache compare to Redis in terms of performance?", author_name: "James O'Brien" },
      { body: "We migrated our app to Rails 8 last week. The upgrade was surprisingly smooth.", author_name: "Lin Wei" },
      { body: "Would love to see a follow-up article on Kamal deployment.", author_name: "Emma Schmidt" }
    ]
  },
  {
    title: "Understanding Angular Signals",
    body: "Angular Signals represent a fundamental shift in how we manage reactivity in Angular applications. Unlike traditional change detection, signals provide fine-grained reactivity that can significantly improve performance.\n\nThe `signal()`, `computed()`, and `effect()` primitives form the foundation of the new reactivity model. Combined with the new `input()` function replacing `@Input()`, Angular components become more predictable and easier to test.",
    author_name: "David Kim",
    comments: [
      { body: "Signals + zoneless Angular is the future. Our bundle size dropped 15%.", author_name: "Aisha Johnson" },
      { body: "The migration from RxJS to signals was easier than expected for our project.", author_name: "Tom Nakamura" },
      { body: "How do signals interact with OnPush change detection?", author_name: "Maria Garcia" },
      { body: "Great explanation! Finally understanding when to use computed() vs effect().", author_name: "Alex Petrov" }
    ]
  },
  {
    title: "SQLite in Production: When and Why",
    body: "SQLite has come a long way from being just a development database. With WAL mode, proper configuration, and tools like Litestream for replication, SQLite is now a viable production database for many applications.\n\nFor read-heavy workloads, SQLite can outperform client-server databases by eliminating network latency entirely. Rails 8 embraces this with first-class SQLite support.",
    author_name: "Rachel Adams",
    comments: [
      { body: "We run SQLite in production for our internal tool serving 500 users. Works perfectly.", author_name: "Chris Taylor" },
      { body: "What about write concurrency? That's always been the concern.", author_name: "Nina Kowalski" },
      { body: "Litestream changed the game for SQLite backups. Highly recommend.", author_name: "Sam Martinez" }
    ]
  },
  {
    title: "API Design Patterns for Modern Web Apps",
    body: "Designing a clean API is as much about what you leave out as what you include. This article covers practical patterns for building RESTful APIs that are easy to consume and maintain.\n\nKey principles: consistent error formats, proper HTTP status codes, thoughtful serialization, and cache-friendly responses with ETags.",
    author_name: "Jordan Lee",
    comments: [
      { body: "The section on ETag caching alone was worth the read.", author_name: "Fatima Al-Hassan" },
      { body: "I wish more teams followed these patterns. So many APIs return 200 for everything.", author_name: "Ryan Cooper" }
    ]
  },
  {
    title: "The Case for Boring Technology",
    body: "Every new technology you adopt comes with a hidden cost: the learning curve, the edge cases nobody has documented yet, and the risk of abandonment. Sometimes the best technical decision is choosing the boring, well-understood option.\n\nThis doesn't mean never adopting new technology. It means being intentional about where you spend your innovation tokens.",
    author_name: "Pat Morrison",
    comments: [
      { body: "This resonates deeply. We replaced our microservices with a Rails monolith and shipped 3x faster.", author_name: "Diego Hernandez" },
      { body: "Innovation tokens is such a useful mental model.", author_name: "Yuki Tanaka" },
      { body: "Boring technology is only boring because it works reliably.", author_name: "Sarah Chen" },
      { body: "Counter-point: sometimes the boring choice creates tech debt too.", author_name: "Marcus Rivera" },
      { body: "This should be required reading for every engineering manager.", author_name: "Priya Patel" },
      { body: "We adopted this philosophy last year. Team happiness went up significantly.", author_name: "Emma Schmidt" }
    ]
  },
  {
    title: "Effective Code Review Practices",
    body: "Code review is not about finding bugs (that's what tests are for). It's about knowledge sharing, maintaining consistency, and catching design issues early.\n\nThe best code reviews are conversations, not gatekeeping. Focus on the why, not the how.",
    author_name: "Aisha Johnson",
    comments: [
      { body: "Shifting from 'finding bugs' to 'knowledge sharing' transformed our team's review culture.", author_name: "Tom Nakamura" }
    ]
  },
  {
    title: "Counter Caches and Atomic Updates in Rails",
    body: "N+1 queries for counting associations are one of the most common performance issues in Rails applications. Counter caches solve this elegantly by maintaining a denormalized count that stays in sync automatically.\n\nRails' built-in `counter_cache: true` on `belongs_to` handles the atomic INCREMENT/DECREMENT at the database level, avoiding race conditions.",
    author_name: "Lin Wei",
    comments: []
  }
]

base_time = Time.zone.parse("2026-02-10 09:15:00")

articles_data.each_with_index do |article_data, i|
  comments = article_data.delete(:comments)
  article_time = base_time + i.days + (i * 3).hours + (i * 17).minutes

  article = Article.find_or_create_by!(title: article_data[:title]) do |a|
    a.assign_attributes(article_data)
  end
  article.update_columns(created_at: article_time, updated_at: article_time)

  comments.each_with_index do |comment_data, j|
    comment_time = article_time + (j + 1).hours + (j * 23).minutes
    comment = article.comments.find_or_create_by!(body: comment_data[:body]) do |c|
      c.assign_attributes(comment_data)
    end
    comment.update_columns(created_at: comment_time, updated_at: comment_time)
  end
end

puts "Seeded #{Article.count} articles with #{Comment.count} comments"
