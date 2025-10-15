jest.setTimeout(15000);
const request = require('supertest');
const app = require('../server');

describe('Get all books and get a book by ID', () => {
  test('Should get all books', async () => {
    const res = await request(app).get('/favoritebooks');
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]._id).toBeDefined();
    expect(res.body[0].title).toBeDefined();
    expect(res.body[0].author).toBeDefined();
    expect(res.body[0].year).toBeDefined();
    expect(res.body[0].createdAt).toBeDefined();
    expect(res.body[0].updatedAt).toBeDefined();
  });

  test('Should get a book by ID', async () => {
    const allBooks = await request(app).get('/favoritebooks');
    const id = allBooks.body[0]._id;
    const res = await request(app).get(`/favoritebooks/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBeDefined();
    expect(res.body.author).toBeDefined();
    expect(res.body.year).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();
  });

  test('Should return a 400 error for an invalid ID', async () => {
    const res = await request(app).get('/favoritebooks/68e7cd0a2aa8fd30f25c6');
    expect(res.statusCode).toBe(400);
  });

  test('Should return a 404 error for a valid ID that is not found', async () => {
    const res = await request(app).get(
      '/favoritebooks/68e7cd0a2aa8fd30f25c6eaa',
    );
    expect(res.statusCode).toBe(404);
  });
});
