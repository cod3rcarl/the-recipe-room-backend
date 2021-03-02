const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Recipe = require("../models/recipe.model");
const User = require("../models/auth.model");

// @description Get all users
// @route GET /api/v1/users
// @access Private/Admin

exports.getRecipes = asyncHandler(async (req, res, next) => {
  const user = req.params.id;
  const query = await Recipe.find();

  const recipes = query.filter((recipe) => recipe.user === user);

  res.status(200).json({ recipes });
});

// @description Get single
// @route GET/api/v1/users:/id
// @access Private/Admin

exports.getRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  res.status(200).json({ recipe: recipe });
});

// @description Update user
// @route PUT  /api/v1/users/:id
// @access Private/Admin

exports.updateRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ recipe: recipe });
});

// @description Delete user
// @route DELETE  /api/v1/users/:id
// @access Private/Admin

exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Recipe deleted",
  });
});

exports.createRecipe = asyncHandler(async (req, res, next) => {
  const { title, id, readyInMinutes, servings, image, sourceUrl } = req.body;
  const userId = req.body.user._id;
  const recipeId = id;
  console.log(req.body);
  const user = await User.findById(userId);
  const duplicateRecipe = await Recipe.findOne({ recipeId });
  if (duplicateRecipe) {
    return res.status(400).json({ success: false, message: `You have already added this recipe` });
  }

  if (!user) {
    return res.status(400).json({ success: false, message: `User does not exist` });
  }

  const recipe = await Recipe.create({
    title,
    recipeId: id,
    prepTime: readyInMinutes,
    user: userId,
    servings,
    imageUrl: image,
    sourceUrl,
    createdAt: Date.now(),
  });

  return res.status(200).json({ success: true, recipe: recipe });
});
