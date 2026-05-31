import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../constants/env.js";
import User from "../../models/user/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      .split("=")[1];

    if (!token) {
      console.log("No token found in socket handshake");
      return next(new Error("Unauthorized - No token found"));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      console.log("Invalid token in socket handshake");
      return next(new Error("Unauthorized - Invalid token"));
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("User not found for token in socket handshake");
      return next(new Error("Unauthorized - User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(
      `Socket authenticated for user: ${user.fullName} (${user.email})`,
    );

    next();
  } catch (error) {
    console.error("Error in socket authentication middleware:", error);
    next(new Error("Unauthorized - Socket authentication failed"));
  }
};
