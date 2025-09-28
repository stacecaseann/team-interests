const mongoose = require('mongoose');
const Recipe = require('./schemas/Recipe');
const { ObjectId } = require('mongodb');

//throw all errors and catch in the route/controller
async function getAllRecipes() {
  try {
    const recipes = await Recipe.find();
    console.log(
      'Recipes found:',
      recipes.map((r) => r.recipeDescription),
    );
    return recipes;
  } catch (err) {
    console.error('Recipes could not be found:', err.message);
    throw err;
  }
}

module.exports = {
  getAllRecipes,
};
