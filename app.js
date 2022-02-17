const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
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
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.all("/*", errorPathNotFound);
app.use(errorCustom);
app.use(errorPsql);
app.use(error500s);

module.exports = app;
