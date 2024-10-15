import express from "express";
import { CreateUser } from "../controllers/CreateUserController.js";
const router = express.Router();


router.post("/signup", CreateUser);
router.post("/login")
export default router;