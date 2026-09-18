import { randomUUID } from 'node:crypto';
import { StreakClaim } from '../models/StreakClaim.js';
import { StreakCycle } from '../models/StreakCycle.js';
import { getActiveRewardSet, serializeReward, snapshotReward } from './reward.service.js';
import { writeAudit } from './audit.service.js';
import { getWalletBalance } from './wallet.service.js';
import { creditVE } from './wallet.service.js';
import { withMongoTransaction } from './transaction.service.js';
import { DomainError, isDuplicateKeyError } from '../utils/errors.js';
import { addMilliseconds, CLAIM_WAIT_MS, getDateKey, MISSED_WINDOW_MS } from '../utils/date.js';

function queryWithSession(query, session) {
  return session ? query.session(session) : query;
}

async function createCycle({ userId, configId, cycleNumber, now, session }) {
  const [cycle] = await StreakCycle.create(
    [
      {
        userId,
        configId,
        cycleNumber,
        currentStreak: 0,
        nextDay: 1,
        status: 'ACTIVE',
        nextClaimAt: now,
      },
    ],
    { session }
  );
  return cycle;
}

async function findLatestCycle(userId, session) {
  return queryWithSession(
    StreakCycle.findOne({ userId }).sort({ cycleNumber: -1 }),
    session
  );
}

export async function ensureCurrentCycle({ userId, config, now, session }) {
  let cycle = await queryWithSession(
    StreakCycle.findOne({ userId, status: 'ACTIVE' }).sort({ cycleNumber: -1 }),
    session
  );

  if (cycle?.lastClaimAt && now.getTime() > cycle.lastClaimAt.getTime() + MISSED_WINDOW_MS) {
    cycle.status = 'RESET';
    cycle.resetAt = now;
    cycle.resetReason = 'MISSED_CLAIM_WINDOW';
    await cycle.save({ session });
    await writeAudit({
      event: 'STREAK_RESET',
      userId,
      cycleId: cycle._id,
      details: { reason: cycle.resetReason, missedDay: cycle.nextDay },
      session,
    });
    return createCycle({
      userId,
      configId: config._id,
      cycleNumber: cycle.cycleNumber + 1,
      now,
      session,
    });
  }

  if (cycle) {
    return cycle;
  }

  const latest = await findLatestCycle(userId, session);
  if (latest?.status === 'COMPLETED') {
    if (latest.nextClaimAt && now.getTime() < latest.nextClaimAt.getTime()) {
      return latest;
    }

    return createCycle({
      userId,
      configId: config._id,
      cycleNumber: latest.cycleNumber + 1,
      now,
      session,
    });
  }

  return createCycle({
    userId,
    configId: config._id,
    cycleNumber: (latest?.cycleNumber ?? 0) + 1,
    now,
    session,
  });
}

function serializeClaim(claim) {
  return {
    id: claim._id,
    cycleId: claim.cycleId,
    day: claim.dayNumber,
    status: claim.status,
    fulfillmentStatus: claim.fulfillmentStatus,
    reward: {
      day: claim.rewardSnapshot.dayNumber,
      rewardType: claim.rewardSnapshot.rewardType,
      currency: claim.rewardSnapshot.currency,
      amount: claim.rewardSnapshot.amount.toString(),
      title: claim.rewardSnapshot.title,
      description: claim.rewardSnapshot.description,
      assetType: claim.rewardSnapshot.assetType,
      metadata: claim.rewardSnapshot.metadata ?? {},
    },
    walletTransactionId: claim.walletTransactionId,
    claimedAt: claim.claimedAt,
  };
}

function buildCard({ reward, claim, cycle, now }) {
  if (claim) {
    return {
      day: reward.dayNumber,
      reward: serializeReward(reward),
      state: 'CLAIMED',
      claimStatus: claim.status,
      fulfillmentStatus: claim.fulfillmentStatus,
      claimedAt: claim.claimedAt,
      nextClaimAt: null,
    };
  }

  if (cycle.status === 'COMPLETED') {
    return {
      day: reward.dayNumber,
      reward: serializeReward(reward),
      state: 'CLAIMED',
      claimStatus: 'SUCCESS',
      fulfillmentStatus: reward.rewardType === 'GIFT_CARD' ? 'PENDING' : 'NOT_REQUIRED',
      claimedAt: null,
      nextClaimAt: null,
    };
  }

  const isActionable = reward.dayNumber === cycle.nextDay;
  const nextClaimAt = cycle.nextClaimAt ?? now;

  return {
    day: reward.dayNumber,
    reward: serializeReward(reward),
    state: isActionable && now >= nextClaimAt ? 'AVAILABLE' : isActionable ? 'LOCKED' : 'LOCKED',
    claimStatus: null,
    fulfillmentStatus: reward.rewardType === 'GIFT_CARD' ? 'PENDING' : 'NOT_REQUIRED',
    claimedAt: null,
    nextClaimAt: isActionable ? nextClaimAt : null,
  };
}

function buildStatus({ userId, config, rewards, cycle, claims, walletBalance, now, resetOccurred, resetInfo }) {
  const claimsByDay = new Map(claims.map((claim) => [claim.dayNumber, claim]));
  const cards = rewards.map((reward) => buildCard({ reward, claim: claimsByDay.get(reward.dayNumber), cycle, now }));
  const currentDay = cycle.status === 'COMPLETED' ? 1 : cycle.nextDay;
  const nextReward = rewards.find((reward) => reward.dayNumber === currentDay) ?? null;
  const checkedIn = claims.some(
    (claim) => claim.claimedAt && getDateKey(claim.claimedAt, config.timezone) === getDateKey(now, config.timezone)
  );

  return {
    success: true,
    serverTime: now.toISOString(),
    currentStreak: cycle.currentStreak,
    currentDay,
    checkedIn,
    totalRewards: claims.length,
    nextClaimAt: cycle.nextClaimAt?.toISOString() ?? null,
    streakStatus: cycle.status,
    resetOccurred,
    cycle: {
      id: cycle._id,
      number: cycle.cycleNumber,
      startedAt: cycle.createdAt,
      lastClaimAt: cycle.lastClaimAt,
    },
    rewardConfiguration: {
      id: config._id,
      key: config.key,
      title: config.title,
      cycleLength: config.cycleLength,
      timezone: config.timezone,
    },
    cards,
    nextReward: nextReward ? serializeReward(nextReward) : null,
    wallet: { currency: 'VE', balance: walletBalance },
    ...(resetInfo ? { lastReset: resetInfo } : {}),
  };
}

export async function getDailyStreakStatus(userId) {
  const now = new Date();

  return withMongoTransaction(async (session) => {
    const { config, rewards } = await getActiveRewardSet(session);
    const latestBefore = await findLatestCycle(userId, session);
    const cycle = await ensureCurrentCycle({ userId, config, now, session });
    const resetOccurred = Boolean(
      latestBefore?.status === 'ACTIVE' && cycle._id.toString() !== latestBefore._id.toString()
    );
    const resetCycle = resetOccurred
      ? await queryWithSession(
          StreakCycle.findOne({ userId, status: 'RESET' }).sort({ resetAt: -1 }),
          session
        )
      : null;
    const claims = await queryWithSession(
      StreakClaim.find({ userId, cycleId: cycle._id }).sort({ dayNumber: 1 }),
      session
    );
    const walletBalance = await getWalletBalance(userId, session);

    return buildStatus({
      userId,
      config,
      rewards,
      cycle,
      claims,
      walletBalance,
      now,
      resetOccurred,
      resetInfo: resetCycle
        ? {
            state: 'MISSED',
            cycleId: resetCycle._id,
            missedDay: resetCycle.nextDay,
            resetAt: resetCycle.resetAt,
          }
        : null,
    });
  });
}

export async function claimDailyStreak({ userId, requestedDay, idempotencyKey: suppliedKey }) {
  const now = new Date();
  const idempotencyKey = suppliedKey || randomUUID();

  if (idempotencyKey.length > 128) {
    throw new DomainError('INVALID_IDEMPOTENCY_KEY', 'The idempotency key is too long', 422);
  }

  try {
    return await withMongoTransaction(async (session) => {
      const { config, rewardByDay } = await getActiveRewardSet(session);
      const existingByKey = await queryWithSession(
        StreakClaim.findOne({ userId, idempotencyKey }),
        session
      );

      if (existingByKey) {
        return {
          success: true,
          replayed: true,
          serverTime: now.toISOString(),
          claim: serializeClaim(existingByKey),
        };
      }

      const cycle = await ensureCurrentCycle({ userId, config, now, session });

      if (cycle.status === 'COMPLETED' && cycle.nextClaimAt && now < cycle.nextClaimAt) {
        throw new DomainError('CYCLE_LOCKED', 'The next streak cycle is not available yet', 409, {
          nextClaimAt: cycle.nextClaimAt,
        });
      }

      if (cycle.status !== 'ACTIVE') {
        throw new DomainError('STREAK_NOT_ACTIONABLE', 'The streak is not currently claimable', 409);
      }

      const actualDay = cycle.nextDay;
      if (requestedDay !== undefined && requestedDay !== actualDay) {
        throw new DomainError('DAY_MISMATCH', 'The requested day is not the actual claimable day', 409, {
          currentDay: actualDay,
        });
      }

      if (cycle.nextClaimAt && now < cycle.nextClaimAt) {
        throw new DomainError('CLAIM_LOCKED', 'The next reward is still locked', 409, {
          nextClaimAt: cycle.nextClaimAt,
        });
      }

      if (actualDay > 1) {
        const previousClaim = await queryWithSession(
          StreakClaim.findOne({
            cycleId: cycle._id,
            dayNumber: actualDay - 1,
            status: { $in: ['SUCCESS', 'PENDING_FULFILLMENT'] },
          }),
          session
        );
        if (!previousClaim) {
          throw new DomainError('SEQUENCE_INVALID', 'The previous streak day has not been completed', 409);
        }
      }

      const duplicateClaim = await queryWithSession(
        StreakClaim.findOne({ cycleId: cycle._id, dayNumber: actualDay }),
        session
      );
      if (duplicateClaim) {
        throw new DomainError('DUPLICATE_CLAIM', 'This streak day has already been claimed', 409);
      }

      const reward = rewardByDay.get(actualDay);
      if (!reward) {
        throw new DomainError('REWARD_UNAVAILABLE', 'The configured reward is unavailable', 503);
      }

      const isVE = reward.rewardType === 'VE';
      if (isVE && reward.currency !== 'VE') {
        throw new DomainError('REWARD_CURRENCY_INVALID', 'The VE reward configuration is invalid', 503);
      }

      const [claim] = await StreakClaim.create(
        [
          {
            userId,
            cycleId: cycle._id,
            configId: config._id,
            rewardId: reward._id,
            dayNumber: actualDay,
            status: 'PROCESSING',
            fulfillmentStatus: isVE ? 'NOT_REQUIRED' : 'PENDING',
            rewardSnapshot: snapshotReward(reward),
            idempotencyKey,
            claimedAt: now,
          },
        ],
        { session }
      );

      let walletTransactionId = null;
      let walletBalance = null;
      let claimStatus = 'PENDING_FULFILLMENT';

      if (isVE) {
        const walletResult = await creditVE({
          userId,
          amount: reward.amount,
          claimId: claim._id,
          session,
        });
        walletTransactionId = walletResult.transaction._id;
        walletBalance = walletResult.wallet.veBalance.toString();
        claimStatus = 'SUCCESS';
      }

      claim.status = claimStatus;
      claim.walletTransactionId = walletTransactionId;
      await claim.save({ session });

      const isFinalDay = actualDay === config.cycleLength;
      cycle.currentStreak = actualDay;
      cycle.lastClaimAt = now;
      cycle.nextClaimAt = addMilliseconds(now, CLAIM_WAIT_MS);
      cycle.nextDay = isFinalDay ? 1 : actualDay + 1;
      cycle.status = isFinalDay ? 'COMPLETED' : 'ACTIVE';
      await cycle.save({ session });

      await writeAudit({
        event: 'STREAK_CLAIM_SUCCESS',
        userId,
        cycleId: cycle._id,
        claimId: claim._id,
        details: { day: actualDay, rewardType: reward.rewardType, status: claimStatus },
        session,
      });

      return {
        success: true,
        replayed: false,
        serverTime: now.toISOString(),
        nextClaimAt: cycle.nextClaimAt.toISOString(),
        claim: serializeClaim(claim),
        wallet: isVE ? { currency: 'VE', balance: walletBalance } : null,
      };
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new DomainError('DUPLICATE_CLAIM', 'This streak day has already been claimed', 409);
    }
    throw error;
  }
}

export async function getStreakHistory(userId, requestedLimit = 50) {
  const limit = Math.min(Math.max(Number(requestedLimit) || 50, 1), 100);
  const claims = await StreakClaim.find({ userId }).sort({ claimedAt: -1 }).limit(limit).lean();

  return {
    success: true,
    claims: claims.map(serializeClaim),
    count: claims.length,
  };
}
