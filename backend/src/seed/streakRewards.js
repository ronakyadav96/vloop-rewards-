import 'dotenv/config';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { StreakConfig } from '../models/StreakConfig.js';
import { StreakReward } from '../models/StreakReward.js';

const configDefinition = {
  key: 'default-seven-day',
  title: 'VELoop Daily Streak',
  cycleLength: 7,
  timezone: 'Asia/Kolkata',
  active: true,
  metadata: { seededBy: 'part-1-development-seed' },
};

const rewardDefinitions = [
  { dayNumber: 1, rewardType: 'VE', currency: 'VE', amount: '5', title: '+5 VEs', description: 'Earn 5 VEs', assetType: 'wallet_credit' },
  { dayNumber: 2, rewardType: 'VE', currency: 'VE', amount: '10', title: '+10 VEs', description: 'Earn 10 VEs', assetType: 'wallet_credit' },
  { dayNumber: 3, rewardType: 'VE', currency: 'VE', amount: '15', title: '+15 VEs', description: 'Earn 15 VEs', assetType: 'wallet_credit' },
  { dayNumber: 4, rewardType: 'GIFT_CARD', currency: 'INR', amount: '1', title: '₹1 Amazon Gift Card', description: 'Receive a ₹1 Amazon Gift Card', assetType: 'amazon_gift_card' },
  { dayNumber: 5, rewardType: 'GIFT_CARD', currency: 'INR', amount: '2', title: '₹2 Amazon Gift Card', description: 'Receive a ₹2 Amazon Gift Card', assetType: 'amazon_gift_card' },
  { dayNumber: 6, rewardType: 'VE', currency: 'VE', amount: '30', title: '+30 VEs', description: 'Earn 30 VEs', assetType: 'wallet_credit' },
  { dayNumber: 7, rewardType: 'GIFT_CARD', currency: 'INR', amount: '5', title: '₹5 Amazon Gift Card', description: 'Receive a ₹5 Amazon Gift Card', assetType: 'amazon_gift_card' },
];

async function seed() {
  if (process.env.SEED_STREAK_REWARDS !== 'true') {
    console.log('Seed skipped: set SEED_STREAK_REWARDS=true to enable it.');
    return;
  }

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    throw new Error('Production seed is blocked. Set ALLOW_PRODUCTION_SEED=true only after review.');
  }

  await connectDatabase();

  let config = await StreakConfig.findOne({ key: configDefinition.key });
  if (!config) {
    config = await StreakConfig.create(configDefinition);
    console.log(`Created streak config: ${config.key}`);
  } else {
    console.log(`Existing streak config preserved: ${config.key}`);
  }

  let created = 0;
  for (const reward of rewardDefinitions) {
    const existing = await StreakReward.exists({ configId: config._id, dayNumber: reward.dayNumber });
    if (existing) {
      continue;
    }

    await StreakReward.create({ ...reward, configId: config._id, active: true, metadata: {} });
    created += 1;
  }

  console.log(`Seed complete: ${created} missing reward(s) created; existing rewards preserved.`);
}

try {
  await seed();
} catch (error) {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
