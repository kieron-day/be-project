const db = require("../db/connection");

exports.fetchArticleById = (articleId) => {
	return db
		.query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
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
