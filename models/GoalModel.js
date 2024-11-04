import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  goalDescription: { type: String, required: true },
  goalCategory: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questions: [{ type: String }],
});

const Goals = mongoose.model("Goals",goalSchema);

export {Goals};