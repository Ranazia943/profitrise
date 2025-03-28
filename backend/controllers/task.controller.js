import Task from '../models/task.model.js';
import Plan from '../models/plan.model.js';
import Earnings from '../models/earning.model.js';  // To update the user's earnings
import mongoose from 'mongoose';

// Create Task for a Plan
export const createTaskForPlan = async (req, res) => {
    try {
        const { planId, type, price, url } = req.body;

        // Validate the task data
        if (!planId || !type || !price || !url) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        
        // Check if the plan exists
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Create a new task for the plan
        const newTask = new Task({
            planId,  // Linking task to a plan
            type,  // task type (website visit or youtube video)
            url,
            price,
        });

        // Save the task
        const savedTask = await newTask.save();
        return res.status(201).json({ message: 'Task created successfully', task: savedTask });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const addEarningsOnTaskVisit = async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user.id; // From protect middleware
  
    try {
      // 1. Find the task
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // 2. Update user's earnings
      let earnings = await Earnings.findOneAndUpdate(
        { userId },
        { 
          $inc: { totalEarnings: task.price },
          $push: {
            dailyEarnings: {
              date: new Date().setHours(0, 0, 0, 0),
              amount: task.price
            }
          }
        },
        { new: true, upsert: true }
      );
  
      // 3. Return success response
      return res.status(200).json({
        success: true,
        message: 'Earnings added successfully',
        amountAdded: task.price,
        totalEarnings: earnings.totalEarnings
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

// Fetch Task Details by Task ID
export const getTaskDetailsByTaskId = async (req, res) => {
    const { taskId } = req.params; // Get taskId from the route params

    // Validate if taskId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: 'Invalid Task ID' });
    }

    try {
        // Fetch the task by taskId and populate the plan name
        const task = await Task.findById(taskId).populate('planId', 'name'); // Populate the plan's name

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Return task details
        return res.status(200).json({
            taskId: task._id,
            type: task.type,
            price: task.price,
            url: task.url,
            planName: task.planId.name,  // Populate the plan name here
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const getTasksAndPlanNameByPlanId = async (req, res) => {
    const { planId } = req.params;  // Get planId from the route params

    // Validate if planId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(planId)) {
        return res.status(400).json({ message: 'Invalid Plan ID' });
    }

    try {
        // Fetch tasks related to this plan and populate the plan's name
        const tasks = await Task.find({ planId })
            .populate('planId', 'name');  // Populate only the plan's name

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this plan' });
        }

        // Return the tasks with the plan name
        return res.status(200).json({
            tasks: tasks.map(task => ({
                taskId: task._id,
                type: task.type,
                price: task.price,
                url: task.url,
                planName: task.planId.name,  // Add the populated plan name here
            }))
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Delete Task
export const deleteTask = async (req, res) => {
    const { taskId } = req.params; // Get taskId from the route params

    // Validate if taskId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: 'Invalid Task ID' });
    }

    try {
        // Find the task by ID and delete it
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Return success response
        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};



  