import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import routes from "./router/local.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./router/auth.route.js";
import qaRoutes from "./router/q-a.route.js";
import bodyParser from "body-parser";
import routesActivities from "./router/activities.route.js";
import chatRoutes from "./router/chatbot.route.js";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// API Routes - bunlar önce gelsin
app.use("/api/locations", routes);
app.use("/api/auth", authRoutes);
app.use("/api/q-a", qaRoutes);
app.use("/api/activities", routesActivities);
app.use("/api/chat", chatRoutes);

// Production için static files ve frontend routing
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "frontend/dist");
  const indexPath = path.join(__dirname, "frontend/dist/index.html");

  // Debug için
  console.log("Static path:", staticPath);
  console.log("Index path:", indexPath);
  console.log("Index exists:", fs.existsSync(indexPath));

  // Static dosyaları serve et
  app.use(express.static(staticPath));

  // Tüm non-API route'ları React'a yönlendir
  app.get("*", (req, res) => {
    console.log("Serving index.html for:", req.path);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        res.status(500).json({ message: "Error serving frontend" });
      }
    });
  });
} else {
  // Development modunda 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found - Development mode" });
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV}`);
});
