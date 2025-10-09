const mongoose = require('mongoose');
const Recipe = require('../../schemas/RecipeSchema');
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

async function getRecipeById(recipeId) {
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      console.log('Recipe not found');
      return null;
    }
    console.log('Recipe found:', recipe);
    return recipe;
  } catch (err) {
    console.error('Recipe could not be found:', err.message);
    throw err;
  }
}

async function getRecipesByName(recipeName) {
  try {
    const recipe = await Recipe.findByName(recipeName);
    if (!recipe) {
      console.log('Recipe not found');
      return null;
    }
    console.log('Recipe found:', recipe);
    return recipe;
  } catch (err) {
    console.error('Recipe could not be found:', err.message);
    throw err;
  }
}

// async function getRecipesByFilter(recipeFilter) {
//   try {
//     const recipes = await Recipe.find(recipeFilter);
//     if (!recipes) {
//       console.log('Recipes not found');
//       return null;
//     }
//     console.log('Recipes found:', recipes);
//     //Example of filtering
//     //Recipe.where("name").equals("Tomato Soup").where("serves").gt(2).lt(6).select("name serves ingredients");)
//     return recipe;
//   } catch (err) {
//     console.error('Recipes could not be found:', err.message);
//   }
// }

async function createRecipe(recipeData) {
  //this assumes it is one json recipe. For multiple, change to loop
  try {
    const recipe = await Recipe.create(recipeData);
    console.log('Recipe created:', recipe);
    return recipe;
  } catch (err) {
    console.error('Error creating recipe:', err.message);
    throw err;
  }
}

async function updateRecipe(recipeId, recipeData) {
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    recipe.set(recipeData);
    await recipe.save();
    console.log('Recipe updated:', recipe);
    return recipe;
  } catch (err) {
    console.error('Recipe could not be updated:', err.message);
    throw err;
  }
}

async function deleteRecipe(recipeId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      throw new Error('Invalid recipe ID');
    }
    const recipeIdObject = ObjectId.createFromHexString(recipeId);
    const recipe = await Recipe.deleteOne({ _id: recipeIdObject });
    console.log('Recipe deleted:', recipe);
    return recipe;
  } catch (err) {
    console.error('Recipe could not be deleted:', err.message);
    throw err;
  }
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  getRecipesByName,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
