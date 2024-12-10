import { UserTasks } from "../models/TaskModel.js";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

class EmailService {
  constructor() {
    // console.log('Email:', process.env.EMAIL);
    // console.log('Password:', process.env.EMAIL_PASSWORD);

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendTaskReminder(to, task) {
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: 'Task Reminder',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Task Reminder</h2>
            <p><strong>Task:</strong> ${task.extractedDescription}</p>
            <p><strong>Original Description:</strong> ${task.originalTask}</p>
            <p><strong>Scheduled For:</strong> ${new Date(task.dateTime).toLocaleString()}</p>
            <br>
            <p>Don't forget to complete your task!</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}

export default new EmailService();

