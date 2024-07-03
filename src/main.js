import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import express from "express";

import router from "./routers/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
	const orig = res.render;
	// you'll probably want to use a full blown render engine capable of layouts
	res.render = (view, locals) => {
		app.render(view, locals, (err, html) => {
			if (err) throw err;
			orig.call(res, "layout", {
				...locals,
				body: html,
			});
		});
	};
	next();
});

app.use(router);

app.listen(port, () => {
	if (process.env.NODE_ENV === "development") {
		console.log(`Server is Fire at http://localhost:${port}`);
	} else {
		console.log(`Server is Fire !!!`);
	}
});
