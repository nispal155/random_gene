import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generates a random 4-digit PIN as a string, preserving leading zeros.
 * Range: "0000" - "9999"
 */
export function generatePin() {
  const pinNumber = crypto.randomInt(0, 10000);
  return pinNumber.toString().padStart(4, '0');
}

/**
 * Hashes a 4-digit PIN using bcryptjs.
 */
export async function hashPin(pin) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pin, salt);
}

/**
 * Compares plain PIN with stored hash.
 */
export async function verifyPin(pin, hash) {
  return bcrypt.compare(pin, hash);
}

/**
 * Masks a PIN for public display in records tables.
 */
export function maskPin(pin) {
  return '****';
}
