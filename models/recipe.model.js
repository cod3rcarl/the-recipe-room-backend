const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  recipeId: {
    type: String,
    required: true,
  },
  prepTime: {
    type: Number,
  },
  servings: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
  sourceUrl: {
    type: String,
  },
  added: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
