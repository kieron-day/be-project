const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
	getArticles,
	getArticleById,
	patchArticleById,
} = require("./controllers/articles.controllers");
const {
	errorPathNotFound,
	errorCustom,
	errorPsql,
	error500s,
} = require("./controllers/error.controllers");

const app = express();

app.use(express.json());

// Topics
app.get("/api/topics", getTopics);

// Articles
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

//Error Handling
app.all("/*", errorPathNotFound);
app.use(errorCustom);
app.use(errorPsql);
app.use(error500s);

module.exports = app;
