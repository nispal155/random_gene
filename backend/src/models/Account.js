import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^8190\d{8}$/
    },
    pinHash: {
      type: String,
      required: true,
      select: false // Never return in default queries
    },
    pinMasked: {
      type: String,
      default: '****'
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true
    },
    formatType: {
      type: String,
      required: true,
      enum: ['format1', 'format2']
    },
    mainAmount: {
      type: Number,
      required: true,
      min: 0
    },
    mainAmountWords: {
      type: String,
      required: true,
      trim: true
    },
    additionalAmount: {
      type: Number,
      default: null
    },
    additionalAmountWords: {
      type: String,
      default: null,
      trim: true
    },
    claimsMessage: {
      type: String,
      default: null,
      trim: true
    },
    fifthField: {
      type: String,
      required: true,
      trim: true
    },
    completeOutput: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure compound or text index for search
AccountSchema.index({ accountNumber: 'text', accountHolderName: 'text' });

export default mongoose.model('Account', AccountSchema);
