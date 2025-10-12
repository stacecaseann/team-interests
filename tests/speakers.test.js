const request = require('supertest');
const app = require('../server');

describe('Get all speakers and get a speaker by ID', () => {
  test('Should get all speakers', async () => {
    const res = await request(app).get('/speakers');
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]._id).toBeDefined();
    expect(res.body[0].firstName).toBeDefined();
    expect(res.body[0].lastName).toBeDefined();
    expect(res.body[0].age).toBeDefined();
    expect(res.body[0].birthYear).toBeDefined();
    expect(res.body[0].quote).toBeDefined();
  });

  test('Should get a speaker by ID', async () => {
    const allSpeakers = await request(app).get('/speakers');
    const id = allSpeakers.body[0]._id;
    const res = await request(app).get(`/speakers/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.firstName).toBeDefined();
    expect(res.body.lastName).toBeDefined();
    expect(res.body.age).toBeDefined();
    expect(res.body.birthYear).toBeDefined();
    expect(res.body.quote).toBeDefined();
  });

  test('Should return a 400 error for an invalid ID', async () => {
    const res = await request(app).get('/speakers/125ef156318633fs');
    expect(res.statusCode).toBe(400);
  });

  test('Should return a 404 error for a valid ID that is not found', async () => {
    const res = await request(app).get('/speakers/68e84f29c770d2bf2d5d1e57');
    expect(res.statusCode).toBe(404);
  });
});
