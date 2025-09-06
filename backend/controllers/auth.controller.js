import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { token } from "morgan";

dotenv.config();

const generateAuthToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const setcookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 3600000, // 1 hour
  });
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    const accessToken = generateAuthToken(newUser._id);
    setcookie(res, accessToken);

    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      message: "User created successfully",
      token: accessToken,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (user && (await user.comparePassword(password))) {
      const accessToken = generateAuthToken(user._id);
      setcookie(res, accessToken);
      res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        message: "Login successful",
        token: accessToken,
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
