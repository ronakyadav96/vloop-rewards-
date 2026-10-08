import { describeReward, formatRelativeTime, getRewardArt, isClaimable, isGiftCardReward } from './streakFormat.js';

/*
 * Turns the backend status/history into display-ready data shared by every
 * design version. Nothing here invents values: every field is read from the
 * backend response (or derived for display, e.g. counts and percentages).
 */

// `next` is the backend's actionable day still inside its 24h wait
// (LOCKED with a nextClaimAt).
export function variantOf(card) {
  if (card.state === 'CLAIMED') return 'claimed';
  if (card.state === 'MISSED') return 'missed';
  if (isClaimable(card)) return 'available';
  if (card.nextClaimAt) return 'next';
  return 'locked';
}

function parseBalance(wallet) {
  const value = Number(wallet?.balance);
  if (wallet?.balance === undefined || wallet?.balance === null || !Number.isFinite(value)) return null;
  return Math.round(value);
}

export function buildViewModel({ status, history, countdown, lastReset, wallet, user }) {
  const total = status.cards.length;

  const days = status.cards.map((card, index) => {
    const isFinal = index === total - 1;
    return {
      day: card.day,
      card,
      index,
      isFinal,
      variant: variantOf(card),
      reward: describeReward(card.reward),
      art: getRewardArt(card.reward, { isFinal }),
      kind: isFinal ? 'final' : isGiftCardReward(card.reward) ? 'gift' : 'coin',
      countdown: card.nextClaimAt ? countdown : null,
    };
  });

  const claimedCount = days.filter((d) => d.variant === 'claimed').length;
  const source = history.length > 0 ? history : status.cards.filter((card) => card.state === 'CLAIMED');
  const finalDay = days[total - 1]?.day;

  const activity = source.slice(0, 5).map((item) => {
    const day = item.day ?? item.reward?.day;
    return {
      key: item.id || `${item.cycleId ?? 'card'}-${day}`,
      day,
      reward: describeReward(item.reward),
      art: getRewardArt(item.reward, { isFinal: day === finalDay }),
      when: formatRelativeTime(item.claimedAt),
      claimedAt: item.claimedAt,
      pending: item.status === 'PENDING_FULFILLMENT' || item.claimStatus === 'PENDING_FULFILLMENT',
    };
  });

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Member';

  return {
    days,
    total,
    claimedCount,
    percent: total ? Math.round((claimedCount / total) * 100) : 0,
    claimable: days.find((d) => d.variant === 'available') || null,
    upcoming: days.find((d) => d.variant === 'next') || null,
    final: days[total - 1] || null,
    completed: status.streakStatus === 'COMPLETED',
    countdown,
    currentStreak: status.currentStreak ?? 0,
    totalRewards: status.totalRewards ?? total,
    checkedIn: status.checkedInCount ?? status.checkedIn ?? 0,
    nextReward: describeReward(status.nextReward),
    lastReset,
    balance: parseBalance(wallet),
    currency: wallet?.currency === 'VE' ? 'VEs' : wallet?.currency || 'VEs',
    activity,
    user: { name: userName, initial: userName.charAt(0).toUpperCase(), email: user?.email || null },
  };
}

export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV'];
