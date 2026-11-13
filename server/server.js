import dotenv from "dotenv";
dotenv.config();

// Set environment variables based on mode
if (process.env.NODE_ENV === "production") {
  process.env.CLIENT_URL = process.env.CLIENT_URL_PROD || process.env.CLIENT_URL;
  process.env.API_URL = process.env.API_URL_PROD || process.env.API_URL;
} else {
  process.env.CLIENT_URL = process.env.CLIENT_URL_DEV;
  process.env.API_URL = process.env.API_URL_DEV;
}

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Client URL: ${process.env.CLIENT_URL}`);
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { startScheduler } from "./utils/scheduler.js";

connectDB();
startScheduler();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Rate limit auth endpoints to slow down credential-stuffing / brute force
// and OTP-guessing attacks against login, registration and OTP verification.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// 404 handler for unmatched API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Production static serve — serves the client's built files when both run
// as a single service (e.g. one Render/Railway web service).
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "client", "dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
  );
}

// Centralized error handler — keeps stack traces out of responses in
// production and gives every route a consistent JSON error shape, even
// when a controller forgets its own try/catch.
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
