const reward = (day, rewardType, currency, amount, title, description, state, assetType) => ({
  day,
  reward: { day, rewardType, currency, amount, title, description, assetType, metadata: {} },
  state,
  claimStatus: state === 'CLAIMED' ? 'SUCCESS' : null,
  fulfillmentStatus: rewardType === 'GIFT_CARD' ? 'PENDING' : 'NOT_REQUIRED',
  claimedAt: state === 'CLAIMED' ? '2026-09-15T08:00:00.000Z' : null,
  nextClaimAt: state === 'LOCKED' && day === 3 ? '2026-09-17T08:00:00.000Z' : null,
});

export const mockStreakResponse = {
  success: true,
  serverTime: '2026-09-16T08:00:00.000Z',
  currentStreak: 2,
  currentDay: 3,
  checkedIn: true,
  totalRewards: 2,
  nextClaimAt: '2026-09-16T08:00:00.000Z',
  streakStatus: 'ACTIVE',
  resetOccurred: false,
  cycle: { id: 'preview-cycle', number: 1, startedAt: '2026-09-14T08:00:00.000Z', lastClaimAt: '2026-09-15T08:00:00.000Z' },
  rewardConfiguration: { id: 'preview-config', key: 'preview-seven-day', title: 'VELoop Daily Streak', cycleLength: 7, timezone: 'Asia/Kolkata' },
  cards: [
    reward(1, 'VE', 'VE', '5', '+5 VEs', 'Wallet credit', 'CLAIMED', 'wallet_credit'),
    reward(2, 'VE', 'VE', '10', '+10 VEs', 'Wallet credit', 'CLAIMED', 'wallet_credit'),
    reward(3, 'VE', 'VE', '15', '+15 VEs', 'Wallet credit', 'AVAILABLE', 'wallet_credit'),
    reward(4, 'GIFT_CARD', 'INR', '1', '₹1 Amazon Gift Card', 'Pending fulfillment', 'LOCKED', 'amazon_gift_card'),
    reward(5, 'GIFT_CARD', 'INR', '2', '₹2 Amazon Gift Card', 'Pending fulfillment', 'LOCKED', 'amazon_gift_card'),
    reward(6, 'VE', 'VE', '30', '+30 VEs', 'Wallet credit', 'LOCKED', 'wallet_credit'),
    reward(7, 'GIFT_CARD', 'INR', '5', '₹5 Amazon Gift Card', 'Pending fulfillment', 'LOCKED', 'amazon_gift_card'),
  ],
  nextReward: { day: 3, rewardType: 'VE', currency: 'VE', amount: '15', title: '+15 VEs', description: 'Wallet credit', assetType: 'wallet_credit', metadata: {} },
  wallet: { currency: 'VE', balance: '15' },
};

export function isDemoMode() {
  return import.meta.env.VITE_STREAK_DEMO === 'true';
}
