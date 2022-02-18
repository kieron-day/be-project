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
	describe("Global - Error Handling", () => {
		test("Status: 404, responds with 'Bad Request - Path Not Found'", () => {
			return request(app)
				.get("/api/no-endpoint")
				.expect(404)
				.then(({ body: { message } }) => {
					expect(message).toBe("Path Not Found");
				});
		});
	});
	describe("Topics - Endpoint", () => {
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
	});
	describe("Articles - Endpoint", () => {
		describe("GET Request - /api/articles", () => {
			test("Status: 200, responds with array of article objects", () => {
				return request(app)
					.get("/api/articles")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toHaveLength(12);
						articles.forEach((articles) => {
							expect(articles).toEqual(
								expect.objectContaining({
									article_id: expect.any(Number),
									title: expect.any(String),
									topic: expect.any(String),
									author: expect.any(String),
									created_at: expect.any(String),
									votes: expect.any(Number),
								})
							);
						});
					});
			});
			test("Status: 200, articles are sorted by created_at, descending by default", () => {
				return request(app)
					.get("/api/articles")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toBeSortedBy("created_at", {
							descending: true,
						});
					});
			});
			test("Status 200 - articles have a comment_count property showing number of comments on article", () => {
				return request(app)
					.get("/api/articles")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toHaveLength(12);
						articles.forEach((article) => {
							expect(article).toEqual(
								expect.objectContaining({
									comment_count: expect.any(Number),
								})
							);
						});
					});
			});
			test("Status 200 - response can by ordered with order query - defaults to descending", () => {
				return request(app)
					.get("/api/articles?order=asc")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toBeSortedBy("created_at");
					});
			});
			test("Status 200 - response sorted any valid greenlisted column with the sort_by query", () => {
				return request(app)
					.get("/api/articles?sort_by=votes")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toBeSortedBy("votes", {
							descending: true,
						});
					});
			});
			test("Status 200 - response filtered by topic with the topic query", () => {
				return request(app)
					.get("/api/articles?topic=cats")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toHaveLength(1);
					});
			});
			test("Status 400 - responds with error 'Invalid Order-By Query' when order query is invalid", () => {
				return request(app)
					.get("/api/articles?order=invalid")
					.expect(400)
					.then(({ body: { message } }) => {
						expect(message).toBe("Invalid Order-By Query");
					});
			});
			test("Status 400 - responds with error 'Invalid Sort-By Query' when sort_by query is invalid", () => {
				return request(app)
					.get("/api/articles?sort_by=invalid-query")
					.expect(400)
					.then(({ body: { message } }) => {
						expect(message).toBe("Invalid Sort-By Query");
					});
			});
			test("Status 404 - responds with error object with message 'No Articles Found With Topic Provided' when the topic query results in no articles", () => {
				return request(app)
					.get("/api/articles?topic=does-not-exist")
					.expect(404)
					.then(({ body: { message } }) => {
						expect(message).toBe("No Articles Found With Topic Provided");
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
			test("Status: 200, responds with article object with corresponding comment_count property", () => {
				return request(app)
					.get("/api/articles/1")
					.expect(200)
					.then(({ body: { article } }) => {
						expect(article.comment_count).toBe(11);
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
		describe("GET Request - /api/articles/:article_id/comments", () => {
			test("Status: 200, responds with array of comments for given article_id", () => {
				return request(app)
					.get("/api/articles/3/comments")
					.expect(200)
					.then(({ body: { comments } }) => {
						expect(comments).toHaveLength(2);
						comments.forEach((comment) => {
							expect(comment).toEqual(
								expect.objectContaining({
									comment_id: expect.any(Number),
									votes: expect.any(Number),
									created_at: expect.any(String),
									author: expect.any(String),
									body: expect.any(String),
								})
							);
						});
					});
			});
			test("Status: 200, responds with empty array if no comments found", () => {
				return request(app)
					.get("/api/articles/2/comments")
					.expect(200)
					.then(({ body: { comments } }) => {
						expect(comments.length).toBe(0);
					});
			});
			test("Status: 404, responds with error if valid but non-existant article", () => {
				return request(app)
					.get("/api/articles/999999/comments")
					.expect(404)
					.then(({ body: { message } }) => {
						expect(message).toBe("Article Not Found");
					});
			});
		});
		describe("POST Request - /api/articles/:article_id/comments", () => {
			test("Status: 201, responds with posted comment", () => {
				return request(app)
					.post("/api/articles/1/comments")
					.send({ username: "butter_bridge", body: "This is a test comment." })
					.expect(201)
					.then(({ body: { comment } }) => {
						expect(comment).toEqual(
							expect.objectContaining({
								comment_id: expect.any(Number),
								votes: expect.any(Number),
								created_at: expect.any(String),
								author: "butter_bridge",
								body: "This is a test comment.",
							})
						);
					});
			});
			test("Status: 400, error if no username is provided", () => {
				return request(app)
					.post("/api/articles/1/comments")
					.send({ body: "No username provided" })
					.expect(400)
					.then(({ body: { message } }) => {
						expect(message).toBe("Missing A Required Field");
					});
			});
			test("Status: 400, error if no body is provided", () => {
				return request(app)
					.post("/api/articles/1/comments")
					.send({ username: "butter_bridge" })
					.expect(400)
					.then(({ body: { message } }) => {
						expect(message).toBe("Missing A Required Field");
					});
			});
			test("Status: 400, error if article_id is incorrect format", () => {
				return request(app)
					.post("/api/articles/not-a-number/comments")
					.send({ username: "butter_bridge", body: "This is a test comment." })
					.expect(400)
					.then(({ body: { message } }) => {
						expect(message).toBe("Bad Request");
					});
			});
			test("Status: 400, error if article_id is incorrect format", () => {
				return request(app)
					.post("/api/articles/12345/comments")
					.send({ username: "butter_bridge", body: "This is a test comment." })
					.expect(404)
					.then(({ body: { message } }) => {
						expect(message).toBe("Article Not Found");
					});
			});
		});
		describe("PATCH Request - /api/articles/:article_id", () => {
			test("Status: 200, responds with correct article object", () => {
				return request(app)
					.patch("/api/articles/1")
					.send({ inc_votes: 5 })
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
								votes: 105,
							})
						);
					});
			});
			test("Status 400 - Invalid request body used for patch", () => {
				const body = { inc_votes: "Not a number" };
				return request(app)
					.patch("/api/articles/1")
					.send(body)
					.expect(400)
					.then(({ body: { message } }) => {
						expect(message).toBe("Bad Request");
					});
			});
		});
	});
	describe("Users - Endpoint", () => {
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
								})
							);
						});
					});
			});
		});
	});
	describe("Comments - Endpoint", () => {
		describe("DELETE Request - /api/comments/:comment_id", () => {
			test("Status 204 - Success, responds with no content", () => {
				return request(app)
					.delete("/api/comments/2")
					.expect(204)
					.then(() => {
						return request(app)
							.get("/api/articles/1/comments")
							.expect(200)
							.then(({ body: { comments } }) => {
								expect(comments).toHaveLength(10);
							});
					});
			});
			test("Status 400 - responds with 'Bad Request' if invalid comment_id type", () => {
				return request(app)
					.delete("/api/comments/not-an-number")
					.expect(400)
					.then(({ body: { message } }) => {
						expect(message).toBe("Bad Request");
					});
			});
			test("Status 404 - responds with error 'No Comments Found' when valid comment_id does not exist", () => {
				return request(app)
					.delete("/api/comments/12345")
					.expect(404)
					.then(({ body: { message } }) => {
						expect(message).toBe("No Comments Found");
					});
			});
		});
	});
});
