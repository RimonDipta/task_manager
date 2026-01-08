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
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { startScheduler } from "./utils/scheduler.js";

connectDB();
startScheduler();

const app = express();

const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// Production static serve
if (process.env.NODE_ENV === "production") {
  import("path").then(({ default: path }) => {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "/client/dist")));

    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    );
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
