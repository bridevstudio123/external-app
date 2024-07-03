import dotenv from "dotenv";

import passport from "passport";
import OpenIDConnectStrategy from "passport-openidconnect";

dotenv.config();

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
				name: "parent",
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

export { passport };
