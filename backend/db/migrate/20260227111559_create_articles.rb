class CreateArticles < ActiveRecord::Migration[8.1]
  def change
    create_table :articles do |t|
      t.string :title, null: false
      t.text :body, null: false
      t.string :author_name, null: false
      t.integer :comments_count, null: false, default: 0

      t.timestamps
    end
  end
end
