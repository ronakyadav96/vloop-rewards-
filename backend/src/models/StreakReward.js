import mongoose from 'mongoose';

const streakRewardSchema = new mongoose.Schema(
  {
    configId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakConfig',
      required: true,
      index: true,
    },
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    rewardType: {
      type: String,
      required: true,
      enum: ['VE', 'GIFT_CARD'],
    },
    currency: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      validate: {
        validator: (value) => Number(value) >= 0,
        message: 'Reward amount cannot be negative',
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    assetType: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

streakRewardSchema.index({ configId: 1, dayNumber: 1 }, { unique: true });

export const StreakReward = mongoose.model('StreakReward', streakRewardSchema);

