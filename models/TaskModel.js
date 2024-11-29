import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  originalTask: { type: String, required: true },
  extractedDescription: { type: String, required: true },
  extractedTime: { type: String },
  dateTime: { type: Date, required: true },
  reminderTime: { type: Date, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const UserTasks = mongoose.model("Task", taskSchema);

export { UserTasks};
