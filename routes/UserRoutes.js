import express from "express";
import { CreateUser } from "../controllers/CreateUserController.js";
const router = express.Router();


router.post("/", CreateUser);

export default router;