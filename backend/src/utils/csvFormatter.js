export const FIXED_CLAIMS_MESSAGE =
  'unknown so please get in contact with your claims agent for further details in regards to spending rights of your funds';

/**
 * Builds the exact 5-field comma-separated output string.
 * Format 1: AccountNumber,PIN,AccountHolderName,MainAmountInWords,ClaimsMessage
 * Format 2: AccountNumber,PIN,AccountHolderName,MainAmountInWords,AdditionalAmountInWords
 *
 * Strictly NO labels, NO extra spaces around commas, NO surrounding quotes unless required by CSV escaping.
 */
export function buildCompleteOutput({
  accountNumber,
  pin,
  accountHolderName,
  mainAmountWords,
  formatType,
  additionalAmountWords
}) {
  const cleanName = (accountHolderName || '').trim();
  const fifth =
    formatType === 'format1'
      ? FIXED_CLAIMS_MESSAGE
      : (additionalAmountWords || '').trim();

  return `${accountNumber},${pin},${cleanName},${mainAmountWords},${fifth}`;
}

/**
 * Serializes an array of account records to CSV format with standard headers.
 */
export function formatAccountsToCSV(records) {
  const headers = [
    'SerialNumber',
    'AccountNumber',
    'PIN',
    'AccountHolderName',
    'SelectedFormat',
    'MainAmount',
    'MainAmountInWords',
    'AdditionalAmount',
    'AdditionalAmountInWords',
    'FifthField',
    'CompleteCommaSeparatedOutput',
    'GeneratedDate'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((record, index) => {
    return [
      index + 1,
      record.accountNumber,
      record.pinMasked || '****',
      record.accountHolderName,
      record.formatType === 'format1' ? 'Format 1 – Claims Message' : 'Format 2 – Additional Amount',
      record.mainAmount,
      record.mainAmountWords,
      record.additionalAmount ?? '',
      record.additionalAmountWords ?? '',
      record.fifthField,
      record.completeOutput,
      new Date(record.createdAt).toISOString()
    ].map(escapeCSV).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
