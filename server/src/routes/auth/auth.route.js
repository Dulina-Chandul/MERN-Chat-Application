import express from "express";

const authRouter = express.Router();

authRouter.get("/signup", (req, res) => {
  res.send("Signup route");
});

authRouter.get("/login", (req, res) => {
  res.send("Login route");
});

authRouter.get("/logout", (req, res) => {
  res.send("Logout route");
});

export default authRouter;
