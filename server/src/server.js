import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth/auth.route.js";
import connectDB from "./config/connectDB.js";
import { CLIENT_URL, PORT } from "./constants/env.js";

import messageRouter from "./routes/message/message.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

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
