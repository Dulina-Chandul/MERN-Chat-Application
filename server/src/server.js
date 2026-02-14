import express from "express";
import authRouter from "./routes/auth/auth.route.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
