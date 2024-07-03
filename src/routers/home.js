import { Router } from "express";

const home = Router();

home.get("/", (req, res) => {
	res.render("home", {
		title: "Home",
		name: req.user ? req.user.name : "",
	});
});

export default home;
