jest.setTimeout(15000);
const request = require('supertest');
const app = require('../server');

describe('Get all scriptures and get a scripture by ID', () => {
  test('Should get all scriptures', async () => {
    const res = await request(app).get('/scriptures');
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]._id).toBeDefined();
    expect(res.body[0].book).toBeDefined();
    expect(res.body[0].chapter).toBeDefined();
    expect(res.body[0].verse).toBeDefined();
    expect(res.body[0].text).toBeDefined();
  });

  test('Should get a scripture by ID', async () => {
    const allScriptures = await request(app).get('/scriptures');
    const id = allScriptures.body[0]._id;
    const res = await request(app).get(`/scriptures/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.book).toBeDefined();
    expect(res.body.chapter).toBeDefined();
    expect(res.body.verse).toBeDefined();
    expect(res.body.text).toBeDefined();
  });

  test('Should return a 400 error for an invalid ID', async () => {
    const res = await request(app).get('/scriptures/68e7cd0a2aa8fd30f25c6');
    expect(res.statusCode).toBe(400);
  });

  test('Should return a 404 error for a valid ID that is not found', async () => {
    const res = await request(app).get('/scriptures/68e7cd0a2aa8fd30f25c6eaa');
    expect(res.statusCode).toBe(404);
  });
});
