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

app.use(session({
    secret: "secret",
    // resave: false ,
    saveUninitialized: true ,
}))

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
