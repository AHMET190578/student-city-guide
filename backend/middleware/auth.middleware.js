import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js"; // varsa

dotenv.config();

export const protect = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tüm kullanıcıyı req.user içine yükle
    req.user = await User.findById(decoded.id).select("-password"); // Şifre hariç

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
