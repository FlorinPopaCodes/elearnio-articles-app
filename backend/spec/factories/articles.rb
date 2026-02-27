FactoryBot.define do
  factory :article do
    title { Faker::Lorem.sentence(word_count: 4) }
    body { Faker::Lorem.paragraphs(number: 3).join("\n\n") }
    author_name { Faker::Name.name }
  end
end
