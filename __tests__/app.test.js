const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
	return seed(data);
});

describe("app", () => {
	describe("GET Request - /api/topics", () => {
		test("Status: 200", () => {
			return request(app).get("/api/topics").expect(200);
		});
		test("Status: 200, responds with an array", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body: { topics } }) => {
					expect.any(Array.isArray(topics) === true);
				});
		});
		test("Status: 200, responds with array with 3 elements", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body: { topics } }) => {
					expect(topics).toHaveLength(3);
				});
		});
		test("Status: 200, responds with array of topic objects", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body: { topics } }) => {
					topics.forEach((topic) => {
						expect(topic).toEqual(
							expect.objectContaining({
								slug: expect.any(String),
								description: expect.any(String),
							})
						);
					});
				});
		});
		test("Status: 404, responds with 'Bad Request - Path Not Found'", () => {
			return request(app)
				.get("/api/no-endpoint")
				.expect(404)
				.then(({ body: { message } }) => {
					expect(message).toBe("Bad Request - Path Not Found");
				});
		});
	});
});
