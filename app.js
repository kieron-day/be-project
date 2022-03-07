const cors = require("cors");
const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
	getArticles,
	getArticleById,
	getCommentsByArticleId,
	postCommentByArticleId,
	patchArticleById,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");

const {
	errorPathNotFound,
	errorCustom,
	errorPsql,
	error500s,
} = require("./controllers/error.controllers");

const app = express();
app.use(cors());
app.use(express.json());

// Topics
app.get("/api/topics", getTopics);

// Articles
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleById);

//Users
app.get("/api/users", getUsers);

//Comments
app.delete("/api/comments/:comment_id", deleteCommentById);

//Error Handling
app.all("/*", errorPathNotFound);
app.use(errorCustom);
app.use(errorPsql);
app.use(error500s);

module.exports = app;
