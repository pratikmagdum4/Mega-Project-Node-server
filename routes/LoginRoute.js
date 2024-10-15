import express from "express"
import { UserLogin } from "../controllers/LoginController.js";

const router  = express.Router();

router.post("/", UserLogin);

export default router;