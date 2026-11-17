import express from 'express';
import {
  generateAccountPreview,
  saveAccount,
  getAccounts,
  getAccountById,
  deleteAccount,
  exportAccountsCSV
} from '../controllers/accountController.js';

const router = express.Router();

// Preview/generate account details (12-digit number, 4-digit PIN, word conversions, output)
router.post('/generate', generateAccountPreview);

// Persist generated account in database
router.post('/', saveAccount);

// Export CSV
router.get('/export', exportAccountsCSV);

// List accounts with pagination & search
router.get('/', getAccounts);

// Retrieve single account
router.get('/:id', getAccountById);

// Delete account record
router.delete('/:id', deleteAccount);

export default router;
