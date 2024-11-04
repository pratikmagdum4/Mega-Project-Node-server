import express from 'express'
import { getGoals ,AddGoals,deleteGoal,updateGoal} from '../controllers/GoalController.js'

const router = express.Router();

router.get("/goals/:id", getGoals);
router.post("/goals/add/:id", AddGoals);
router.delete("/goals/delete/:id", deleteGoal);
router.put("/goals/update/:id", updateGoal);

export default router;