import assert from 'assert';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Account from '../models/Account.js';
import {
  generateAccountPreview,
  saveAccount,
  getAccounts,
  exportAccountsCSV,
  deleteAccount
} from '../controllers/accountController.js';

// Mock Express req & res objects
function createMockReqRes({ body = {}, query = {}, params = {} } = {}) {
  const req = { body, query, params };
  let statusCode = 200;
  let responseData = null;
  const headers = {};

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    setHeader(key, val) {
      headers[key] = val;
    },
    json(data) {
      responseData = data;
      return res;
    },
    send(data) {
      responseData = data;
      return res;
    },
    getStatusCode: () => statusCode,
    getData: () => responseData,
    getHeaders: () => headers
  };

  return { req, res };
}

async function runIntegrationTest() {
  console.log('--- Starting API Integration Tests ---');
  await connectDB();

  // Clean test collection
  await Account.deleteMany({ accountHolderName: /TestGary/ });

  // 1. Test Format 1 Generation
  console.log('1. Testing Format 1 Generation...');
  const { req: gen1Req, res: gen1Res } = createMockReqRes({
    body: {
      accountHolderName: 'TestGary Frisch',
      formatType: 'format1',
      mainAmount: 7500000,
      additionalAmount: null
    }
  });

  await generateAccountPreview(gen1Req, gen1Res);
  assert.strictEqual(gen1Res.getStatusCode(), 200);
  const gen1Data = gen1Res.getData().data;
  assert(gen1Data.accountNumber.startsWith('8190'), 'Format 1 Acc must start with 8190');
  assert.strictEqual(gen1Data.accountNumber.length, 12, 'Acc must be 12 digits');
  assert.strictEqual(gen1Data.pin.length, 4, 'PIN must be 4 digits');
  assert.strictEqual(gen1Data.mainAmountWords, 'seven million five hundred thousand dollars');
  assert.strictEqual(
    gen1Data.fifthField,
    'unknown so please get in contact with your claims agent for further details in regards to spending rights of your funds'
  );
  assert.strictEqual(
    gen1Data.completeOutput,
    `${gen1Data.accountNumber},${gen1Data.pin},TestGary Frisch,seven million five hundred thousand dollars,unknown so please get in contact with your claims agent for further details in regards to spending rights of your funds`
  );
  console.log('✓ Format 1 Generation preview verified successfully');

  // 2. Test Saving Format 1 Account to MongoDB
  console.log('2. Testing Save Record to MongoDB...');
  const { req: save1Req, res: save1Res } = createMockReqRes({
    body: gen1Data
  });
  await saveAccount(save1Req, save1Res);
  assert.strictEqual(save1Res.getStatusCode(), 201);
  const saved1 = save1Res.getData().data;
  assert.strictEqual(saved1.accountNumber, gen1Data.accountNumber);
  assert.strictEqual(saved1.pinMasked, '****');
  assert.strictEqual(saved1.pinHash, undefined, 'pinHash must not be exposed');
  console.log('✓ Saved Format 1 record to DB verified');

  // 3. Test Format 2 Generation
  console.log('3. Testing Format 2 Generation...');
  const { req: gen2Req, res: gen2Res } = createMockReqRes({
    body: {
      accountHolderName: 'TestGary Frisch',
      formatType: 'format2',
      mainAmount: 7500000,
      additionalAmount: 35000
    }
  });
  await generateAccountPreview(gen2Req, gen2Res);
  assert.strictEqual(gen2Res.getStatusCode(), 200);
  const gen2Data = gen2Res.getData().data;
  assert.strictEqual(gen2Data.additionalAmountWords, 'thirty five thousand dollars');
  assert.strictEqual(gen2Data.fifthField, 'thirty five thousand dollars');
  assert.strictEqual(
    gen2Data.completeOutput,
    `${gen2Data.accountNumber},${gen2Data.pin},TestGary Frisch,seven million five hundred thousand dollars,thirty five thousand dollars`
  );
  console.log('✓ Format 2 Generation preview verified successfully');

  // 4. Test Saving Format 2 Account
  const { req: save2Req, res: save2Res } = createMockReqRes({
    body: gen2Data
  });
  await saveAccount(save2Req, save2Res);
  assert.strictEqual(save2Res.getStatusCode(), 201);
  const saved2 = save2Res.getData().data;
  console.log('✓ Saved Format 2 record to DB verified');

  // 5. Test Duplicate Prevention on Save
  console.log('5. Testing Duplicate Account Number Prevention...');
  const { req: dupReq, res: dupRes } = createMockReqRes({
    body: gen1Data
  });
  await saveAccount(dupReq, dupRes);
  assert.strictEqual(dupRes.getStatusCode(), 409, 'Duplicate should return 409 Conflict');
  console.log('✓ Duplicate key rejection verified');

  // 6. Test Fetch Records with Search and Pagination
  console.log('6. Testing Accounts Listing & Search...');
  const { req: listReq, res: listRes } = createMockReqRes({
    query: { search: 'TestGary', page: 1, limit: 10 }
  });
  await getAccounts(listReq, listRes);
  assert.strictEqual(listRes.getStatusCode(), 200);
  const listData = listRes.getData();
  assert(listData.records.length >= 2, 'Should find at least 2 records for TestGary');
  console.log('✓ Accounts list and search verified');

  // 7. Test CSV Export
  console.log('7. Testing CSV Export...');
  const { req: expReq, res: expRes } = createMockReqRes({
    query: { search: 'TestGary' }
  });
  await exportAccountsCSV(expReq, expRes);
  assert.strictEqual(expRes.getStatusCode(), 200);
  const csvContent = expRes.getData();
  assert(csvContent.includes('AccountNumber,PIN,AccountHolderName'), 'CSV header missing');
  assert(csvContent.includes('TestGary Frisch'), 'CSV row missing');
  console.log('✓ CSV Export verified');

  // 8. Test Delete Record
  console.log('8. Testing Record Deletion...');
  const { req: delReq, res: delRes } = createMockReqRes({
    params: { id: saved1._id }
  });
  await deleteAccount(delReq, delRes);
  assert.strictEqual(delRes.getStatusCode(), 200);
  const remaining = await Account.findById(saved1._id);
  assert.strictEqual(remaining, null, 'Deleted account must be null');
  console.log('✓ Record deletion verified');

  // Clean remaining test records
  await Account.deleteMany({ accountHolderName: /TestGary/ });
  await mongoose.disconnect();
  console.log('ALL API INTEGRATION TESTS PASSED CLEANLY! ✓');
  process.exit(0);
}

runIntegrationTest().catch((err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
