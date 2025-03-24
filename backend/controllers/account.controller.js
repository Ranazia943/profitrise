import BankAccount from '../models/account.model.js'; // ES Module import

// Add bank account details
const addBankAccount = async (req, res) => {
  try {
    const { accountHolderName, accountNumber, accountName } = req.body;

    if (!accountHolderName || !accountNumber || !accountName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAccount = new BankAccount({
      accountHolderName,
      accountNumber,
      accountName,
    });

    await newAccount.save();

    return res.status(201).json({ message: 'Account added successfully!', data: newAccount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to add account', error });
  }
};

// Update bank account details by accountNumber
const updateBankAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params; // Using accountNumber here
    const { accountHolderName, accountName } = req.body;

    if (!accountHolderName && !accountName) {
      return res.status(400).json({ message: 'At least one field is required to update' });
    }

    // Find the bank account by account number
    const account = await BankAccount.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Update account details
    account.accountHolderName = accountHolderName || account.accountHolderName;
    account.accountName = accountName || account.accountName;

    await account.save();

    return res.status(200).json({ message: 'Account updated successfully!', data: account });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update account', error });
  }
};

// Fetch bank account details by accountNumber
const getBankAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    // Find the bank account by account number
    const account = await BankAccount.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    return res.status(200).json({ message: 'Account details fetched successfully!', data: account });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch account details', error });
  }
};

export {
  addBankAccount,
  updateBankAccount,
  getBankAccount,
};
