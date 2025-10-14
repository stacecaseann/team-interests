jest.setTimeout(15000);
const request = require('supertest');
const app = require('../server');

describe('Get all languages and get a language by ID', () => {
  test('Should get all languages', async () => {
    const res = await request(app).get('/languages');
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]._id).toBeDefined();
    expect(res.body[0].name).toBeDefined();
    expect(res.body[0].paradigm).toBeDefined();
    expect(res.body[0].firstAppeared).toBeDefined();
    expect(res.body[0].creator).toBeDefined();
    expect(res.body[0].website).toBeDefined();
    expect(res.body[0].description).toBeDefined();
  });

  test('Should get a language by ID', async () => {
    const allLanguages = await request(app).get('/languages');
    const id = allLanguages.body[0]._id;
    const res = await request(app).get(`/languages/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toBeDefined();
    expect(res.body.paradigm).toBeDefined();
    expect(res.body.firstAppeared).toBeDefined();
    expect(res.body.creator).toBeDefined();
    expect(res.body.website).toBeDefined();
    expect(res.body.description).toBeDefined();
  });

  test('Should return a 400 error for an invalid ID', async () => {
    const res = await request(app).get('/languages/68e7cd0a2aa8fd30f25c6');
    expect(res.statusCode).toBe(400);
  });

  test('Should return a 404 error for a valid ID that is not found', async () => {
    const res = await request(app).get('/languages/68e7cd0a2aa8fd30f25c6eaa');
    expect(res.statusCode).toBe(404);
  }, 15000);
});
