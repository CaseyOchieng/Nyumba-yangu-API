import express from "express";
import {
  Google,
  Signin,
  Signout,
  Signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

//Sign up route.
router.post("/signup", Signup);
//Sign in route.
router.post("/signin", Signin);
// google signin route.
router.post("/google", Google);
//Sign out route.
router.post("/signout", Signout);

export default router;
