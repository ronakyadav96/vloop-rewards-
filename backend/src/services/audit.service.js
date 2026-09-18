import { AuditLog } from '../models/AuditLog.js';

export async function writeAudit({ event, userId, cycleId = null, claimId = null, details = {}, session }) {
  const [audit] = await AuditLog.create(
    [{ event, userId, cycleId, claimId, details }],
    session ? { session } : undefined
  );
  return audit;
}

export async function writeRejectedAudit(data) {
  try {
    await writeAudit(data);
  } catch (error) {
    console.error('Audit log write failed:', error.message);
  }
}

export const writeBestEffortAudit = writeRejectedAudit;
