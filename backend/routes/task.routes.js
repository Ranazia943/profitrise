import express from 'express';
import { createTaskForPlan,deleteTask,addEarningsOnTaskVisit, getTaskDetailsByTaskId, getTasksAndPlanNameByPlanId } from '../controllers/task.controller.js';
import protect from '../utils/protectroute.js';

const router = express.Router();

// Route to create tasks for a plan
router.post('/create', createTaskForPlan);  // Create task for a plan
router.get('/task/:taskId', getTaskDetailsByTaskId);
router.post('/task/:taskId', protect, addEarningsOnTaskVisit);

// Route to get tasks by planId
router.get('/:planId', getTasksAndPlanNameByPlanId);
router.delete('/:taskId', deleteTask); // Delete task by taskId

// Route to mark a task as completed

export default router;
