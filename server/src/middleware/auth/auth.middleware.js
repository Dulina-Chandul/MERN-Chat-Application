import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../../constants/env.js";
import User from "../../models/user/User.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token found" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    console.error("Error in authentication middleware:", error.message);

    return res
      .status(401)
      .json({ message: "Error in authentication middleware" });
  }
};
