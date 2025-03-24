// task.routes.js
import express from 'express';
import { createTaskForUser, completeTask,getTasksByUserAndPlanId } from '../controllers/task.controller.js';

const router = express.Router();

// Route to create tasks for a user based on their plan
router.post('/create', createTaskForUser);
router.get('/:userId/:planId', getTasksByUserAndPlanId);

// Route to mark a task as completed
router.post('/complete', completeTask);

export default router;
