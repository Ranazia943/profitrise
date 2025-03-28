import Plan from '../models/plan.model.js';

// Check if plan already exists
export const checkPlanExistence = async (req, res) => {
  const { name } = req.params;

  try {
    const existingPlan = await Plan.findOne({ name });

    if (existingPlan) {
      return res.status(400).json({
        message: `The plan '${name}' already exists in the database.`,
      });
    }

    return res.status(200).json({
      message: `The plan '${name}' can be created.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error checking plan existence.",
      error: error.message,
    });
  }
};

export const addPlan = async (req, res) => {
  const { name, price, duration, dailyProfit, totalProfit } = req.body;

  try {
    // Validate if the plan name is one of the predefined options (from enum)
    const validPlanNames = [
      'Start',
      'Basic',
      'Gold',
      'Platinum',
      'Diamond',
    ];

    if (!validPlanNames.includes(name)) {
      return res.status(400).json({
        message: "Invalid plan name. Please select a valid plan.",
      });
    }

    // Create the new plan with the selected plan's details (from the form)
    const newPlan = new Plan({
      name: name, // Plan name from the frontend
      price: price, // Provided price
      duration: duration, // Provided duration
      dailyProfit: dailyProfit, // Provided daily profit
      totalProfit: totalProfit, // Provided total profit
    });

    await newPlan.save();

    res.status(201).json({
      message: "Plan added successfully.",
      plan: newPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding plan.",
      error: error.message,
    });
  }
};
// Fetch all plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find(); // Fetch all plans from the database
    res.status(200).json(plans); // Return all plans as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching plans.",
      error: error.message,
    });
  }
};
// Delete plan by ID
export const deletePlanById = async (req, res) => {
  const { id } = req.params; // Extract the plan ID from the URL

  try {
    // Find the plan by ID and remove it
    const deletedPlan = await Plan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({
        message: `Plan with ID ${id} not found.`,
      });
    }

    res.status(200).json({
      message: `Plan with ID ${id} deleted successfully.`,
      plan: deletedPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting plan.",
      error: error.message,
    });
  }
};
