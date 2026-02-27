Typelizer.configure do |config|
  config.output_dir = Rails.root.join("../frontend/src/app/types")
  config.serializer_plugin = :alba
end
