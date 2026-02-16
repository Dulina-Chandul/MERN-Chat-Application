import bcrypt from "bcryptjs";

import { generateToken } from "../../utils/jwt.js";
import User from "../../models/user/User.model.js";

export const authController = {
  signUp: async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email" });
      }

      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });

      if (newUser) {
        const savedUser = await newUser.save();
        generateToken(savedUser._id, res);
        return res.status(201).json({
          message: "User created successfully",
          user: {
            id: newUser._id,
            fullname: newUser.fullName,
            email: newUser.email,
            profilePicture: newUser.profilePicture,
          },
        });
      } else {
        return res.status(500).json({ message: "Error while creating user" });
      }
    } catch (error) {
      console.log("Error while signing up: " + error.message);
      return res
        .status(500)
        .json({ message: "Error while signing up " + error.message });
    }
  },
};
