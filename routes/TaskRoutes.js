import express from "express";
import { GetAllTasks, AddTask } from "../controllers/TaskController.js";

const router = express.Router();

router.post("/add", AddTask);
router.get("/:id", GetAllTasks);

export default router;
