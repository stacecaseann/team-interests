jest.setTimeout(15000);
const request = require('supertest');
const express = require('express');
const recipeRoute = require('../routes/recipes');

// Mock the recipe model to avoid DB access
jest.mock('../database/models/recipeModel', () => ({
  createRecipe: jest
    .fn()
    .mockResolvedValue({ _id: '123', name: 'Test Recipe', serves: 4 }),
  getAllRecipes: jest.fn().mockResolvedValue([]),
  getRecipeById: jest.fn().mockResolvedValue(null),
}));

// Mock the authentication middleware to bypass auth in tests
jest.mock('../middleware/authentication', () => ({
  isAuthenticated: (req, res, next) => {
    // Skip authentication in tests - just call next()
    next();
  },
}));

// Mock the Recipe schema to avoid mongoose connection issues
jest.mock('../schemas/RecipeSchema', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/', recipeRoute);

describe('Express-validator tests (no DB)', () => {
  beforeEach(() => jest.clearAllMocks());

  test('should reject when name is missing', async () => {
    const res = await request(app).post('/').send({ serves: 4 }).timeout(10000);

    console.log('Response status:', res.statusCode);
    console.log('Response body:', JSON.stringify(res.body, null, 2));
    console.log('Response text:', res.text);

    // Now that auth is mocked, we should get validation errors
    expect(res.statusCode).toBe(400); // Bad Request for validation errors
    // Check the actual structure of the validation error response from express-validator
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
    expect(res.body.errors[0].msg).toBe('Name must be a string');
    // Recipe model createRecipe should never be called when validation fails
    const recipeModel = require('../database/models/recipeModel');
    expect(recipeModel.createRecipe).not.toHaveBeenCalled();
  });

  //   test('should pass validation and call createRecipe', async () => {
  //     const res = await request(app)
  //       .post('/')
  //       .send({
  //         name: 'Test Recipe',
  //         serves: 4,
  //         ingredients: [
  //           {
  //             amount: 1,
  //             amountString: '1',
  //             measurement: 'cup',
  //             ingredient: 'flour',
  //           },
  //         ],
  //         instructions: [
  //           {
  //             stepNumber: 1,
  //             instruction: 'Mix ingredients',
  //           },
  //         ],
  //       });

  //     expect(res.statusCode).toBe(201);
  //     expect(res.body.name).toBe('Test Recipe');

  //     // Check that the mocked model function was called
  //     const recipeModel = require('../database/models/recipeModel');
  //     expect(recipeModel.createRecipe).toHaveBeenCalled();
  //   });
});
