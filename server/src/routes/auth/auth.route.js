import express from "express";
import { authController } from "../../controllers/auth/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", authController.signUp);

authRouter.get("/login", (req, res) => {
  res.send("Login route");
});

authRouter.get("/logout", (req, res) => {
  res.send("Logout route");
});

export default authRouter;
