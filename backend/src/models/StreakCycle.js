import mongoose from 'mongoose';

const streakCycleSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    configId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakConfig',
      required: true,
    },
    cycleNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    currentStreak: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    nextDay: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'RESET'],
      required: true,
      default: 'ACTIVE',
      index: true,
    },
    lastClaimAt: {
      type: Date,
      default: null,
    },
    nextClaimAt: {
      type: Date,
      default: null,
    },
    resetAt: {
      type: Date,
      default: null,
    },
    resetReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

streakCycleSchema.index(
  { userId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'ACTIVE' } }
);
streakCycleSchema.index({ userId: 1, cycleNumber: 1 }, { unique: true });

export const StreakCycle = mongoose.model('StreakCycle', streakCycleSchema);

