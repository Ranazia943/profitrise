import UserTaskProgress from '../models/UserTaskProgress.model.js';
import Task from '../models/task.model.js';
import Earnings from '../models/earning.model.js';
import Plan from '../models/plan.model.js'; // Import Plan model

// Fetch task details for the user
export const getTaskForUser = async (req, res) => {
  try {
    const { taskId, userId } = req.params;

    // Fetch the task by ID and populate the associated planId
    const task = await Task.findById(taskId).populate('planId');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Generate math question numbers
    const number1 = Math.floor(Math.random() * 10) + 1;
    const number2 = Math.floor(Math.random() * 10) + 1;

    // Create a math question object
    const mathQuestion = {
      question: `${number1} + ${number2}`,
      correctAnswer: number1 + number2,
    };

    // Send the task URL, math question, and plan details to the user
    return res.status(200).json({
      message: 'Task fetched successfully.',
      taskUrl: task.url,
      planId: task.planId ? task.planId._id : null, // Ensure planId exists before accessing
      planName: task.planId ? task.planId.name : null, // Ensure planName exists before accessing
      mathQuestion: mathQuestion, // Include the generated math question
      taskId: task._id,
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const submitTaskAnswer = async (req, res) => {
  try {
    const { taskId, userId } = req.params;
    const { answer } = req.body;

    // Log the incoming request body and params
    console.log('Request Params:', { taskId, userId });
    console.log('Request Body:', req.body);

    // Proceed with the rest of your logic
    const task = await Task.findById(taskId).populate('planId');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const correctAnswer = task.mathQuestion ? task.mathQuestion.correctAnswer : null;
    if (!correctAnswer) {
      return res.status(400).json({ message: 'Task does not have a correct answer.' });
    }

    if (parseInt(answer) !== correctAnswer) {
      return res.status(400).json({ message: 'Incorrect answer. Please try again.' });
    }

    // After validating the answer, create or update task progress
    let userTaskProgress = await UserTaskProgress.findOne({ taskId, userId });
    if (!userTaskProgress) {
      // If the progress does not exist, create a new record
      userTaskProgress = new UserTaskProgress({
        taskId,
        userId,
        status: 'completed',
        answer: parseInt(answer),
      });
    } else {
      // If the progress exists, update it
      userTaskProgress.status = 'completed';
      userTaskProgress.answer = parseInt(answer);
    }

    await userTaskProgress.save(); // Save the progress to the database

    // You can also update earnings or other logic here as needed
    const earnings = new Earnings({
      userId,
      taskId,
      amount: 10, // Example value for task completion
    });

    await earnings.save();

    return res.status(200).json({ message: 'Task completed successfully!' });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

