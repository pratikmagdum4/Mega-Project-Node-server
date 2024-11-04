import express from "express";
import { UserTasks } from "../models/TaskModel.js";

const AddTask = async (req, res) => {

  try {
    const data = req.body;
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
  } catch (error) {
    console.log("error ",error);
    res.status(500).json({message:"Error adding task",error:error});
  }
};

const GetallTasks = async (req, res) => {
  const {id} = req.params;
  try {
    const tasks = await UserTasks.find({ userID: id }).sort({
      dateTime: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};

export { GetallTasks, AddTask };
