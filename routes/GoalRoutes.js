import express from 'express'
import { getGoals ,AddGoals} from '../controllers/GoalController.js'

const router = express.Router();

router.get("/goals/:id", getGoals);
router.post("/goals/add/:id", AddGoals);
export default router;