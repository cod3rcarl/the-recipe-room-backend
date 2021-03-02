const express = require("express");
const { getUsers, getUser, updateUser, deleteUser } = require("../controllers/users.controller");
const { createRecipe, getRecipes, getRecipe, updateRecipe, deleteRecipe } = require("../controllers/recipe.controller");
const advancedResults = require("../middleware/advancedResults");
const User = require("../models/auth.model");
const Recipe = require("../models/recipe.model");
const router = express.Router();

const { authorize, protect } = require("../middleware/auth");
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://the-recipe-room.netlify.app/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get("/", protect, authorize("admin"), advancedResults(User), getUsers);
router.get("/recipes/:id", protect, advancedResults(Recipe), getRecipes);

router.post("/recipes", protect, createRecipe);

router
  .route("/:id")
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

router
  .route("/recipe/:id")
  .get(protect, getRecipe)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;
