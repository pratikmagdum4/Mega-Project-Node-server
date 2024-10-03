import express from "express";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import cors from "cors"; // Import cors
import connectToDB from "./DB/connectToDB.js";
import dotenv from "dotenv";
dotenv.config();

import UserRouter from "./routes/UserRoutes.js";

const PORT = process.env.PORT || 5000;
const app = express();

// CORS setup to allow requests from frontend React app
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Replace with the React app's URL if different
//     credentials: true, // Enable credentials if needed (for cookies, etc.)
//   })
// );
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/signup", UserRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Project server" });
});

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
