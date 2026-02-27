Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  scope "/api" do
    resources :articles, only: %i[index show create] do
      resources :comments, only: %i[index create]
    end

    resource :engagement, only: :show, controller: "engagement"
  end
end
