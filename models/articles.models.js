const db = require("../db/connection");

exports.fetchArticles = () => {
	return db
		.query(
			"SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments USING (article_id) GROUP BY articles.article_id ORDER BY created_at DESC;"
		)
		.then(({ rows: articles }) => {
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
