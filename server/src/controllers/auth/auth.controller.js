import bcrypt from "bcryptjs";

import User from "../../models/user/User.model.js";

import { generateToken } from "../../utils/jwt.js";
import { sendWelcomeEmail } from "../../utils/emailHandlers.js";
import { CLIENT_URL } from "../../constants/env.js";

export const authController = {
  signUpHandler: async (req, res) => {
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
        res.status(201).json({
          message: "User created successfully",
          user: {
            id: newUser._id,
            fullname: newUser.fullName,
            email: newUser.email,
            profilePicture: newUser.profilePicture,
          },
        });

        try {
          await sendWelcomeEmail(
            savedUser.email,
            savedUser.fullName,
            CLIENT_URL,
          );
        } catch (error) {
          console.log("Error while sending welcome email: " + error.message);
        }
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

  loginHandler: async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      generateToken(user._id, res);

      return res.status(200).json({
        message: "Login Successful",
        user: {
          id: user._id,
          fullname: user.fullName,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      console.log("Error while logging in: " + error.message);
      return res
        .status(500)
        .json({ message: "Error while logging in " + error.message });
    }
  },

  logoutHandler: async (_, res) => {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout successful" });
  },

  updateProfileHandler: async (req, res) => {
    try {
      const { profilePic } = req.body;

      if (!profilePic) {
        return res.status(400).json({ message: "Profile picture is required" });
      }

      const userId = req.user._id;

      const uploadedProfilePic = await cloudinary.uploader.upload(profilePic);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: uploadedProfilePic.secure_url },
        { new: true },
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          fullname: updatedUser.fullName,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture,
        },
      });
    } catch (error) {
      console.log("Error while updating profile: " + error.message);
      return res
        .status(500)
        .json({ message: "Error while updating profile " + error.message });
    }
  },

  checkHandler: async (req, res) => {
    return res.status(200).json({
      message: "User is authenticated",
      user: req.user,
    });
  },
};
