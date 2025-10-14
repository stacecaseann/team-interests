jest.setTimeout(15000);
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Recipe = require('../schemas/RecipeSchema');

let mongoServer;

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
  // Only delete from test database (should be in-memory)
  if (mongoose.connection.host === '127.0.0.1') {
    await Recipe.deleteMany();
  } else {
    throw new Error(
      'Test is connected to non-local database! Aborting cleanup.',
    );
  }
});

describe('Mongoose Schema Validation', () => {
  test('should throw validation error when name is missing', async () => {
    const recipe = new Recipe({ serves: 4 });
    let error;
    try {
      await recipe.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.name.message).toBe('name is required');
  });

  test('should throw validation error for serves < 1', async () => {
    const recipe = new Recipe({ name: 'Test Recipe', serves: 0 });
    let error;
    try {
      await recipe.save();
    } catch (err) {
      error = err;
    }
    expect(error.errors.serves.message).toBe('Serves must be at least 1');
  });

  test('should save successfully when valid', async () => {
    const recipe = new Recipe({
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
    const saved = await recipe.save();

    expect(saved._id).toBeDefined();
    expect(saved.name).toBe('Test Recipe');
    expect(saved.serves).toBe(4);
  });
});
