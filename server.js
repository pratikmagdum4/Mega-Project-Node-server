import express from "express";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import cors from "cors"; // Import cors
import connectToDB from "./DB/connectToDB.js";
import dotenv from "dotenv";
dotenv.config();

import Signup from "./routes/UserRoutes.js";
import Login from "./routes/LoginRoute.js";
import Tasks from "./routes/TaskRoutes.js"
import Goals from "./routes/GoalRoutes.js"
import DayEntry from "./routes/DayEntriesRoutes.js";

const PORT = process.env.PORT || 5000;
const app = express();

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Localhost during development
  "https://ai-journal-black.vercel.app", // Production frontend
];

// Apply the CORS middleware with the allowedOrigins array
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowedOrigins array
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }

      // Allow the request if the origin is allowed
      return callback(null, true);
    },
  })
);

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Route definitions
app.use("/api", Signup);
app.use("/api", Login);
app.use("/api/journal", Signup);
app.use("/api/tasks", Tasks);
app.use("/user", Goals);
app.use("/api/journal/day", DayEntry);

// Start the server and connect to the database
app.listen(PORT, () => {
  connectToDB()
    .then(() => {
      console.log(chalk.blueBright(`Server Running on port ${PORT}`));
    })
    .catch((error) => {
      console.error(chalk.red("Failed to connect to MongoDB:", error.message));
      process.exit(1);
    });
});

export default app;


