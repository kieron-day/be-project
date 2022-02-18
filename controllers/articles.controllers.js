const {
	fetchArticles,
	fetchArticleById,
	fetchCommentsByArticleId,
	insertCommentByArticleId,
	updateArticleById,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
	const sortBy = req.query.sort_by;
	const order = req.query.order;
	const topic = req.query.topic;
	fetchArticles(sortBy, order, topic)
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
exports.getCommentsByArticleId = (req, res, next) => {
	const articleId = req.params.article_id;
	const isArticleFound = fetchArticleById(articleId);
	return Promise.all([articleId, isArticleFound])
		.then(([articleId]) => {
			return fetchCommentsByArticleId(articleId);
		})
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};
exports.postCommentByArticleId = (req, res, next) => {
	const articleId = req.params.article_id;
	const isArticleFound = fetchArticleById(articleId);
	const commentUsername = req.body.username;
	const commentBody = req.body.body;
	return Promise.all([articleId, isArticleFound, commentUsername, commentBody])
		.then(([articleId]) => {
			return insertCommentByArticleId(articleId, commentUsername, commentBody);
		})
		.then((comment) => {
			res.status(201).send({ comment });
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
