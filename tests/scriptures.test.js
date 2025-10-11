const request = require('supertest');
const app = require('../server');

describe('Scriptures API', () => {
  test('should pull all of the scriptures in the database', async () => {
    const res = await request(app).get('/scriptures');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('should return a 400 error for an invalid ID', async () => {
    const res = await request(app).get('/scriptures/125ef156318633fs');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid ID format');
  });

  test("sould return a 404 error for an valid ID but it's not found", async () => {
    const res = await request(app).get('/scriptures/68e84f29c770d2bf2d5d1e57');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Scripture not found');
  });

  test('should pull the first scripture in the database', async () => {
    const allScriptures = await request(app).get('/scriptures');
    const id = allScriptures.body[0]._id;
    const res = await request(app).get(`/scriptures/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', id);
    expect(res.body).toHaveProperty('book');
    expect(res.body).toHaveProperty('chapter');
    expect(res.body).toHaveProperty('verse');
    expect(res.body).toHaveProperty('text');
  });
});
