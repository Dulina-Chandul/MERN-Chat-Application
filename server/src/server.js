import express from "express";
import path from "path";

import authRouter from "./routes/auth/auth.route.js";
import connectDB from "./config/connectDB.js";
import { PORT } from "./constants/env.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(express.json());

app.use("/api/auth", authRouter);

//* Make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});
