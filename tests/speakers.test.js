const request = require("supertest")
const app = require("../server")

describe("Conference Speakers API", () => {
    test("should pull all of the speakers in the database", async () => {
        const res = await request(app).get("/speakers");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test("should return a 400 error for an invalid ID", async () => {
        const res = await request(app).get("/speakers/125ef156318633fs");
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "You passed an invalid ID");
    });

    test("sould return a 404 error for an valid ID but it's not found", async () => {
        const res = await request(app).get("/speakers/68e84f29c770d2bf2d5d1e57");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "Your speaker was not found");
    })
    
    test("should pull the first speaker in the database", async () => {
        const allSpeakers = await request(app).get("/speakers");
        const id = allSpeakers.body[0]._id;
        const res = await request(app).get(`/speakers/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("_id", id);
        expect(res.body).toHaveProperty("firstName");
        expect(res.body).toHaveProperty("lastName");
        expect(res.body).toHaveProperty("age");
        expect(res.body).toHaveProperty("birthYear");
        expect(res.body).toHaveProperty("quote");
    });

});