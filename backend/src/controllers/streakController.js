import { StreakConfig } from '../models/StreakConfig.js';
import { StreakReward } from '../models/StreakReward.js';

export async function getActiveStreakConfig(req, res, next) {
  try {
    const config = await StreakConfig.findOne({ active: true }).sort({ createdAt: 1 }).lean();

    if (!config) {
      return res.status(404).json({ message: 'No active streak configuration found' });
    }

    const rewards = await StreakReward.find({ configId: config._id, active: true })
      .sort({ dayNumber: 1 })
      .lean();

    return res.json({
      config: {
        id: config._id,
        key: config.key,
        title: config.title,
        cycleLength: config.cycleLength,
        timezone: config.timezone,
        metadata: config.metadata,
      },
      rewards: rewards.map((reward) => ({
        id: reward._id,
        dayNumber: reward.dayNumber,
        rewardType: reward.rewardType,
        currency: reward.currency,
        amount: reward.amount.toString(),
        title: reward.title,
        description: reward.description,
        assetType: reward.assetType,
        metadata: reward.metadata,
      })),
    });
  } catch (error) {
    return next(error);
  }
}
