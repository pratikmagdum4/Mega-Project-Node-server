import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  mobile: { type: String, default: "" },
  email: { type: String, default: "" },
  password: { type: String, default: "" },
});

const UserSchema = mongoose.model(
    "UserModel",
    userSchema
)

const JournalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Default to the current date
  },
  multimedia: {
    type: String, // URL or path to multimedia file (optional)
  },
});

const JournalEntry = mongoose.model("JournalEntry", JournalEntrySchema);


export { JournalEntry, UserSchema };