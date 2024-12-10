// import express from "express";
// import { GetAllTasks, AddTask } from "../controllers/TaskController.js";

// const router = express.Router();

// router.post("/add", AddTask);
// router.get("/:id", GetAllTasks);

// export default router;
import express from 'express';
// import Task from '../models/Task'; // Assuming Task is a model or class
import { UserTasks } from "../models/TaskModel.js";

const router = express.Router();

// Add Task Router
router.post('/add', async (req, res) => {
  try {
    // Destructuring with default values for optional properties
    const {
      originalTask = '',
      extractedDescription = '',
      dateTime = null,
      reminderTime = null,
      userID,
      email,
    } = req.body;

    // Create a new Task instance with validation (optional)
    const newTask = new UserTasks({
      userID,
      email,
      originalTask,
      extractedDescription,
      dateTime,
      reminderTime,
    });

    const savedTask = await newTask.save(); // Await the save operation
    res.status(201).json(savedTask); // Send created task with status 201
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Error adding task' });
  }
});

// Get User Tasks Router
router.get('/:userId', async (req, res) => {
  try {
    // console.log("the id is ",)
    const tasks = await UserTasks.find({ userID: req.params.userId });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

export default router;