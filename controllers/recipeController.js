const recipeModel = require('../schemas/RecipeSchema');

// Controller function to get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipes', error: err }); // Internal Server Error
  }
};

module.exports = {
  getAllRecipes,
};
