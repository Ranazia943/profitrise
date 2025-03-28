import express from 'express';
import { getPlans, addPlan, checkPlanExistence, deletePlanById } from '../controllers/plans.controller.js';

const router = express.Router();

// Route for checking plan existence
router.get('/check/:name', checkPlanExistence);

// Route for adding a new plan
router.post('/add', addPlan);

// Route for getting all plans
router.get('/all', getPlans);

// Route for deleting a plan by ID
router.delete('/delete/:id', deletePlanById);

export default router;
