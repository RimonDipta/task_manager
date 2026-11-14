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

import connectDB from "./config/db.js";
import { startScheduler } from "./utils/scheduler.js";
import app from "./app.js";

connectDB();
startScheduler();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
