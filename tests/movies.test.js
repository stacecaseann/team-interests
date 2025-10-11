const request = require('supertest');
const app = require('../server');

describe('Movies API', () => {
  test('should pull all of the movies in the database', async () => {
    const res = await request(app).get('/movies');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('should return a 400 error for an invalid ID', async () => {
    const res = await request(app).get('/movies/125ef156318633fs');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid ID format');
  });

  test("sould return a 404 error for an valid ID but it's not found", async () => {
    const res = await request(app).get('/movies/68e84f29c770d2bf2d5d1e57');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Movie not found');
  });

  test('should pull the first movie in the database', async () => {
    const allMovies = await request(app).get('/movies');
    const id = allMovies.body[0]._id;
    const res = await request(app).get(`/movies/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', id);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('language');
    expect(res.body).toHaveProperty('year');
    expect(res.body).toHaveProperty('genre');
    expect(res.body).toHaveProperty('synopsis');
    expect(res.body).toHaveProperty('createdAt');
  });
});
