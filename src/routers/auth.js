import { Router } from "express";
import { passport } from "../middleware/index.js";

const auth = Router();

auth.get("/login", passport.authenticate("openidconnect"));

auth.get(
	"/auth/callback",
	passport.authenticate("openidconnect", {
		failureRedirect: "/login",
		failureMessage: true,
	}),
	function (req, res) {
		res.redirect("/");
	}
);

auth.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
		console.log(`-------> User Logged out`);
	});
});

export default auth;
