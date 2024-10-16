
import jwt from "jsonwebtoken";
import { UserSchema, JournalEntry } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
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
    console.log("exist is ", existingClerk);
    if (existingClerk) {
      return res.status(400).json({ msg: "User Already Exists" });
    }
    console.log(existingClerk);
    console.log("The values", name, email, password, mobile);

    // Convert mobile number to string before saving (backend)
    const mobileAsString = mobile.toString();

    // Hash the password using bcrypt
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user instance
    const newUser = new UserSchema({
      name,
      email,
      mobile: mobileAsString,
      password: hashedPassword, // Use hashedPassword
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
console.log("THe values are",userId,content,multimedia)
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

const getEntryOnDate = async (req, res) => {
  try {
    // Access date and userId from query parameters (adjusted based on assumption)
    const { date, userId } = req.query;

    if (!date || !userId) {
      return res
        .status(400)
        .json({ error: "Missing required parameters: date and userId" });
    }

    // Format date for MongoDB query if necessary (adapt if date format is already compatible)
    const formattedDate = new Date(date); // Assuming date is sent in YYYY-MM-DD format

    // Assuming date is stored in ISO 8601 format in the database
    const startDate = new Date(formattedDate.toISOString().split("T")[0]);
    const endDate = new Date(
      formattedDate.toISOString().split("T")[0] + "T23:59:59.999Z"
    );

    const entries = await JournalEntry.find({
      userId,
      date: { $gte: startDate, $lte: endDate }, // Use date range for precise matching
    });

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Error fetching entries" });
  }
};
export { CreateUser, addJournalEntry, getEntryOnDate };