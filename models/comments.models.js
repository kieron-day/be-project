const db = require("../db/connection");

exports.removeCommentById = (commentId) => {
	return db
		.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
			commentId,
		])
		.then(({ rows: comment }) => {
			if (comment.length === 0) {
				return Promise.reject({ message: "No Comments Found", status: 404 });
			}
			return comment[0];
		});
};
