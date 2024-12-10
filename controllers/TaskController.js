import express from "express";
import schedule from "node-schedule";
import nodemailer from "nodemailer";
import { UserTasks } from "../models/TaskModel.js";

import dotenv from "dotenv";
import { UserSchema } from "../models/UserModel.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});



const AddTask = async (req, res) => {
  try {
    const {
      originalTask,
      extractedDescription,
      extractedTime,
      dateTime,
      userID,
      reminderTime,
    } = req.body;

    // Calculate `reminderTime` (default 30 minutes before `dateTime`)
    // const reminderTime = new Date(new Date(dateTime).getTime());
    console.log("remainder time is", reminderTime);
const extractDate = (extractedTime) => {
  let parsedDate = new Date(extractedTime); // Attempt to parse the extracted date

  if (isNaN(parsedDate.getTime())) {
    // Handle relative dates like "today" manually
    const today = new Date();
    if (extractedTime.toLowerCase().includes("today")) {
      parsedDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parsedDate.getHours(),
        parsedDate.getMinutes()
      );
    } else if (extractedTime.toLowerCase().includes("tomorrow")) {
      parsedDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
        parsedDate.getHours(),
        parsedDate.getMinutes()
      );
    }
  }

  return parsedDate.toISOString(); // Ensure proper format
};
const user = await UserSchema.findById({ _id: userID });
const email = user.email;
    const newTask = new UserTasks({
      originalTask,
      extractedDescription,
      extractedTime: extractDate(extractedTime), // Use the function here
      dateTime: extractDate(extractedTime), // Same for `dateTime`
      reminderTime, // Reminder logic remains
      userID,
    });


    // Save task to the database
    await newTask.save();
const scheduledTime = new Date(reminderTime);
console.log("The scheduled time is ",scheduledTime)
    schedule.scheduleJob(scheduledTime, async () => {
      console.log("Scheduled job triggered at:", new Date());

      const mailOptions = {
        from: '"Pratik"  <pratiksunilmagdum2003@gmail.com>', // Sender address
        to: email, // Recipient address
        subject: "Task Reminder",
        text: `Hi, this is a reminder for your task: "${originalTask}". The task is scheduled at ${dateTime}. Please complete it on time!`,
      };
      
      console.log("after schedule");
      try {
        console.log("trying to send ");
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${email}`);
      } catch (err) {
        console.error("Error sending email:", err);
      }
    });

    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Error adding task", error });
  }
};

const GetAllTasks = async (req, res) => {
  const { id } = req.params;
  try {
    const tasks = await UserTasks.find({ userID: id }).sort({ dateTime: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};

export { GetAllTasks, AddTask };
