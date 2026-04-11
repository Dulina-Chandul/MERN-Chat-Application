import express from "express";
import { Server } from "socket.io";
import http from "http";
import { CLIENT_URL } from "../constants/env";
import { socketAuthMiddleware } from "../middleware/socket-io/socket.auth.middleware";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);
