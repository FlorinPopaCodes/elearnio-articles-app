Typelizer.configure do |config|
  config.output_dir = Rails.root.join("../frontend/src/app/types")
  config.inheritance_strategy = :inheritance
  config.types_import_path = "."
  config.verbatim_module_syntax = true
end
