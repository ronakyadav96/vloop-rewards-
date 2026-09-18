import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      enum: [
        'STREAK_CLAIM_REQUEST',
        'STREAK_CLAIM_SUCCESS',
        'STREAK_CLAIM_REJECTED',
        'STREAK_RESET',
        'DUPLICATE_CLAIM',
        'INVALID_CLAIM',
      ],
      required: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    cycleId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreakCycle', default: null },
    claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreakClaim', default: null },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

