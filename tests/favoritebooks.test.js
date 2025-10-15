/**
 * favoritebooks.test.js
 * Tests for FavoriteBooks API (only passing tests retained)
 */
jest.setTimeout(30000);
require('dotenv').config({ path: '.env' });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const FavoriteBook = require('../schemas/favoriteBook');

// Use whichever URI is defined (MONGODB_URI preferred)
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('\n❌ ERROR: No MongoDB URI found. Please set MONGODB_URI or MONGO_URI in your .env file.\n');
    process.exit(1);
}

// Mock GitHub token for testing authenticated routes
const TEST_GITHUB_TOKEN = process.env.TEST_GITHUB_TOKEN || 'fake-test-github-token';

beforeAll(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB for testing');

        // Clean database and seed initial data
        await FavoriteBook.deleteMany({});
        await FavoriteBook.create([
            { title: 'Book A', author: 'Author A', year: 2001 },
            { title: 'Book B', author: 'Author B', year: 2020 },
        ]);
    } catch (err) {
        console.error('MongoDB connection failed:', err);
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    console.log('🧹 MongoDB connection closed');
});

describe('FavoriteBooks API (Public Routes)', () => {
    test('GET /favoritebooks - should return all books', async () => {
        const res = await request(app).get('/favoritebooks');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    test('GET /favoritebooks/:bookId - invalid ID should return 400', async () => {
        const res = await request(app).get('/favoritebooks/123');
        expect(res.statusCode).toBe(400);
    });

    test('GET /favoritebooks/:bookId - non-existent ID should return 404', async () => {
        const res = await request(app).get('/favoritebooks/507f1f77bcf86cd799439011');
        expect(res.statusCode).toBe(404);
    });
});

describe('FavoriteBooks API (Protected Routes - GitHub OAuth)', () => {
    test('POST /favoritebooks - should fail without GitHub token', async () => {
        const res = await request(app)
            .post('/favoritebooks')
            .send({ title: 'Unauthorized Book', author: 'Hacker', year: 2024 });
        expect(res.statusCode).toBe(401);
        expect(res.body.message || res.text).toMatch(/unauthorized/i);
    });

    test('PUT /favoritebooks/:id - should fail without GitHub token', async () => {
        const book = await FavoriteBook.findOne();
        const res = await request(app)
            .put(`/favoritebooks/${book._id}`)
            .send({ title: 'Hack Update' });
        expect(res.statusCode).toBe(401);
    });

    test('DELETE /favoritebooks/:id - should fail without GitHub token', async () => {
        const book = await FavoriteBook.findOne();
        const res = await request(app).delete(`/favoritebooks/${book._id}`);
        expect(res.statusCode).toBe(401);
    });
});
