import mongoose from 'mongoose';

const rewardSnapshotSchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    rewardType: { type: String, required: true },
    currency: { type: String, required: true },
    amount: { type: mongoose.Schema.Types.Decimal128, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    assetType: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const streakClaimSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    cycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakCycle',
      required: true,
      index: true,
    },
    configId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakConfig',
      required: true,
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakReward',
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['PROCESSING', 'SUCCESS', 'PENDING_FULFILLMENT', 'FAILED'],
      required: true,
    },
    fulfillmentStatus: {
      type: String,
      enum: ['NOT_REQUIRED', 'PENDING', 'FULFILLED'],
      required: true,
    },
    rewardSnapshot: {
      type: rewardSnapshotSchema,
      required: true,
    },
    idempotencyKey: {
      type: String,
      trim: true,
      default: null,
    },
    walletTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WalletTransaction',
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    failureCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

streakClaimSchema.index({ cycleId: 1, dayNumber: 1 }, { unique: true });
streakClaimSchema.index(
  { userId: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } }
);
streakClaimSchema.index({ userId: 1, claimedAt: -1 });

export const StreakClaim = mongoose.model('StreakClaim', streakClaimSchema);

