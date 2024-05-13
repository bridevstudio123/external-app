import passport from 'passport';
import express, { Express, Request, Response , Application, NextFunction } from 'express';
import dotenv from 'dotenv';
import OAuth2Strategy from 'passport-oauth2';
import { Mutex } from "async-mutex";

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const session = require("express-session");

app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))

app.use(passport.initialize()) // init passport on every route call
app.use(passport.session())    //allow passport to use "express-session"

const GOOGLE_CLIENT_ID =
  "66825498991-fcjmh52r8b2ajhoj67ii7u2hvqqmvpn8.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const GoogleStrategy = require("passport-google-oauth2").Strategy;

const authUser = (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
  console.log("profile", profile);
  return done(null, profile);
};

// Use "GoogleStrategy" as the Authentication Strategy
passport.use(
  new OAuth2Strategy(
    {
      clientID: "portal",
      clientSecret: "Aithoo1Yu7Poohu8phohqu2xih2vi1ei",
      tokenURL: "https://sso.bridev.qore.run/token",
      authorizationURL: "https://sso.bridev.qore.run/auth",
      callbackURL: "https://external-app-six.vercel.app/auth/callback",
      sessionKey: '_bridev'
    },
    authUser
  )
  // new GoogleStrategy(
  //   {
  //     clientID: GOOGLE_CLIENT_ID,
  //     clientSecret: GOOGLE_CLIENT_SECRET,
  //     callbackURL: "http://localhost:3000/auth/google/callback",
  //     passReqToCallback: true,
  //   },
  //   authUser
  // )
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
// const mutex = new Mutex();

let count = 1;
const showlogs = (req: any, res: any, next: NextFunction) => {
  console.log("\n==============================");
  console.log(`------------>  ${count++}`);

  console.log(`\n req.session.passport -------> `);
  console.log(req?.session);

  console.log(`\n req.user -------> `);
  console.log(req);

  console.log("\n Session and Cookie");
  console.log(`req.session.id -------> ${req.session.id}`);
  console.log(`req.session.cookie -------> `);
  console.log(req.session.cookie);

  console.log("===========================================\n");

  next();
};

app.use(showlogs);

app.get(
  "/auth/google",
  // passport.authenticate("google", { scope: ["email", "profile"] })
  passport.authenticate("oauth2", { scope: ["email", "profile", "openid"] })
);

app.get(
  "/auth/callback",
  passport.authenticate("oauth2", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

// Define the Login Route
app.get("/login", (req, res) => {
  // res.send("login");
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
  console.log('===user===',req)
  // res.send(`user: ${JSON.stringify({ name: req.user.displayName })}`);
  res.render("dashboard.ejs", { name: req.user.displayName });
});

//Define the Logout
app.post("/logout", (req: any, res) => {
  req.logOut();
  res.redirect("/login");
  console.log(`-------> User Logged out`);
});


app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

// app.get("/mutex", async (req: Request, res: Response) => {
//   const release = await mutex.acquire();
//   if (count === 1) {
//     try {
//       // Critical section of code
//       // Perform operations that may cause race conditions here
//       // This section will be executed serially
//       console.log("Mutex acquired, executing critical section");
//       // Simulate asynchronous operation
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Critical section executed");
//     } finally {
//       // Release the mutex lock
//       release();
//     }
//     count++
//     res.send("Welcome to Express & TypeScript Server");
//     return
//   }
//   res.status(400).json({ status: "error", message: 'lebih dari 1' });
// });

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
