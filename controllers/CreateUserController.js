
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
    const { date, userId } = req.query;
// console.log("The date is",date)
    if (!date || !userId) {
      return res.status(400).json({ error: "Missing required parameters: date and userId" });
    }

    // Parse the date and set time to start and end of the day (in UTC)
    const formattedDate = new Date(date); // Assuming 'date' is sent as 'YYYY-MM-DD'
// console.log("date",formattedDate )
    // Start of the day in UTC
    const startDate = new Date(formattedDate.setUTCHours(0, 0, 0, 0));
    // End of the day in UTC
    const endDate = new Date(formattedDate.setUTCHours(23, 59, 59, 999));

    // Query the database for entries within this day range
    const entries = await JournalEntry.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Error fetching entries" });
  }
};const getAllEntries = async (req, res) => {
  const { id } = req.params;
  console.log("hi id is", id);

  try {
    let entries;

    if (id) {
      // Fetch entries by userId, the filter must be an object
      entries = await JournalEntry.find({ userId: id }); // Correct filter format: { userId: id }
      console.log("The entries by userId", entries);

      if (!entries || entries.length === 0) {
        return res
          .status(404)
          .json({ message: "No entries found for this user" });
      }
    } else {
      // Fetch all journal entries
      entries = await JournalEntry.find();
    }

    // Extract content and date from the entries
    let formattedEntries;

    if (Array.isArray(entries)) {
      formattedEntries = entries.map((entry) => ({
        content: entry.content,
        date: entry.date,
      }));
    } else {
      formattedEntries = {
        content: entries.content,
        date: entries.date,
      };
    }
console.log("The formated",formattedEntries)
    // You can attach a question here if needed (example question)
    const question = "Can you provide insights based on this journal entry?";

    // Prepare the data to send to Google API
    const dataToSend = {
      question,
      entries: formattedEntries,
    };

    // For now, log the data to send
    console.log("Data to send to Google API", dataToSend);

    // Respond with the formatted entries
    res.status(200).json(formattedEntries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ message: "Error fetching entries", error });
  }
};



export { CreateUser, addJournalEntry, getEntryOnDate,getAllEntries };