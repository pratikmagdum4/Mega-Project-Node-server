
import jwt from "jsonwebtoken";
import { UserSchema, JournalEntry,  } from "../models/UserModel.js";
import { DayEntry } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
const CreateUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  // Validate input data (optional)
  if (!name || !email || !password || !mobile) {
    return res.status(400).json({ msg: "Please fill in all fields" });
  }

  try {
    // Check for existing user
    const existingClerk = await UserSchema.findOne({ email });
    if (existingClerk) {
      return res.status(400).json({ msg: "User Already Exists" });
    }
    console.log(existingClerk);

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
  // console.log("hi id is", id);

  try {
    let entries;

    if (id) {
     
      entries = await JournalEntry.find({ userId: id }); 

      if (!entries || entries.length === 0) {
        return res
          .status(404)
          .json({ message: "No entries found for this user" });
      }
    } else {
     
      entries = await JournalEntry.find();
    }

   
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
    // You can attach a question here if needed (example question)
    const question = "Can you provide insights based on this journal entry?";

    // Prepare the data to send to Google API
    const dataToSend = {
      question,
      entries: formattedEntries,
    };

    // For now, log the data to send
    // console.log("Data to send to Google API", dataToSend);
    // console.log("The formatted", formattedEntries);
    // Respond with the formatted entries
    res.status(200).json(formattedEntries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ message: "Error fetching entries", error });
  }
};

const deleteEntryAndUpdateDayEntry = async (req, res) => {
  try {
    const { entryId, userId, date } = req.params;
console.log("In the delete ")
console.log("The entryId are", entryId);
console.log("The userId are", userId);
console.log("The date are", date);
    // Find and delete the individual entry
    const deletedEntry = await JournalEntry.findByIdAndDelete(entryId);
    console.log("The deleted is",deletedEntry)
    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    
    // Fetch the DayEntry for the specific date
    const dayEntry = await DayEntry.findOne({ userId, Date: date });
    if (!dayEntry) {
      return res.status(500).json({ message: "Day entry not found" });
    }

    // Remove the deleted entry's content from the CombinedEntry
    const updatedContent = dayEntry.CombinedEntry.split("\n\n")
      .filter((entry) => entry !== deletedEntry.content) // Remove the deleted entry content
      .join("\n\n");

    // Optionally, recalculate mood and moodScore
    const { mood, moodScore } = calculateMoodAndScore(updatedContent);

    // Update the CombinedEntry field of the DayEntry
    dayEntry.CombinedEntry = updatedContent;
    dayEntry.mood = mood;
    dayEntry.moodScore = moodScore;
    await dayEntry.save();

    res
      .status(200)
      .json({ message: "Entry deleted and Day entry updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting entry and updating day entry", error });
  }
};


const updateEntry = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
// console.log("The id is ",id)
// console.log("The content ",content)
  if (!id) {
    return res.status(400).json({ message: "Missing entry ID." });
  }

  try {
    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found." });
    }

    res
      .status(200)
      .json({ message: "Entry updated successfully.", entry: updatedEntry });
  } catch (error) {
    console.error("Error updating entry:", error);
    res.status(500).json({ message: "Error updating entry." });
  }
};
const getAllEntriesGroupedByDate = async (req, res) => {
  const { id } = req.params;

  try {
    let entries;

    if (id) {
      entries = await JournalEntry.find({ userId: id });
      if (!entries || entries.length === 0) {
        return res
          .status(404)
          .json({ message: "No entries found for this user" });
      }
    } else {
      entries = await JournalEntry.find();
    }

    // Format and group entries by date
    const groupedEntries = entries.reduce((acc, entry) => {
      const date = entry.date.toISOString().split("T")[0]; // Extract YYYY-MM-DD format

      if (!acc[date]) {
        acc[date] = entry.content;
      } else {
        acc[date] += `\n\n${entry.content}`; // Concatenate content with newline separation
      }
      return acc;
    }, {});

    // Convert grouped entries into an array format if desired, or keep as object
    const formattedEntries = Object.keys(groupedEntries).map((date) => ({
      date,
      content: groupedEntries[date],
    }));

    res.status(200).json(formattedEntries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ message: "Error fetching entries", error });
  }
};

export {
  CreateUser,
  addJournalEntry,
  getEntryOnDate,
  getAllEntries,
  deleteEntryAndUpdateDayEntry,
  updateEntry,
  getAllEntriesGroupedByDate,
};