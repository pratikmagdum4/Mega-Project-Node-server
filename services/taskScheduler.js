import dotenv from "dotenv";
import { UserTasks } from "../models/TaskModel.js";
import EmailService from './emailService.js';
import nodemailer from 'nodemailer'
dotenv.config();

class TaskScheduler {
  constructor() {
    this.tasks = [];  // Store scheduled tasks
    this.initScheduler();
  }

  initScheduler() {
    this.scheduleTasks();
  }

  async scheduleTasks() {
    try {
      const pendingTasks = await UserTasks.find({
        isNotificationSent: false,
        status: 'pending',
      });

      // Loop over tasks and schedule reminders based on reminderTime
      pendingTasks.forEach((task) => {
        const reminderTime = new Date(task.reminderTime);

        // console.log("The task is  ",task)
        // console.log("The remainder time from frontend is ",task.reminderTime)
        // console.log("The remainder time is ",reminderTime)
        const delay = reminderTime.getTime() - Date.now();
        // console.log("The delay is ",delay)
        if (delay > 0) {
          // Schedule task for the exact reminder time
          setTimeout(async () => {
            const emailSent = await EmailService.sendTaskReminder(task.email, task);
            if (emailSent) {
              // Mark notification as sent
              task.isNotificationSent = true;
              await task.save();
            }
          }, delay);
        }
        //  else {
        //   console.log(`Reminder time for task already passed: ${task._id}`);
        // }
      });
    } catch (error) {
      console.error('Error scheduling tasks:', error);
    }
  }
}

const taskSchedulerInstance = new TaskScheduler(); // Singleton
export default taskSchedulerInstance;