ActiveSupport.on_load(:active_record) do
  if ActiveRecord::Base.connection.adapter_name.downcase == "sqlite3"
    ActiveRecord::Base.connection.execute("PRAGMA journal_mode=WAL;")
    ActiveRecord::Base.connection.execute("PRAGMA synchronous=NORMAL;")
    ActiveRecord::Base.connection.execute("PRAGMA busy_timeout=5000;")
    ActiveRecord::Base.connection.execute("PRAGMA cache_size=-20000;")
    ActiveRecord::Base.connection.execute("PRAGMA foreign_keys=ON;")
  end
end
