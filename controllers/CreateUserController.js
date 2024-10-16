
import jwt from "jsonwebtoken";
import { UserSchema, JournalEntry } from "../models/UserModel.js";

const CreateUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  // Validate input data (optional)
  if (!name || !email || !password || !mobile) {
    return res.status(400).json({ msg: "Please fill in all fields" });
  }
  console.log("The values 1", name, email, password, mobile);


  try {
    // Check for existing user
    const existingClerk = await UserSchema.findOne({ email });
    console.log("exist is ",existingClerk);
    if (existingClerk) {
      return res.status(400).json({ msg: "User Already Exists" });
    }
    console.log(existingClerk)
console.log("The values",name,email,password,mobile)
    // Convert mobile number to string before saving (backend)
    const mobileAsString = mobile.toString();

    // Create new user instance
    const newUser = new UserSchema({
      name,
      email,
      mobile: mobileAsString, // Use converted mobile number
      password,
    });

    // Save the new user and handle success/error
    await newUser.save();

    // Generate and assign JWT token
    const token = jwt.sign(
      { id: newUser._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      role: "user",
      token,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};
const addJournalEntry = async (req, res) => {
  const { userId, content, multimedia } = req.body;

  // Validate required fields
  if (!userId || !content) {
    return res
      .status(400)
      .json({ message: "User ID and content are required." });
  }

  try {
    // Create a new journal entry
    const newEntry = new JournalEntry({
      userId,
      content,
      multimedia: multimedia || null, // Optional multimedia
    });

    // Save the entry to MongoDB
    await newEntry.save();

    return res.status(201).json({
      message: "Journal entry added successfully!",
      entry: newEntry,
    });
  } catch (error) {
    console.error("Error adding journal entry:", error);
    return res
      .status(500)
      .json({ message: "Error adding journal entry.", error });
  }
};

export { CreateUser, addJournalEntry };