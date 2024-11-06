// Import DayEntry model
import { DayEntry } from "../models/UserModel.js";

// Add or concatenate a day entry by date
export const addOrUpdateDayEntry = async (req, res) => {
  try {
    const { CombinedEntry, Date, userId, mood, moodScore } = req.body;

    // Check if an entry with the same Date and userId already exists
    let existingEntry = await DayEntry.findOne({ Date, userId });

    if (existingEntry) {
      // Concatenate the new entry to the existing CombinedEntry
      existingEntry.CombinedEntry += `\n\n${CombinedEntry}`;
      existingEntry.mood = mood; // Update mood if desired
      existingEntry.moodScore = moodScore; // Update moodScore if desired
      await existingEntry.save();
      return res.status(200).json({
        message: "Entry updated and concatenated successfully",
        data: existingEntry,
      });
    }

    // Create a new day entry if none exists
    const newDayEntry = new DayEntry({
      CombinedEntry,
      Date,
      userId,
      mood,
      moodScore,
    });
    await newDayEntry.save();

    res.status(201).json({
      message: "Day entry added successfully",
      data: newDayEntry,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding or updating day entry", error });
  }
};

// Update a day entry by userId and date
export const updateDayEntryByDate = async (req, res) => {
  try {
    const { Date, userId } = req.params;
    const { CombinedEntry, mood, moodScore } = req.body;

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
    const {userId } = req.params;
    const {Date} = req.body;
    console.log("The date i s",Date)
    console.log("The userId i s", userId);
    const dayEntry = await DayEntry.findOne({ Date, userId });
    console.log("The dayentry ",dayEntry)
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
