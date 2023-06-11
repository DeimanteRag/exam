const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category is required."],
    unique: [true, 'Category must be unique']
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
