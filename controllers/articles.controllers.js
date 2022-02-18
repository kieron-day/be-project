const {
	fetchArticles,
	fetchArticleById,
	fetchArticleCommentsById,
	updateArticleById,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
	fetchArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
};
exports.getArticleById = (req, res, next) => {
	const articleId = req.params.article_id;
	fetchArticleById(articleId)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};
exports.getArticleCommentsById = (req, res, next) => {
	const articleId = req.params.article_id;
	const isArticleFound = fetchArticleById(articleId);
	return Promise.all([articleId, isArticleFound])
		.then(([articleId]) => {
			return fetchArticleCommentsById(articleId);
		})
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};
exports.patchArticleById = (req, res, next) => {
	const articleId = req.params.article_id;
	const incVotes = req.body.inc_votes;
	updateArticleById(articleId, incVotes)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};
