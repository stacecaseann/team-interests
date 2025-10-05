const recipeModel = require('../database/models/recipeModel');

// Controller function to get all recipes
const getAllRecipes = async (req, res) => {
  /* GET all recipes
      #swagger.tags = ["Recipes"]
      #swagger.summary = "Gets all recipes."
      #swagger.responses[200] = { description: "List of all recipes" }
  */
  try {
    const recipes = await recipeModel.getAllRecipes();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipes', error: err }); // Internal Server Error
  }
};

const getRecipeById = async (req, res) => {
  /* GET recipe by ID
      #swagger.tags = ["Recipes"]
      #swagger.summary = "Gets a recipe by ID."
      #swagger.parameters['id'] = { description: 'The ID of the recipe to retrieve.' }
  */
  try {
    const result = await recipeModel.getRecipeById(req.params.id);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecipesByName = async (req, res) => {
  /* GET recipes by name
      #swagger.tags = ["Recipes"]
      #swagger.summary = "Gets all recipes to match Name."
      #swagger.parameters['recipeName'] = { description: 'The name of the recipes to retrieve.' }
  */
  try {
    const result = await recipeModel.getRecipesByName(req.params.recipeName);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRecipe = async (req, res) => {
  /* CREATE a new recipe
      #swagger.tags = ["Recipes"]
      #swagger.summary = "Creates a new recipe."
      #swagger.parameters['recipe'] = { 
        in: 'body', 
        description: 'The recipe to create.'
      }
  */
  try {
    const result = await recipeModel.createRecipe(req.body);
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while creating recipe.',
    });
  }
};

const updateRecipe = async (req, res) => {
  /* UPDATE recipe by ID
      #swagger.tags = ["Recipes"]
      #swagger.summary = "Updates a recipe by ID."
      #swagger.description = "Updates fields in the recipe. The ingredients and instructions will need the complete list in order to be updated correctly."      #swagger.parameters['recipe'] = { in: 'body', description: 'The recipe data to update.' }
      #swagger.parameters['id'] = { description: 'The ID of the recipe to update.' }

  */
  try {
    const result = await recipeModel.updateRecipe(req.params.id, req.body);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while updating recipe.',
    });
  }
};

const deleteRecipe = async (req, res) => {
  /* DELETE recipe by ID
      #swagger.tags = ["Recipes"]
      #swagger.summary = "Deletes a recipe by ID."
      #swagger.parameters['id'] = { description: 'The ID of the recipe to delete.' }
  */
  try {
    const result = await recipeModel.deleteRecipe(req.params.id);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while deleting recipe.',
    });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  getRecipesByName,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
