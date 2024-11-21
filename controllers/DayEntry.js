// Import DayEntry model
import { DayEntry } from "../models/UserModel.js";

// Add or concatenate a day entry by date
export const addOrUpdateDayEntry = async (req, res) => {
  try {
    const { CombinedEntry, Date, userId, mood, moodScore } = req.body;

    console.log("Received data:", req.body);

    // Ensure date and userId are provided
    if (!Date || !userId) {
      return res.status(400).json({ message: "Date and userId are required" });
    }

    // Find an existing entry for the same date and user
    let existingEntry = await DayEntry.findOne({ Date, userId });
    // console.log("Existing entry:", existingEntry);

    if (existingEntry) {
      // Update the existing entry
      existingEntry.CombinedEntry.content = `${CombinedEntry.content}`;
      // existingEntry.CombinedEntry.timestamp = new Date(); // Update timestamp
      existingEntry.mood = mood; // Update mood
      existingEntry.moodScore = moodScore; // Update mood score
console.log("The new entry i s",existingEntry)
      await existingEntry.save();

      return res.status(200).json({
        message: "Entry updated successfully",
        data: existingEntry,
      });
    }

    // Create a new entry if no existing entry is found
    const newDayEntry = new DayEntry({
      CombinedEntry,
      Date,
      userId,
      mood,
      moodScore,
    });

    await newDayEntry.save();

    res.status(201).json({
      message: "New entry created successfully",
      data: newDayEntry,
    });

  } catch (error) {
    console.error("Error in addOrUpdateDayEntry:", error);
    res
      .status(500)
      .json({ message: "Error adding or updating day entry", error });
  }
};

// Update a day entry by userId and date
export const updateDayEntryByDate = async (req, res) => {
  try {
    const {  userId } = req.params;
    const { CombinedEntry, mood, moodScore, Date } = req.body;
    console.log("The data is ",req.body)

    const updatedEntry = await DayEntry.findOneAndUpdate(
      { Date, userId },
      { CombinedEntry, mood, moodScore },
      { new: true } // Return the updated document
    );

    if (!updatedEntry) {
      return res
        .status(404)
        .json({ message: "Day entry not found for this date" });
    }

    res
      .status(200)
      .json({ message: "Day entry updated successfully", data: updatedEntry });
  } catch (error) {
    res.status(500).json({ message: "Error updating day entry", error });
  }
};

// Delete a day entry by userId and date
// export const deleteDayEntryByDate = async (req, res) => {
//   try {
//     const { Date, userId } = req.params;

//     const deletedEntry = await DayEntry.findOneAndDelete({ Date, userId });

//     if (!deletedEntry) {
//       return res
//         .status(404)
//         .json({ message: "Day entry not found for this date" });
//     }

//     res.status(200).json({ message: "Day entry deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting day entry", error });
//   }
// };

// Get a single day entry by userId and date
export const getDayEntryByDate = async (req, res) => {
  try {
    const { userId, date } = req.params; // Note: 'date', not 'Date'
    console.log("The date is", date);
    console.log("The userId is", userId);
    const id = userId.toString();
    const d = date.toString();
    const dayEntry = await DayEntry.findOne({ Date: d, userId:id }); // Match the key name
    console.log("The dayentry", dayEntry);

    if (!dayEntry) {
      return res
        .status(404)
        .json({ message: "Day entry not found for this date" });
    }

    res.status(200).json({ data: dayEntry });
  } catch (error) {
    res.status(500).json({ message: "Error fetching day entry", error });
  }
};


// Get all day entries for a specific user by userId
export const getAllDayEntriesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const dayEntries = await DayEntry.find({ userId }).sort({ Date: -1 });

    res.status(200).json({ data: dayEntries });
  } catch (error) {
    res.status(500).json({ message: "Error fetching day entries", error });
  }
};
