import express from "express";
import { signin, signup } from "../controllers/auth.controller.js";

const router = express.Router();

//Sign up route
router.post("/signup", signup);
//Sign in route
router.post("/signin", signin);
//Sign out route

export default router;
