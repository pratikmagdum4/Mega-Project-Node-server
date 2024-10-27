import express from "express";
import { UserTasks } from "../models/TaskModel.js";

const AddTask = async (req, res) => {
  const data = req.body;
  console.log("data from frontend ",data);
  const {
    originalTask,
    extractedDescription,
    extractedTime,
    dateTime,
    userID,
  } = req.body;
  const newTask = new UserTasks({
    originalTask,
    extractedDescription,
    extractedTime,
    dateTime,
    userID,
  });

  await newTask.save();
  res.status(201).json({ message: "Task added successfully", task: newTask });
};

const GetallTasks = async (req, res) => {
  console.log("inside task get")
  try {
    const tasks = await UserTasks.find({ userID: req.params.userID }).sort({
      dateTime: -1,
    });
    console.log("the tasks list is ",tasks)
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};

export { GetallTasks, AddTask };
