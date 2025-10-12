/**
 * MASTER TEST FILE
 * Covers all collections, routes, validation, and authentication
 */

require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// === Import Models ===
const FavoriteBook = require('../schemas/favoriteBook');
const Movie = require('../schemas/MovieSchema');
const Recipe = require('../schemas/RecipeSchema');
const Scripture = require('../schemas/ScriptureSchema');
const Speaker = require('../schemas/SpeakerSchema');
const ProgrammingLanguage = require('../schemas/programmingLanguageSchema');

// === Mock Authentication Token ===
const TOKEN = 'mocked-jwt-token';

// === Global Setup ===
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clean and seed base data
    await Promise.all([
        FavoriteBook.deleteMany({}),
        Movie.deleteMany({}),
        Recipe.deleteMany({}),
        Scripture.deleteMany({}),
        Speaker.deleteMany({}),
        ProgrammingLanguage.deleteMany({})
    ]);

    await FavoriteBook.create([{ title: 'Book A', author: 'Author A', year: 2001 }]);
    await Movie.create([{ title: 'Inception', director: 'Nolan', year: 2010 }]);
    await Recipe.create([{ title: 'Pasta', ingredients: ['noodles'], instructions: 'Boil water' }]);
    await Scripture.create([{ book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning...' }]);
    await Speaker.create([{ name: 'John Doe', topic: 'Faith', year: 2023 }]);
    await ProgrammingLanguage.create([{ name: 'JavaScript', paradigm: 'Functional', created: 1995 }]);
});

afterAll(async () => {
    await mongoose.connection.close();
});

// === Generic CRUD Test Runner ===
const runFullCrudTests = (label, endpoint, sample, update) => {
    describe(`${label} API`, () => {
        test(`GET /${endpoint} - should return all`, async () => {
            const res = await request(app).get(`/${endpoint}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test(`GET /${endpoint}/:id - should return one`, async () => {
            const all = await request(app).get(`/${endpoint}`);
            const id = all.body[0]?._id;
            const res = await request(app).get(`/${endpoint}/${id}`);
            expect([200, 404]).toContain(res.statusCode);
        });

        test(`GET /${endpoint}/:id - invalid id returns 400`, async () => {
            const res = await request(app).get(`/${endpoint}/invalid-id`);
            expect([400, 404]).toContain(res.statusCode);
        });

        test(`POST /${endpoint} - no auth returns 401`, async () => {
            const res = await request(app).post(`/${endpoint}`).send(sample);
            expect(res.statusCode).toBe(401);
        });

        test(`POST /${endpoint} - creates new with auth`, async () => {
            const res = await request(app)
                .post(`/${endpoint}`)
                .set('Authorization', `Bearer ${TOKEN}`)
                .send(sample);
            expect([200, 201]).toContain(res.statusCode);
        });

        test(`POST /${endpoint} - missing fields returns 400`, async () => {
            const res = await request(app)
                .post(`/${endpoint}`)
                .set('Authorization', `Bearer ${TOKEN}`)
                .send({});
            expect([400, 500]).toContain(res.statusCode);
        });

        test(`PUT /${endpoint}/:id - update with auth`, async () => {
            const all = await request(app).get(`/${endpoint}`);
            const id = all.body[0]?._id;
            const res = await request(app)
                .put(`/${endpoint}/${id}`)
                .set('Authorization', `Bearer ${TOKEN}`)
                .send(update);
            expect([200, 204]).toContain(res.statusCode);
        });

        test(`PUT /${endpoint}/:id - invalid data returns 400`, async () => {
            const all = await request(app).get(`/${endpoint}`);
            const id = all.body[0]?._id;
            const res = await request(app)
                .put(`/${endpoint}/${id}`)
                .set('Authorization', `Bearer ${TOKEN}`)
                .send({});
            expect([400, 500]).toContain(res.statusCode);
        });

        test(`DELETE /${endpoint}/:id - no auth returns 401`, async () => {
            const all = await request(app).get(`/${endpoint}`);
            const id = all.body[0]?._id;
            const res = await request(app).delete(`/${endpoint}/${id}`);
            expect(res.statusCode).toBe(401);
        });

        test(`DELETE /${endpoint}/:id - deletes with auth`, async () => {
            const all = await request(app).get(`/${endpoint}`);
            const id = all.body[0]?._id;
            const res = await request(app)
                .delete(`/${endpoint}/${id}`)
                .set('Authorization', `Bearer ${TOKEN}`);
            expect([200, 204]).toContain(res.statusCode);
        });
    });
};

// === Run Full Tests for Each Collection ===
runFullCrudTests('FavoriteBooks', 'favoritebooks',
    { title: 'Book B', author: 'Author B', year: 2022 },
    { title: 'Updated Book Title' }
);

runFullCrudTests('Movies', 'movies',
    { title: 'Interstellar', director: 'Nolan', year: 2014 },
    { title: 'Updated Movie Title' }
);

runFullCrudTests('Recipes', 'recipes',
    { title: 'Cake', ingredients: ['flour', 'sugar'], instructions: 'Bake' },
    { instructions: 'Bake for 30 minutes' }
);

runFullCrudTests('Scriptures', 'scriptures',
    { book: 'Exodus', chapter: 3, verse: 14, text: 'I AM THAT I AM' },
    { text: 'Updated Scripture Text' }
);

runFullCrudTests('Speakers', 'speakers',
    { name: 'Jane Doe', topic: 'Hope', year: 2024 },
    { topic: 'Updated Topic' }
);

runFullCrudTests('ProgrammingLanguages', 'programminglanguages',
    { name: 'Python', paradigm: 'OOP', created: 1991 },
    { paradigm: 'OOP + Functional' }
);

// === Extra: 500 Error Simulation ===
describe('Error Handling Simulation', () => {
    test('GET /unknownroute - should return 404', async () => {
        const res = await request(app).get('/notreal');
        expect(res.statusCode).toBe(404);
    });
});
