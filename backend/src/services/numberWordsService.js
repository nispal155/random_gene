/**
 * Converts a positive numeric amount into lowercase English words followed by "dollars".
 * Example: 7500000 -> "seven million five hundred thousand dollars"
 * Example: 35000 -> "thirty five thousand dollars"
 */

const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

const SCALES = ['', 'thousand', 'million', 'billion', 'trillion'];

function convertUnderThousand(num) {
  let words = [];

  if (num >= 100) {
    words.push(ONES[Math.floor(num / 100)]);
    words.push('hundred');
    num %= 100;
  }

  if (num >= 20) {
    words.push(TENS[Math.floor(num / 10)]);
    const remainder = num % 10;
    if (remainder > 0) {
      words.push(ONES[remainder]);
    }
  } else if (num > 0) {
    words.push(ONES[num]);
  }

  return words.join(' ');
}

export function numberToWords(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '';
  }

  const num = Math.floor(Math.abs(Number(amount)));

  if (num === 0) {
    return 'zero dollars';
  }

  let chunkCount = 0;
  let remaining = num;
  let wordsChunks = [];

  while (remaining > 0 && chunkCount < SCALES.length) {
    const chunk = remaining % 1000;
    if (chunk > 0) {
      const chunkWords = convertUnderThousand(chunk);
      const scale = SCALES[chunkCount];
      if (scale) {
        wordsChunks.unshift(`${chunkWords} ${scale}`);
      } else {
        wordsChunks.unshift(chunkWords);
      }
    }
    remaining = Math.floor(remaining / 1000);
    chunkCount++;
  }

  const resultWords = wordsChunks.join(' ').trim().toLowerCase();
  return `${resultWords} dollars`;
}
