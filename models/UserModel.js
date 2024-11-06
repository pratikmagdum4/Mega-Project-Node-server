import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  mobile: { type: String, default: "", unique: true },
  email: { type: String, default: "", unique: true },
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
  mood: {
    type: String, // URL or path to multimedia file (optional)
  },
  moodScore: {
    type: String, // URL or path to multimedia file (optional)
  },
});
const DayEntrySchema = new mongoose.Schema({
  CombinedEntry: { type: String, default: "" },
  Date: { type: String, default: "",  },
  userId: { type: String, default: "",  },
  mood: { type: String, default: "" },
  moodScore: { type: String, default: "" },
});
const DayEntry = mongoose.model("DayEntry", DayEntrySchema);
const JournalEntry = mongoose.model("JournalEntry", JournalEntrySchema);


export { JournalEntry, UserSchema, DayEntry };