const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Recipe = require('../schemas/RecipeSchema');

// Mock the authentication middleware to bypass auth in integration tests
jest.mock('../middleware/authentication', () => ({
  isAuthenticated: (req, res, next) => {
    // Skip authentication in tests - just call next()
    next();
  },
}));

let mongoServer;
let app;

beforeAll(async () => {
  // Close any existing mongoose connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Import server after database connection is established
  // Now it won't auto-connect because of our require.main check
  app = require('../server');
});

afterAll(async () => {
  // Safety check: Only drop database if it's the in-memory test database
  const dbHost = mongoose.connection.host;
  if (dbHost === '127.0.0.1' || dbHost === 'localhost') {
    console.log(
      'Dropping test database from:',
      mongoose.connection.db.databaseName,
    );
    await mongoose.connection.dropDatabase();
  } else {
    console.error('SAFETY CHECK: Refusing to drop database on host:', dbHost);
  }
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Recipe.deleteMany({});
});

describe('Get Recipe Endpoint', () => {
  test('should retrieve all recipes', async () => {
    await createValidRecipe('Test Recipe');
    await createValidRecipe('Test Recipe 2');
    const res = await request(app).get('/recipes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  test('get all when none exist', async () => {
    const res = await request(app).get('/recipes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  test('should retrieve a recipe by ID', async () => {
    const recipe = await createValidRecipe('Test Recipe');

    const res = await request(app).get(`/recipes/${recipe._id}`);
    console.log('Response status:', res.statusCode);
    console.log('Response body:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Test Recipe');
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
    const res = await request(app)
      .post('/recipes')
      .send({
        name: 'Test Recipe',
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
    expect(res.body.name).toBe('Test Recipe');

    const dbRecipe = await Recipe.findOne({ name: 'Test Recipe' });
    expect(dbRecipe).not.toBeNull();
    expect(dbRecipe.serves).toBe(4);
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
