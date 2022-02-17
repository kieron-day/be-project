const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");

beforeEach(() => {
	return seed(data);
});

afterAll(() => db.end());

describe("app", () => {
	describe("Global Error Handling Tests", () => {
		test("Status: 404, responds with 'Bad Request - Path Not Found'", () => {
			return request(app)
				.get("/api/no-endpoint")
				.expect(404)
				.then(({ body: { message } }) => {
					expect(message).toBe("Path Not Found");
				});
		});
	});
	describe("GET Request - /api/topics", () => {
		test("Status: 200, responds with array of topic objects", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body: { topics } }) => {
					expect(topics).toHaveLength(3);
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
	});
	describe("GET Request - /api/articles/:article_id", () => {
		test("Status: 200, responds with correct article object", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article).toEqual(
						expect.objectContaining({
							article_id: 1,
							title: "Living in the shadow of a great man",
							topic: "mitch",
							author: "butter_bridge",
							body: "I find this existence challenging",
							created_at: expect.any(String),
							votes: 100,
						})
					);
				});
		});
		test("Status: 400, responds with error message for invalid article_id", () => {
			return request(app)
				.get("/api/articles/wrong-endpoint-type")
				.expect(400)
				.then(({ body: { message } }) => {
					expect(message).toBe("Bad Request");
				});
		});
		test("Status: 404, responds with error message for valid article but does not exist", () => {
			return request(app)
				.get("/api/articles/12345")
				.expect(404)
				.then(({ body: { message } }) => {
					expect(message).toBe("Article Not Found");
				});
		});
	});
	describe("GET Request - /api/users", () => {
		test("Status: 200, responds with array of user objects", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(({ body: { users } }) => {
					expect(users).toHaveLength(4);
					users.forEach((user) => {
						expect(user).toEqual(
							expect.objectContaining({
								username: expect.any(String),
								name: expect.any(String),
								avatar_url: expect.any(String),
							})
						);
					});
				});
		});
	});
});
