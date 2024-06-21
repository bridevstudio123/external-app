import passport from "passport";
import express, {
  Application,
  Request,
  Response,
} from "express";
import dotenv from "dotenv";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const OpenIDConnectStrategy = require("passport-openidconnect");
const session = require("express-session");

app.use(
  session({
    name: "_bridev",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //   domain: [".bridev.qore.run", "external-app-six.vercel.app"], // Set the domain for the session cookie
    //   secure: true, // Set to true if using HTTPS
    //   httpOnly: true, // Prevent client-side access to the cookie
    //   // sameSite: "none", // Set to 'none' if handling cross-site requests
    // },
  })
);

app.use(passport.initialize()) // init passport on every route call
app.use(passport.session()) 
const clientID = "external-app-1";
const clientSecret = "secret";

passport.use(
  new OpenIDConnectStrategy(
    {
      issuer: "https://sso.bridev.qore.run",
      authorizationURL: "https://sso.bridev.qore.run/auth",
      tokenURL: "https://sso.bridev.qore.run/token",
      // userinfo_endpoint: "https://sso.bridev.qore.run/userinfo",
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "https://external-app-six.vercel.app/callback",
    },
    function verify(
      issuer: any,
      profile: { id: any },
      cb: (arg0: null, arg1: any) => any
    ) {
      return cb(null, {
        name: "Alfa Ruiz",
      });
    }
  )
);


passport.serializeUser((user, done) => {
  console.log(`\n--------> Serialize User:`);
  console.log(user);
  // The USER object is the "authenticated user" from the done() in authUser function.
  // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.

  done(null, user);
});

passport.deserializeUser(
  (user: false | Express.User | null | undefined, done) => {
    console.log("\n--------- Deserialized User:");
    console.log(user);
    // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
    // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.

    done(null, user);
  }
); 

// Use the req.isAuthenticated() function to check if user is Authenticated
const checkAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
app.get("/dashboard", checkAuthenticated, (req: any, res) => {
  console.log('===user===',req)
  res.send(`user: ${JSON.stringify({ name: req.user.displayName })}`);
  // res.render("dashboard.ejs", { name: req.user.displayName });
});

//Define the Logout
app.post("/logout", (req: any, res) => {
  req.logOut();
  res.redirect("/login");
  console.log(`-------> User Logged out`);
});

app.get("/login", passport.authenticate("openidconnect"));

app.get(
  "/callback",
  passport.authenticate("openidconnect", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  function (req, res) {
    console.log(req, `req`)
    res.redirect("/");
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
