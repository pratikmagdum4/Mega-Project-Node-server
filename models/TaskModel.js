import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  email: {
      type: String,
      required: true
  },
  originalTask: {
      type: String,
      required: true
  },
  extractedDescription: {
      type: String,
      required: true
  },
  dateTime: {
      type: Date,
      required: true
  },
  reminderTime: {
      type: Date,
      required: true
  },
  status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
  },
  isNotificationSent: {
      type: Boolean,
      default: false
  }
}, { timestamps: true });

const UserTasks = mongoose.model("Task", taskSchema);

export { UserTasks};
