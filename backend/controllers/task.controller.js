import Task from '../models/task.model.js';
import Earnings from '../models/earning.model.js';
import UserPlan from '../models/userplan.model.js';


export const createTaskForUser = async (req, res) => {
    try {
        const { userId, planId, taskName, taskPrice, taskUrl } = req.body;

        // Validate the task data
        if (!userId || !planId || !taskName || !taskPrice || !taskUrl) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate task type (taskName can only be 'website visit' or 'youtube video')
        if (!['website visit', 'youtube video'].includes(taskName)) {
            return res.status(400).json({ message: 'Invalid task type' });
        }

        // Your existing logic here...
        const newTask = new Task({
            userId,
            planId,
            type: taskName,  // taskName from the frontend, saved as type
            url: taskUrl,
            price: taskPrice,
        });

        const savedTask = await newTask.save();
        return res.status(201).json({ message: 'Task created successfully', task: savedTask });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

  
// Task Completion Logic
export const completeTask = async (req, res) => {
  const { taskId } = req.body;

  try {
    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task is already completed
    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Task already completed' });
    }

    // Mark task as completed
    task.status = 'completed';
    task.endDate = new Date();
    await task.save();

    // Update earnings for the user
    const earnings = await Earnings.findOne({ userId: task.userId });

    if (!earnings) {
      return res.status(404).json({ message: 'Earnings not found for this user' });
    }

    // Add the task price to the user's total earnings
    earnings.totalEarnings += task.price;

    // Add the daily earnings
    earnings.dailyEarnings.push({
      date: new Date(),
      amount: task.price,
    });

    await earnings.save();

    // Return success response
    return res.status(200).json({ message: 'Task completed and earnings updated', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




export const getTasksByUserAndPlanId = async (req, res) => {
  const { userId, planId } = req.params; // Get userId and planId from the route params

  try {
    // Fetch tasks related to this user and plan using both userId and planId
    const tasks = await Task.find({ userId, planId });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user and plan' });
    }

    // Return tasks
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
