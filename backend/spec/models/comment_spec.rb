require "rails_helper"

RSpec.describe Comment do
  describe "validations" do
    it "is valid with all required attributes" do
      comment = build(:comment)
      expect(comment).to be_valid
    end

    it "requires a body" do
      comment = build(:comment, body: nil)
      expect(comment).not_to be_valid
      expect(comment.errors[:body]).to include("can't be blank")
    end

    it "requires an author_name" do
      comment = build(:comment, author_name: nil)
      expect(comment).not_to be_valid
      expect(comment.errors[:author_name]).to include("can't be blank")
    end
  end
end
