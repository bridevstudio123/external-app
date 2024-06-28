import passport from "passport";
import express, {
	Express,
	Request,
	Response,
	Application,
	NextFunction,
} from "express";
import dotenv from "dotenv";
const GoogleStrategy = require("passport-google-oauth2").Strategy;

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const session = require("express-session");

app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
	})
);

app.use(passport.initialize()); // init passport on every route call
app.use(passport.session()); //allow passport to use "express-session"

const authUser = (
	request: any,
	accessToken: any,
	refreshToken: any,
	profile: any,
	done: any
) => {
	console.log("login =>", profile);

	return done(null, profile);
};

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:3000/auth/callback",
		},
		authUser
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser(
	(user: false | Express.User | null | undefined, done) => {
		done(null, user);
	}
);

app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
	"/auth/callback",
	passport.authenticate("google", {
		successRedirect: "/dashboard",
		failureRedirect: "/login",
	})
);

// Define the Login Route
app.get("/login", (req, res) => {
	res.render("login.ejs");
});

// Use the req.isAuthenticated() function to check if user is Authenticated
const checkAuthenticated = (req: any, res: any, next: any) => {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect("/login");
};

// Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
app.get("/dashboard", checkAuthenticated, (req: any, res) => {
	res.render("dashboard.ejs", { name: req.user.displayName });
});

//Define the Logout
app.post("/logout", (req: any, res, next) => {
	req.logout((err: any) => {
		if (err) {
			return next(err);
		}
		res.redirect("/login");
		console.log(`-------> User Logged out`);
	});
});

app.get("/", (req: Request, res: Response) => {
	res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
	console.log(`Server is Fire at http://localhost:${port}`);
});
