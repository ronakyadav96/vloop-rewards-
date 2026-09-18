import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'VE',
      immutable: true,
    },
    veBalance: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
      default: '0',
    },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model('Wallet', walletSchema);

