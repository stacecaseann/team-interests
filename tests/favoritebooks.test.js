const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const FavoriteBook = require('../schemas/favoriteBook');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await FavoriteBook.deleteMany({});
    await FavoriteBook.create([
        { title: 'Book A', author: 'Author A', year: 2001 },
        { title: 'Book B', author: 'Author B', year: 2020 },
    ]);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('FavoriteBooks API', () => {
    // -----------------------
    // GET all
    // -----------------------
    test('GET /favoritebooks - should return all books', async () => {
        const res = await request(app).get('/favoritebooks');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    // -----------------------
    // GET by ID (valid)
    // -----------------------
    test('GET /favoritebooks/:bookId - should return a single book', async () => {
        const book = await FavoriteBook.findOne();
        const res = await request(app).get(`/favoritebooks/${book._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('title', book.title);
    });

    // -----------------------
    // GET by ID (invalid)
    // -----------------------
    test('GET /favoritebooks/:bookId - invalid ID should return 400', async () => {
        const res = await request(app).get('/favoritebooks/123');
        expect(res.statusCode).toBe(400);
    });

    // -----------------------
    // GET by ID (not found)
    // -----------------------
    test('GET /favoritebooks/:bookId - non-existent ID should return 404', async () => {
        const res = await request(app).get('/favoritebooks/507f1f77bcf86cd799439011');
        expect(res.statusCode).toBe(404);
    });

    // -----------------------
    // POST - valid data
    // -----------------------
    test('POST /favoritebooks - should create a new book', async () => {
        const newBook = { title: 'New Book', author: 'New Author', year: 2023 };
        const res = await request(app).post('/favoritebooks').send(newBook);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('New Book');
    });

    // -----------------------
    // POST - invalid data
    // -----------------------
    test('POST /favoritebooks - missing fields should return 400', async () => {
        const invalidBook = { title: 'Incomplete Book' }; // missing author/year
        const res = await request(app).post('/favoritebooks').send(invalidBook);
        expect(res.statusCode).toBe(400);
    });

    // -----------------------
    // PUT - valid update
    // -----------------------
    test('PUT /favoritebooks/:bookId - should update book details', async () => {
        const book = await FavoriteBook.findOne();
        const res = await request(app)
            .put(`/favoritebooks/${book._id}`)
            .send({ title: 'Updated Title', author: 'Updated Author', year: 2024 });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated Title');
    });

    // -----------------------
    // PUT - invalid ID
    // -----------------------
    test('PUT /favoritebooks/:bookId - invalid ID should return 400', async () => {
        const res = await request(app)
            .put('/favoritebooks/invalid-id')
            .send({ title: 'Updated Title' });
        expect(res.statusCode).toBe(400);
    });

    // -----------------------
    // PUT - missing fields
    // -----------------------
    test('PUT /favoritebooks/:bookId - missing required field should return 400', async () => {
        const book = await FavoriteBook.findOne();
        const res = await request(app)
            .put(`/favoritebooks/${book._id}`)
            .send({ year: '' }); // invalid year
        expect(res.statusCode).toBe(400);
    });

    // -----------------------
    // DELETE - valid ID
    // -----------------------
    test('DELETE /favoritebooks/:bookId - should delete a book', async () => {
        const book = await FavoriteBook.findOne();
        const res = await request(app).delete(`/favoritebooks/${book._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });

    // -----------------------
    // DELETE - invalid ID
    // -----------------------
    test('DELETE /favoritebooks/:bookId - invalid ID should return 400', async () => {
        const res = await request(app).delete('/favoritebooks/invalid-id');
        expect(res.statusCode).toBe(400);
    });

    // -----------------------
    // DELETE - not found
    // -----------------------
    test('DELETE /favoritebooks/:bookId - non-existent ID should return 404', async () => {
        const res = await request(app).delete('/favoritebooks/507f1f77bcf86cd799439011');
        expect(res.statusCode).toBe(404);
    });
});
// -----------------------
// AUTHENTICATION TESTS
// -----------------------
describe('Protected Routes - Authentication Required', () => {
    let token;

    beforeAll(async () => {
        // ✅ Mock login route to simulate OAuth login (replace with your actual endpoint)
        const loginResponse = await request(app)
            .post('/auth/mocklogin')
            .send({ email: 'testuser@example.com', password: 'password123' });

        token = loginResponse.body.token; // Assume token is returned after login
    });

    test('POST /favoritebooks - should fail without authentication', async () => {
        const res = await request(app)
            .post('/favoritebooks')
            .send({ title: 'Unauthorized Book', author: 'Hacker', year: 2024 });
        expect(res.statusCode).toBe(401);
        expect(res.body.message || res.text).toMatch(/unauthorized/i);
    });

    test('POST /favoritebooks - should create a book with valid token', async () => {
        const res = await request(app)
            .post('/favoritebooks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Authorized Book', author: 'OAuth User', year: 2024 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('title', 'Authorized Book');
    });

    test('PUT /favoritebooks/:id - should fail without authentication', async () => {
        const book = await FavoriteBook.findOne();
        const res = await request(app)
            .put(`/favoritebooks/${book._id}`)
            .send({ title: 'Hack Update' });
        expect(res.statusCode).toBe(401);
    });

    test('PUT /favoritebooks/:id - should update with valid token', async () => {
        const book = await FavoriteBook.findOne();
        const res = await request(app)
            .put(`/favoritebooks/${book._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Updated by Authorized User' });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated by Authorized User');
    });

    test('DELETE /favoritebooks/:id - should fail without authentication', async () => {
        const book = await FavoriteBook.findOne();
        const res = await request(app).delete(`/favoritebooks/${book._id}`);
        expect(res.statusCode).toBe(401);
    });

    test('DELETE /favoritebooks/:id - should delete with valid token', async () => {
        const book = await FavoriteBook.findOne();
        const res = await request(app)
            .delete(`/favoritebooks/${book._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });
});
