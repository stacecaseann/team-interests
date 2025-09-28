var recipeModel = require('../database/recipeModel');

const getAllRecipes = async (req, res) => {
  //#swagger.tags = ['Recipes']
  //#swagger.summary = 'Gets all recipes.'
  try {
    const result = await recipeModel.getAllRecipes();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRecipes,
};
