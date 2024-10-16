import express from "express";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import cors from "cors"; // Import cors
import connectToDB from "./DB/connectToDB.js";
import dotenv from "dotenv";
dotenv.config();

import Signup from "./routes/UserRoutes.js";
import Login from "./routes/LoginRoute.js";

const PORT = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", Signup);
app.use("/login", Login);
app.get("/journal", (req, res) => {
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
