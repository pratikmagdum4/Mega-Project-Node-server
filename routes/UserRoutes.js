import express from "express";
import {
  addJournalEntry,
  CreateUser,
  getEntryOnDate,
  getAllEntries,
  deleteEntryAndUpdateDayEntry,
  updateEntry,
  getAllEntriesGroupedByDate,
} from "../controllers/CreateUserController.js";
import { UserLogin } from "../controllers/LoginController.js";
const router = express.Router();

router.post("/signup", CreateUser);
// router.post("/login", UserLogin);
router.post("/add-entry", addJournalEntry);
router.get("/get-entry", getEntryOnDate);
router.get("/get-all-entries/:id", getAllEntries);
router.delete("/delete-entry/:entryId/:userId/:date", deleteEntryAndUpdateDayEntry);
router.put("/update-entry/:id", updateEntry);
router.get("/day-entries/:id", getAllEntriesGroupedByDate);

export default router;
