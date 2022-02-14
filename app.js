const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/*", (req, res) => {
	res.status(404).send({ message: "Bad Request - Path Not Found" });
});

module.exports = app;
