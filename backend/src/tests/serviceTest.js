import assert from 'assert';
import { generateCandidateAccountNumber } from '../services/accountNumberService.js';
import { generatePin, hashPin, verifyPin } from '../services/pinService.js';
import { numberToWords } from '../services/numberWordsService.js';
import { FIXED_CLAIMS_MESSAGE, buildCompleteOutput } from '../utils/csvFormatter.js';

console.log('--- Running Service Tests ---');

// 1. Account Number tests
const acc1 = generateCandidateAccountNumber();
assert(acc1.startsWith('8190'), 'Account number must start with 8190');
assert.strictEqual(acc1.length, 12, 'Account number must be 12 digits');
assert(/^\d{12}$/.test(acc1), 'Account number must contain only digits');
console.log('✓ Account number generation test passed:', acc1);

// 2. PIN generation tests
for (let i = 0; i < 50; i++) {
  const pin = generatePin();
  assert.strictEqual(pin.length, 4, 'PIN must be exactly 4 digits');
  assert(/^\d{4}$/.test(pin), 'PIN must be numeric');
}
console.log('✓ PIN generation test passed (50 samples verified)');

// 3. PIN hashing & verification
const testPin = '0492';
const hash = await hashPin(testPin);
assert(await verifyPin(testPin, hash), 'PIN verification must succeed');
assert(!(await verifyPin('9999', hash)), 'Wrong PIN verification must fail');
console.log('✓ PIN hash & verification test passed');

// 4. Number to words tests
assert.strictEqual(
  numberToWords(7500000),
  'seven million five hundred thousand dollars',
  '7500000 words mismatch'
);
assert.strictEqual(
  numberToWords(35000),
  'thirty five thousand dollars',
  '35000 words mismatch'
);
assert.strictEqual(
  numberToWords(0),
  'zero dollars',
  '0 words mismatch'
);
console.log('✓ Number to words tests passed');

// 5. Output format 1 test
const output1 = buildCompleteOutput({
  accountNumber: '819043535423',
  pin: '3493',
  accountHolderName: 'Gary Frisch',
  mainAmountWords: 'seven million five hundred thousand dollars',
  formatType: 'format1'
});
const expected1 = '819043535423,3493,Gary Frisch,seven million five hundred thousand dollars,unknown so please get in contact with your claims agent for further details in regards to spending rights of your funds';
assert.strictEqual(output1, expected1, 'Format 1 output mismatch');
console.log('✓ Format 1 output test passed');

// 6. Output format 2 test
const output2 = buildCompleteOutput({
  accountNumber: '819043535423',
  pin: '3493',
  accountHolderName: 'Gary Frisch',
  mainAmountWords: 'seven million five hundred thousand dollars',
  formatType: 'format2',
  additionalAmountWords: 'thirty five thousand dollars'
});
const expected2 = '819043535423,3493,Gary Frisch,seven million five hundred thousand dollars,thirty five thousand dollars';
assert.strictEqual(output2, expected2, 'Format 2 output mismatch');
console.log('✓ Format 2 output test passed');

console.log('ALL SERVICE UNIT TESTS PASSED SUCCESSFULLY! ✓');
