import { writeBestEffortAudit } from '../services/audit.service.js';
import {
  claimDailyStreak,
  getDailyStreakStatus,
  getStreakHistory,
} from '../services/streak.service.js';
import { DomainError } from '../utils/errors.js';

function getRequestedDay(body) {
  if (body?.day === undefined || body?.day === null || body?.day === '') {
    return undefined;
  }

  const day = Number(body.day);
  if (!Number.isInteger(day) || day < 1) {
    throw new DomainError('INVALID_DAY', 'The requested day must be a positive integer', 422);
  }
  return day;
}

function getIdempotencyKey(body) {
  if (body?.idempotencyKey === undefined || body?.idempotencyKey === null) {
    return undefined;
  }

  if (typeof body.idempotencyKey !== 'string' || body.idempotencyKey.trim().length === 0) {
    throw new DomainError('INVALID_IDEMPOTENCY_KEY', 'The idempotency key must be a non-empty string', 422);
  }
  return body.idempotencyKey.trim();
}

export async function getDailyStreak(req, res, next) {
  try {
    const status = await getDailyStreakStatus(req.user.id);
    return res.json(status);
  } catch (error) {
    return next(error);
  }
}

export async function claimDailyStreakReward(req, res, next) {
  let requestedDay;
  let idempotencyKey;

  try {
    requestedDay = getRequestedDay(req.body);
    idempotencyKey = getIdempotencyKey(req.body);
  } catch (error) {
    return next(error);
  }

  await writeBestEffortAudit({
    event: 'STREAK_CLAIM_REQUEST',
    userId: req.user.id,
    details: { requestedDay: requestedDay ?? null, hasIdempotencyKey: Boolean(idempotencyKey) },
  });

  try {
    const result = await claimDailyStreak({
      userId: req.user.id,
      requestedDay,
      idempotencyKey,
    });
    return res.status(result.replayed ? 200 : 201).json(result);
  } catch (error) {
    const event = error.code === 'DUPLICATE_CLAIM' ? 'DUPLICATE_CLAIM' : 'STREAK_CLAIM_REJECTED';
    await writeBestEffortAudit({
      event,
      userId: req.user.id,
      details: { code: error.code ?? 'INTERNAL_ERROR', requestedDay: requestedDay ?? null },
    });
    return next(error);
  }
}

export async function getDailyStreakHistory(req, res, next) {
  try {
    const result = await getStreakHistory(req.user.id, req.query.limit);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

