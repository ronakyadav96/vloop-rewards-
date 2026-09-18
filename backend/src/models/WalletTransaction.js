import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    type: { type: String, enum: ['CREDIT'], required: true },
    currency: { type: String, required: true },
    amount: { type: mongoose.Schema.Types.Decimal128, required: true },
    balanceBefore: { type: mongoose.Schema.Types.Decimal128, required: true },
    balanceAfter: { type: mongoose.Schema.Types.Decimal128, required: true },
    source: { type: String, enum: ['DAILY_STREAK'], required: true },
    sourceReference: { type: String, required: true },
    streakClaimId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreakClaim', required: true },
    status: { type: String, enum: ['POSTED'], required: true, default: 'POSTED' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

walletTransactionSchema.index(
  { walletId: 1, source: 1, sourceReference: 1 },
  { unique: true }
);

export const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);

