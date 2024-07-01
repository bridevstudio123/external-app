const auth = (req, res, next) => {
	try {
		const email = req.headers["x-forwarded-email"];
		console.log("email", email);
		next();
	} catch (error) {
		res.status(403).json({ status: "error", message: error?.message });
	}
};

export default auth;
