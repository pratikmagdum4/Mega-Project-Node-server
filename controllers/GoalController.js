import { Goals } from "../models/GoalModel.js";

const getGoals = async (req, res) => {
  const id = req.params.id; // Correct way to access the id parameter
  console.log("The id is in goal ", id);

  try {
    const goals = await Goals.find({ userId: id });
    console.log("The goals are", goals);
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};
const AddGoals = async (req, res) => {
  const id = req.params.id; // Assuming id is in a route parameter

  try {
    const data = req.body;
    const { goalDescription, goalCategory, userId } = req.body;
// console.log("The data is ",data)
    const newGoal = new Goals({
      goalDescription,
      goalCategory,
      userId,
    });
// console.log("The new goal is ", newGoal);

    await newGoal.save();
    res.status(201).json({ message: "Goal added successfully", goal: newGoal });
  } catch (error) {
    console.error("error ", error);
    res.status(500).json({ message: "Error adding goal", error: error });
  }
};
export { getGoals, AddGoals };