import { Router } from "express";

import passport from "passport";

import { isAuthenticated, sessionMiddleware } from "../middleware/index.js";

import home from "./home.js";
import auth from "./auth.js";
import dashboard from "./dashboard.js";

const router = Router();

router.use(sessionMiddleware);

router.use(passport.initialize()); // init passport on every route call
router.use(passport.authenticate("session"));

router.use(home);
router.use(auth);

//Is Authenticated middleware
router.use(isAuthenticated);

router.use(dashboard);

export default router;
