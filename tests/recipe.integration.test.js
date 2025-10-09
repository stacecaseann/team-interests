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

describe('Create Recipe Endpoint', () => {
  // test('should fail validation if name is missing', async () => {
  //   const res = (await request(app).post('/api/recipes')).setEncoding({
  //     serves: 4,
  //     description: 'A delicious test recipe',
  //   });
  //   expect(res.statusCode).toBe(400);
  //   expect(res.body.errors[0].msg).toBe('Name is required');
  // });
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
