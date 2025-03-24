import mongoose from 'mongoose';

// Define the schema for Bank Account
const bankAccountSchema = new mongoose.Schema({
  accountHolderName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true, // Make sure account number is unique
  },
  accountName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // To track when each account detail is created/updated
});

// Create and export the model
const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

export default BankAccount;
