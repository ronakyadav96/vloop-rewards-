import { Day5AmazonImg, Day7CrownImg, VEsCoinImg } from '../../assets/veloop/index.js';

// Pure presentation helpers. Every value shown on the page comes from the
// backend card / reward / claim snapshots passed in; nothing is invented here.

// `TODAY` is a legacy alias the backend documents but no longer emits.
export function isClaimable(card) {
  return card?.state === 'AVAILABLE' || card?.state === 'TODAY';
}

export function isGiftCardReward(reward) {
  return reward?.rewardType === 'GIFT_CARD';
}

function formatAmount(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return null;
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function currencySymbol(currency) {
  if (currency === 'INR') return '₹';
  return currency ? `${currency} ` : '';
}

/**
 * Returns display strings for a backend reward snapshot:
 *   amount: "+5" / "₹2"      unit: "VEs" / ""
 *   short:  "+5 VEs" / "₹2"  kind: "Wallet Credit" / "Amazon Gift Card"
 *   full:   backend title, e.g. "₹2 Amazon Gift Card"
 */
export function describeReward(reward) {
  if (!reward) return null;
  const amount = formatAmount(reward.amount);
  if (amount === null) return null;

  if (isGiftCardReward(reward)) {
    const kind = reward.assetType === 'amazon_gift_card' ? 'Amazon Gift Card' : 'Gift Card';
    const value = `${currencySymbol(reward.currency)}${amount}`;
    return { amount: value, unit: '', short: value, kind, full: reward.title || `${value} ${kind}` };
  }

  return {
    amount: `+${amount}`,
    unit: 'VEs',
    short: `+${amount} VEs`,
    kind: 'Wallet Credit',
    full: reward.title || `+${amount} VEs`,
  };
}

export function getRewardArt(reward, { isFinal = false } = {}) {
  if (isFinal) return Day7CrownImg;
  if (isGiftCardReward(reward)) return Day5AmazonImg;
  return VEsCoinImg;
}

export function formatRelativeTime(dateString) {
  if (!dateString) return null;
  const claimDate = new Date(dateString);
  if (Number.isNaN(claimDate.getTime())) return null;

  const diffMins = Math.floor(Math.max(0, Date.now() - claimDate.getTime()) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 2) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return claimDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
