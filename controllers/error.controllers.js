exports.errorPathNotFound = (req, res) => {
	res.status(404).send({ message: "Path Not Found" });
};

exports.errorCustom = (err, req, res, next) => {
	if (err.status) res.status(err.status).send({ message: err.message });
	else next(err);
};

exports.errorPsql = (err, req, res, next) => {
	if (err.code === "22P02") res.status(400).send({ message: "Bad Request" });
	else next(err);
};

exports.error500s = (err, req, res, next) => {
	res.status(500).send({ message: "Server Error" });
};
