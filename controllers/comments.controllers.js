const { removeCommentById } = require("../models/comments.models");

exports.deleteCommentById = (req, res, next) => {
	const commentId = req.params.comment_id;
	return removeCommentById(commentId)
		.then(() => {
			return res.status(204).send();
		})
		.catch((err) => {
			next(err);
		});
};
