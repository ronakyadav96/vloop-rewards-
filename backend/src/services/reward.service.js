import { StreakConfig } from '../models/StreakConfig.js';
import { StreakReward } from '../models/StreakReward.js';
import { DomainError } from '../utils/errors.js';

export async function getActiveRewardSet(session) {
  const config = await StreakConfig.findOne({ active: true }).sort({ createdAt: 1 }).session(session).lean();

  if (!config) {
    throw new DomainError('STREAK_CONFIG_UNAVAILABLE', 'No active streak configuration is available', 503);
  }


  const rewards = await StreakReward.find({ configId: config._id, active: true })
    .sort({ dayNumber: 1 })
    .session(session)
    .lean();

  if (rewards.length !== config.cycleLength) {
    throw new DomainError('STREAK_CONFIG_INCOMPLETE', 'The active streak configuration is incomplete', 503);
  }

  const rewardByDay = new Map(rewards.map((reward) => [reward.dayNumber, reward]));
  for (let day = 1; day <= config.cycleLength; day += 1) {
    if (!rewardByDay.has(day)) {
      throw new DomainError('STREAK_CONFIG_INCOMPLETE', 'The active streak configuration is incomplete', 503);
    }
  }

  return { config, rewards, rewardByDay };
}

export function serializeReward(reward) {
  return {
    id: reward._id,
    day: reward.dayNumber,
    rewardType: reward.rewardType,
    currency: reward.currency,
    amount: reward.amount.toString(),
    title: reward.title,
    description: reward.description,
    assetType: reward.assetType,
    metadata: reward.metadata ?? {},
  };
}

export function snapshotReward(reward) {
  return {
    dayNumber: reward.dayNumber,
    rewardType: reward.rewardType,
    currency: reward.currency,
    amount: reward.amount,
    title: reward.title,
    description: reward.description,
    assetType: reward.assetType,
    metadata: reward.metadata ?? {},
  };
}
