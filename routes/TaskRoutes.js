import express from "express";
import { GetallTasks, AddTask } from "../controllers/TaskController.js";

const router = express.Router();

router.post("/add", AddTask);
router.get("/:id", GetallTasks);

export default router;
