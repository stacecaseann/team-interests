jest.setTimeout(15000);
const request = require('supertest');
const app = require('../server');

describe('Get all movies and get a movie by ID', () => {
  test('Should get all movies', async () => {
    const response = await request(app).get('/movies');

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.statusCode).toBe(200);
    expect(response.body[0]._id).toBeDefined();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].director).toBeDefined();
    expect(response.body[0].language).toBeDefined();
    expect(response.body[0].year).toBeDefined();
    expect(response.body[0].genre).toBeDefined();
    expect(response.body[0].synopsis).toBeDefined();
    expect(response.body[0].createdAt).toBeDefined();
  });

  test('Should get a movie by ID', async () => {
    const allMovies = await request(app).get('/movies');
    const id = allMovies.body[0]._id;
    const response = await request(app).get(`/movies/${id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.title).toBeDefined();
    expect(response.body.director).toBeDefined();
    expect(response.body.language).toBeDefined();
    expect(response.body.year).toBeDefined();
    expect(response.body.genre).toBeDefined();
    expect(response.body.synopsis).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
  });

  test('Should return a 400 error for an invalid ID', async () => {
    const response = await request(app).get('/movies/68e7cd0a2aa8fd30f25c6');
    expect(response.statusCode).toBe(400);
  });

  test('Should return a 404 error for a valid ID that is not found', async () => {
    const response = await request(app).get('/movies/68e7cd0a2aa8fd30f25c6eaa');
    expect(response.statusCode).toBe(404);
  });
});

// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// describe('create a new movie', () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     db = connection.db();
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

//   afterEach(async () => {
//     await db.collection('movies').deleteOne({ title: 'Inception' });
//   });

//   test('should create a new movie in the database', async () => {
//     const movies = db.collection('movies');
//     const newMovie = {
//       title: 'Inception',
//       language: 'English',
//       year: 2010,
//       genre: 'Sci-Fi',
//       synopsis:
//         'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
//     };
//     const result = await movies.insertOne(newMovie);
//     expect(result.insertedId).toBeDefined();
//   });
// });
