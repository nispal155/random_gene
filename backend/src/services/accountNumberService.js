import crypto from 'crypto';
import Account from '../models/Account.js';

const PREFIX = '8190';
const MAX_RETRIES = 20;

/**
 * Generates a candidate 12-digit account number starting with 8190.
 */
export function generateCandidateAccountNumber() {
  const randomSuffix = crypto.randomInt(0, 100000000).toString().padStart(8, '0');
  return `${PREFIX}${randomSuffix}`;
}

/**
 * Generates a guaranteed unique 12-digit account number by checking against the database.
 */
export async function generateUniqueAccountNumber() {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const candidate = generateCandidateAccountNumber();
    
    // Check if account already exists in MongoDB
    const exists = await Account.exists({ accountNumber: candidate });
    if (!exists) {
      return candidate;
    }
  }

  throw new Error('Failed to generate a unique account number after multiple attempts. Please try again.');
}
