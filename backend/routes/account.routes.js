import express from 'express';
import { addBankAccount, updateBankAccount, getBankAccount } from '../controllers/account.controller.js';

const router = express.Router();

// Route to add a new bank account
router.post('/add', addBankAccount);

// Route to update bank account details (by account number)
router.put('/update/:accountNumber', updateBankAccount);

// Route to get bank account details by account number
router.get('/:accountNumber', getBankAccount);

export default router;
