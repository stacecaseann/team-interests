jest.setTimeout(15000);
const request = require('supertest');
const mongoose = require('mongoose');
const Recipe = require('../schemas/RecipeSchema');
const app = require('../server');
// Mock the authentication middleware to bypass auth in integration tests
jest.mock('../middleware/authentication', () => ({
  isAuthenticated: (req, res, next) => {
    // Skip authentication in tests - just call next()
    next();
  },
}));

describe('Get Recipe Endpoint', () => {
  test('should retrieve all recipes', async () => {
    const uniqueName1 = `Test Recipe ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const uniqueName2 = `Test Recipe 2 ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const recipe1 = await createValidRecipe(uniqueName1);
    const recipe2 = await createValidRecipe(uniqueName2);
    const res = await request(app).get('/recipes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // expect(res.body).toHaveLength(2);

    // Clean up - delete the test recipes
    await Recipe.findByIdAndDelete(recipe1._id);
    await Recipe.findByIdAndDelete(recipe2._id);
  });

  //Can't do without in memory db
  // test('get all when none exist', async () => {
  //   const res = await request(app).get('/recipes');
  //   expect(res.statusCode).toBe(200);
  //   expect(Array.isArray(res.body)).toBe(true);
  //   expect(res.body).toHaveLength(0);
  // });

  test('should retrieve a recipe by ID', async () => {
    const uniqueName = `Test Recipe ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const recipe = await createValidRecipe(uniqueName);

    const res = await request(app).get(`/recipes/${recipe._id}`);
    console.log('Response status:', res.statusCode);
    console.log('Response body:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(uniqueName);

    // Clean up - delete the test recipe
    await Recipe.findByIdAndDelete(recipe._id);
  });

  test('for when there is an invalid ID', async () => {
    const invalidId = '12345';

    const res = await request(app).get(`/recipes/${invalidId}`);
    expect(res.statusCode).toBe(400);
    console.log('Response body:', res.body);
    expect(res.body.error).toBe('Invalid ID format');
  });

  test('for when there is not a matching ID', async () => {
    const objectId = new mongoose.Types.ObjectId();
    console.log('Testing with ObjectId:', objectId);
    const res = await request(app).get(`/recipes/${objectId}`);
    expect(res.statusCode).toBe(200);
    console.log('Response body:', res.body);
    expect(res.body).toBe('Recipe not found');
  });
});

describe('Create Recipe Endpoint', () => {
  test('should fail validation if name is missing', async () => {
    const res = await request(app).post('/recipes').send({
      serves: 4,
      description: 'A delicious test recipe',
    });
    expect(res.statusCode).toBe(400);
    console.log('Response body:', res.body);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Name is required' }),
        expect.objectContaining({ msg: 'Name must be a string' }),
        expect.objectContaining({
          msg: 'Ingredients must be a non-empty array',
        }),
        expect.objectContaining({
          msg: 'Instructions must be a non-empty array',
        }),
      ]),
    );
  });
  test('should create a recipe successfully', async () => {
    const uniqueName = `Test Recipe ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const res = await request(app)
      .post('/recipes')
      .send({
        name: uniqueName,
        serves: 4,
        ingredients: [
          {
            amount: 1,
            amountString: '1',
            measurement: 'cup',
            ingredient: 'flour',
          },
        ],
        instructions: [
          {
            stepNumber: 1,
            instruction: 'Mix ingredients',
          },
        ],
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(uniqueName);

    const dbRecipe = await Recipe.findOne({ name: uniqueName });
    expect(dbRecipe).not.toBeNull();
    expect(dbRecipe.serves).toBe(4);

    // Clean up - delete the test recipe
    await Recipe.findByIdAndDelete(dbRecipe._id);
  });
});

async function createValidRecipe(recipeName) {
  const recipeObject = {
    name: recipeName,
    serves: 4,
    ingredients: [
      {
        amount: 1,
        amountString: '1',
        measurement: 'cup',
        ingredient: 'flour',
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: 'Mix ingredients',
      },
    ],
  };
  const recipe = await Recipe.create(recipeObject);
  return recipe;
}
