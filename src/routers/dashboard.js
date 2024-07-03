import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();

const dashboard = Router();

dashboard.get("/dashboard", (req, res) => {
	console.log("===user===", req.user);
	res.render("dashboard", {
		title: "Dashboard",
		name: req.user.name,
		externalApp1: process.env.EXTERNAL_APP_1,
	});
});

export default dashboard;
