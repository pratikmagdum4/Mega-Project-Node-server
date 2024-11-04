import { Goals } from "../models/GoalModel.js";

const getGoals = async (req, res) => {
  const id = req.params.id; // Correct way to access the id parameter

  try {
    const goals = await Goals.find({ userId: id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};
const AddGoals = async (req, res) => {
  const id = req.params.id; // Assuming id is in a route parameter

  try {
    const { goalDescription, goalCategory, userId, questions } = req.body;

    const newGoal = new Goals({
      goalDescription,
      goalCategory,
      userId,
      questions, // Keep questions as an array
    });

    await newGoal.save();
    res.status(201).json({ message: "Goal added successfully", goal: newGoal });
  } catch (error) {
    console.error("error ", error);
    res.status(500).json({ message: "Error adding goal", error: error });
  }
};
const deleteGoal = async (req,res)=>{
  const goalId = req.params.id;
  try{
    const deletedGaol = await Goals.findByIdAndDelete(goalId);

    if(!deleteGoal){
      return res.status(404).json({message:"Gaol not found"})
    }

    res.status(200).json({message:"Goal deleted successfully ",goal:deletedGaol})
  }
  catch(error)
  {
    res.status(500).json({message:"Error deleting goal",error})
  }
}
const updateGoal = async ( req,res) =>{
  const goalId = req.params.id;
  console.log("the data is",req.body)
  let updatedGoalCategory = req.body.goalCategory;
  let updatedGoalDescription = req.body.goalDescription;
  try{
    const updatedGoal = await Goals.findAndUpdateById(goalId, req.body, {
      new: true,
      runValidators: true,
      goalCategory: updatedGoalCategory,
      goalDescription:updatedGoalDescription,
    });
    console.log("The updated is ",updatedGoal)
    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    res.status(200).json({message:"Goal updated Successfully ",goal:updatedGoal})
  }catch(error)
  {
    res.status(500).json({message:"Error updating goal",error})
  }
}
export { getGoals, AddGoals ,deleteGoal,updateGoal};
