import mongoose from 'mongoose';

const streakConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    cycleLength: {
      type: Number,
      required: true,
      min: 1,
    },
    timezone: {
      type: String,
      required: true,
      default: 'Asia/Kolkata',
      trim: true,
    },
    claimIntervalHours: {
      type: Number,
      required: true,
      default: 24,
      min: 0,
    },
    missedWindowHours: {
      type: Number,
      required: true,
      default: 48,
      min: 1,
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

export const StreakConfig = mongoose.model('StreakConfig', streakConfigSchema);
