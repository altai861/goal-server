const Goal = require("../models/Goal.js");
const User = require("../models/User.js")

async function dateFinder(dateString) {
  let date = new Date(dateString)
  let year = parseInt(dateString.substring(0, 4))
  let month = parseInt(dateString.substring(5, 7))
  let seasonDate, monthDate, weekDate;

  // season date
  if (month >= 6 && month <= 8) {
      seasonDate = year.toString() + "-06-01"
  } else if (month >= 9 && month <= 11) {
      seasonDate = year.toString() + "-09-01"
  } else if (month >= 3 && month <= 5) {
      seasonDate = year.toString() + "-03-01"
  } else {
      seasonDate = (year - 1).toString() + "-12-01"
  }

  //month date
  monthDate = year.toString() + "-" + (month.toString().length === 2 ? month.toString() : "0" + month.toString()) + "-01"

  //week date
  const dayOfWeek = date.getDay();
  const weekStartDate = new Date(date.getTime());
  weekStartDate.setDate(date.getDate() - (dayOfWeek-1));
  weekDate = weekStartDate.toISOString().split("T")[0]

  return {
      seasonDate,
      monthDate,
      weekDate,
      today: dateString
  }
}

// Get present goals, today, this week, this month, this season, the future or past goals will not be shown everytime.
// Get Main Function
async function getGoal(req, res) {
  const userId = req.userId
  const date = req.query.date
  const { seasonDate, monthDate, weekDate, today } = await dateFinder(String(date));
  const seasonGoals = await Goal.find({ userId: userId, type: "S", date: seasonDate });
  const monthGoals = await Goal.find({ userId: userId, type: "M", date: monthDate });
  const weekGoals = await Goal.find({ userId: userId, type: "W", date: weekDate });
  const dayGoals = await Goal.find({ userId: userId, type: "D", date});
  res.json({ seasonGoals, monthGoals, weekGoals, dayGoals })
}

async function addGoal(req, res) {
  const userId = req.userId;
  const { goalTitle, type, date } = req.body;

  if (!goalTitle || !type || !date) {
      return res.status(400).json({ message: "All fields are required" });
  }


  try {

    let resultDate;

    const dates = await dateFinder(date);

    if (type === "S") {
      resultDate = dates.seasonDate;
    } else if (type === "M") {
      resultDate = dates.monthDate;
    } else if (type === "W") {
      resultDate = dates.weekDate;
    } else if (type === "D") {
      resultDate = dates.today;
    }

      const newGoal = new Goal({
          goalTitle,
          type,
          date: resultDate,
          userId
      });

      await newGoal.save();

      return res.status(201).json({ newGoal });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Could not create Goal" });
  }
}

async function updateGoal(req, res) {
  const goalId = req.params.id
  const { goalTitle, type, date, completed, description } = req.body;

  // Validate request body
  if (!goalTitle || !type || !date || (completed !== false && completed !== true) || !description) {
    return res.status(400).json({ message: "All fields are required to update Goal Object" });
  }

  try {
    // Find the goal by ID
    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Update the goal details
    goal.goalTitle = goalTitle;
    goal.type = type;
    goal.date = date; 
    goal.completed = completed;
    goal.description = description;

    // Save the updated goal
    const updatedGoal = await goal.save();

    // Send the updated goal as response
    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the goal" });
  }
}

async function deleteGoal(req, res) {
  const userId = req.userId; // Assuming userId is extracted from authentication middleware
  const { goalId } = req.body;

  try {
      if (!goalId) {
          return res.status(400).json({ message: "Goal id is required" });
      }

      // Ensure the user has permission to delete the goal (optional step)
      const deletedGoal = await Goal.findOneAndDelete({ _id: goalId, userId: userId });

      if (deletedGoal) {
          return res.json({ message: "Deleted successfully" });
      } else {
          return res.status(404).json({ message: "Goal not found or you don't have permission to delete it" });
      }
  } catch (error) {
      console.error("Error deleting goal:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getGoal, addGoal, updateGoal, deleteGoal };
