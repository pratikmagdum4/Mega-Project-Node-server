import express from "express"
import { UserLogin } from "../controllers/LoginController.js";

const router  = express.Router();

router.post("/login", UserLogin);

export default router;