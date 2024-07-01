const express = require("express");
const path = require("path");

const dotenv = require("dotenv");
const passport = require("passport");
const OpenIDConnectStrategy = require("passport-openidconnect");
const session = require("express-session");

//For env File
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
	session({
		name: process.env.COOKIE_SESSION_NAME,
		secret: process.env.COOKIE_SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.use(passport.initialize()); // init passport on every route call
app.use(passport.session());

passport.use(
	new OpenIDConnectStrategy(
		{
			issuer: process.env.ISSUER,
			authorizationURL: process.env.AUTH_ISSUER,
			tokenURL: process.env.TOKEN_ISSUER,
			callbackURL: process.env.CALLBACK_OIDC,
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
		},
		function verify(issuer, profile, cb) {
			return cb(null, {
				name: "this is me",
			});
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

// Use the req.isAuthenticated() function to check if user is Authenticated
const checkAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};

// Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
app.get("/dashboard", checkAuthenticated, (req, res) => {
	console.log("===user===", req.user);
	res.render("dashboard.ejs", { name: req.user.displayName });
});

//Define the Logout
app.post("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/login");
		console.log(`-------> User Logged out`);
	});
});

app.get("/login", passport.authenticate("openidconnect"));

app.get(
	"/auth/callback",
	passport.authenticate("openidconnect", {
		failureRedirect: "/login",
		failureMessage: true,
	}),
	function (req, res) {
		res.redirect("/dashboard");
	}
);

app.get("/", (req, res) => {
	res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
	console.log(`Server is Fire at http://localhost:${port}`);
});
