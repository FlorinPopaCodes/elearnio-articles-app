FactoryBot.define do
  factory :comment do
    body { Faker::Lorem.paragraph }
    author_name { Faker::Name.name }
    article
  end
end
