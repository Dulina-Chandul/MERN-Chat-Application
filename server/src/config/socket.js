import express from "express";
import { Server } from "socket.io";
import http from "http";
import { CLIENT_URL } from "../constants/env.js";
import { socketAuthMiddleware } from "../middleware/socket-io/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//* For storing the online users
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  console.log("Authenticated user:", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    console.log("Disconnected user:", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { server, io, app };
