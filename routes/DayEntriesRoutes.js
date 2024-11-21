import express from 'express';
import {
  addOrUpdateDayEntry,
  updateDayEntryByDate,
  
  getDayEntryByDate,
  getAllDayEntriesByUser,
} from "../controllers/DayEntry.js";

const router = express.Router();

// Add or update a day entry for a specific date
router.post("/add-day-entry", addOrUpdateDayEntry);

// Update a day entry by userId and Date
router.put("/update-day-entry/:userId/:Date", updateDayEntryByDate);

// Delete a day entry by userId and Date
// router.delete("/day-entry/:userId/:Date", deleteDayEntryByDate);

// Get a single day entry by userId and Date
router.get("/day-entry/:userId/:date", getDayEntryByDate);

// Get all day entries for a specific user
router.get("/day-entries/:userId", getAllDayEntriesByUser);

export default router;
