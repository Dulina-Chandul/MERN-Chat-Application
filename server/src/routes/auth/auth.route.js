import express from "express";
import { authController } from "../../controllers/auth/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", authController.signUpHandler);

authRouter.post("/login", authController.loginHandler);

authRouter.post("/logout", authController.logoutHandler);

export default authRouter;
