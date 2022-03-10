const db = require("../db/connection");

exports.fetchArticles = (sortBy = "created_at", order = "DESC", topic) => {
	const greenlistSortBy = [
		"author",
		"title",
		"article_id",
		"topic",
		"created_at",
		"votes",
		"comment_count",
	];
	const greenlistOrderBy = ["ASC", "DESC", "asc", "desc"];

	if (!greenlistSortBy.includes(sortBy)) {
		return Promise.reject({ message: "Invalid Sort-By Query", status: 400 });
	}

	if (!greenlistOrderBy.includes(order)) {
		return Promise.reject({ message: "Invalid Order-By Query", status: 400 });
	}

	let queryBuilder = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments USING(article_id)`;

	const injectValues = [];
	if (topic) {
		queryBuilder += " WHERE topic LIKE $1";
		injectValues.push(`${topic}`);
	}

	queryBuilder += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;
	return db.query(queryBuilder, injectValues).then(({ rows: articles }) => {
		if (articles.length === 0) {
			return Promise.reject({
				message: "No Articles Found With Topic Provided",
				status: 404,
			});
		}
		return articles;
	});
};
exports.fetchArticleById = (articleId) => {
	return db
		.query(
			"SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments USING (article_id) WHERE article_id = $1 GROUP BY articles.article_id;",
			[articleId]
		)
		.then(({ rows: article }) => {
			if (article.length === 0) {
				return Promise.reject({ message: "Article Not Found", status: 404 });
			}
			return article[0];
		});
};
exports.fetchCommentsByArticleId = (articleId) => {
	return db
		.query(
			"SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
			[articleId]
		)
		.then(({ rows: comments }) => {
			return comments;
		});
};
exports.insertCommentByArticleId = (
	articleId,
	commentUsername,
	commentBody
) => {
	return db
		.query(
			"INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
			[articleId, commentUsername, commentBody]
		)
		.then(({ rows: comment }) => {
			return comment[0];
		});
};
exports.updateArticleById = (articleId, incVotes) => {
	return db
		.query(
			"UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
			[incVotes, articleId]
		)
		.then(({ rows: updatedArticle }) => {
			if (updatedArticle.length === 0) {
				return Promise.reject({ message: "Article Not Found", status: 404 });
			}
			return updatedArticle[0];
		});
};
