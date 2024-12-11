import express from 'express'
import { getGoals ,AddGoals,deleteGoal,updateGoal} from '../controllers/GoalController.js'

const router = express.Router();

router.get("/goals/:id", getGoals);
router.post("/goals/add/:id", AddGoals);
router.delete("/goals/delete/:id", deleteGoal);
router.put("/goals/update/:id", updateGoal);






// router.post("/t",(req,res) =>  {
//     const { title } = req.body;
//     const t = title;
//     console.log("THe data ",t)
//     let a = '';
//     let n = t.length;
//     for(let i = 0 ;i<n;i++)
//     {
//         a =  a + t[n-i-1];
//     }
//     console.log("a is ",a)
//     res.json({a})
// })




export default router;