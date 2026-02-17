import express from "express";
import { authController } from "../../controllers/auth/auth.controller.js";
import { authenticate } from "../../middleware/auth/auth.middleware.js";

const authRouter = express.Router();

//* Register a new user
authRouter.post("/signup", authController.signUpHandler);

//* Login user
authRouter.post("/login", authController.loginHandler);

//* Logout user
authRouter.post("/logout", authController.logoutHandler);

//* Update user profile
authRouter.put(
  "/update-profile",
  authenticate,
  authController.updateProfileHandler,
);

//* Check if user is authenticated
authRouter.get("/check", authenticate, authController.checkHandler);

export default authRouter;
