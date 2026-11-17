import Account from '../models/Account.js';
import { generateUniqueAccountNumber } from '../services/accountNumberService.js';
import { generatePin, hashPin } from '../services/pinService.js';
import { numberToWords } from '../services/numberWordsService.js';
import {
  FIXED_CLAIMS_MESSAGE,
  buildCompleteOutput,
  formatAccountsToCSV
} from '../utils/csvFormatter.js';

/**
 * POST /api/accounts/generate
 * Generates an account number, PIN, words, and exact output format for preview.
 */
export async function generateAccountPreview(req, res) {
  try {
    const { accountHolderName, formatType, mainAmount, additionalAmount } = req.body;

    // Validate accountHolderName
    if (!accountHolderName || typeof accountHolderName !== 'string' || !accountHolderName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Account Holder Name is required.'
      });
    }

    const cleanName = accountHolderName.trim().replace(/,/g, '');

    // Validate formatType
    if (!formatType || !['format1', 'format2'].includes(formatType)) {
      return res.status(400).json({
        success: false,
        message: 'Valid output format selection is mandatory (format1 or format2).'
      });
    }

    // Validate mainAmount
    const parsedMainAmount = Number(mainAmount);
    if (isNaN(parsedMainAmount) || parsedMainAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Main Amount must be a valid non-negative number.'
      });
    }

    // Validate additionalAmount if format2
    let parsedAdditionalAmount = null;
    let additionalAmountWords = null;
    let claimsMessage = null;
    let fifthField = '';

    if (formatType === 'format2') {
      parsedAdditionalAmount = Number(additionalAmount);
      if (additionalAmount === undefined || additionalAmount === null || isNaN(parsedAdditionalAmount) || parsedAdditionalAmount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Additional Amount is required and must be a valid non-negative number for Format 2.'
        });
      }
      additionalAmountWords = numberToWords(parsedAdditionalAmount);
      fifthField = additionalAmountWords;
    } else {
      claimsMessage = FIXED_CLAIMS_MESSAGE;
      fifthField = FIXED_CLAIMS_MESSAGE;
    }

    // Generate 12-digit account number starting with 8190
    const accountNumber = await generateUniqueAccountNumber();

    // Generate 4-digit PIN (preserves leading zeros)
    const pin = generatePin();

    // Convert main amount to lowercase English words + dollars
    const mainAmountWords = numberToWords(parsedMainAmount);

    // Build the exact comma-separated output
    const completeOutput = buildCompleteOutput({
      accountNumber,
      pin,
      accountHolderName: cleanName,
      mainAmountWords,
      formatType,
      additionalAmountWords
    });

    return res.status(200).json({
      success: true,
      data: {
        accountNumber,
        pin,
        accountHolderName: cleanName,
        formatType,
        mainAmount: parsedMainAmount,
        mainAmountWords,
        additionalAmount: parsedAdditionalAmount,
        additionalAmountWords,
        claimsMessage,
        fifthField,
        completeOutput
      }
    });
  } catch (error) {
    console.error('Error generating account preview:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while generating account details.'
    });
  }
}

/**
 * POST /api/accounts
 * Saves a generated account into MongoDB.
 */
export async function saveAccount(req, res) {
  try {
    const {
      accountNumber,
      pin,
      accountHolderName,
      formatType,
      mainAmount,
      mainAmountWords,
      additionalAmount,
      additionalAmountWords,
      claimsMessage,
      fifthField,
      completeOutput
    } = req.body;

    if (!accountNumber || !/^8190\d{8}$/.test(accountNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account number. Must be 12 digits starting with 8190.'
      });
    }

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PIN. Must be exactly 4 digits.'
      });
    }

    if (!accountHolderName || !accountHolderName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Account Holder Name is required.'
      });
    }

    // Hash the PIN securely
    const pinHash = await hashPin(pin);

    const newAccount = new Account({
      accountNumber,
      pinHash,
      pinMasked: '****',
      accountHolderName: accountHolderName.trim().replace(/,/g, ''),
      formatType,
      mainAmount: Number(mainAmount),
      mainAmountWords,
      additionalAmount: additionalAmount !== undefined && additionalAmount !== null ? Number(additionalAmount) : null,
      additionalAmountWords: additionalAmountWords || null,
      claimsMessage: formatType === 'format1' ? (claimsMessage || FIXED_CLAIMS_MESSAGE) : null,
      fifthField,
      completeOutput
    });

    const saved = await newAccount.save();
    const accountResponse = saved.toObject();
    delete accountResponse.pinHash;

    return res.status(201).json({
      success: true,
      message: 'Account record saved successfully to database.',
      data: accountResponse
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this account number already exists in the database. Please generate a new one.'
      });
    }

    console.error('Error saving account record:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while saving account.'
    });
  }
}

/**
 * GET /api/accounts
 * Lists saved accounts with search and pagination.
 */
export async function getAccounts(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const search = (req.query.search || '').trim();
    const formatType = req.query.formatType;

    const filter = {};

    if (search) {
      filter.$or = [
        { accountNumber: { $regex: search, $options: 'i' } },
        { accountHolderName: { $regex: search, $options: 'i' } }
      ];
    }

    if (formatType && ['format1', 'format2'].includes(formatType)) {
      filter.formatType = formatType;
    }

    const total = await Account.countDocuments(filter);
    const records = await Account.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching accounts.'
    });
  }
}

/**
 * GET /api/accounts/:id
 * Retrieves a single account record by ID.
 */
export async function getAccountById(req, res) {
  try {
    const account = await Account.findById(req.params.id).lean();
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error('Error retrieving account:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while retrieving account.'
    });
  }
}

/**
 * DELETE /api/accounts/:id
 * Deletes an account record by ID.
 */
export async function deleteAccount(req, res) {
  try {
    const deleted = await Account.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Account record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Account record deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting account.'
    });
  }
}

/**
 * GET /api/accounts/export
 * Exports all matching accounts to a CSV file.
 */
export async function exportAccountsCSV(req, res) {
  try {
    const search = (req.query.search || '').trim();
    const formatType = req.query.formatType;

    const filter = {};
    if (search) {
      filter.$or = [
        { accountNumber: { $regex: search, $options: 'i' } },
        { accountHolderName: { $regex: search, $options: 'i' } }
      ];
    }
    if (formatType && ['format1', 'format2'].includes(formatType)) {
      filter.formatType = formatType;
    }

    const records = await Account.find(filter).sort({ createdAt: -1 }).lean();
    const csvData = formatAccountsToCSV(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="fictional_accounts_export_${Date.now()}.csv"`
    );

    return res.status(200).send(csvData);
  } catch (error) {
    console.error('Error exporting accounts CSV:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while exporting CSV.'
    });
  }
}
