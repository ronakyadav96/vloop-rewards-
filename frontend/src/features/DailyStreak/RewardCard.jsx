import { Check, ChevronRight, Lock } from 'lucide-react';
import {
  Day4BoxImg,
  Day5AmazonImg,
  Day7CrownImg,
  VEsCoinImg,
} from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function getCardImage(dayNumber, rewardType) {
  if (dayNumber === 7) return Day7CrownImg;
  if (dayNumber === 4) return Day4BoxImg;
  if (dayNumber === 5) return Day5AmazonImg;
  return VEsCoinImg;
}

function getBadge(dayNumber, state) {
  if (state === 'CLAIMED') {
    return { type: 'check' };
  }
  if (state === 'TODAY' || state === 'AVAILABLE') {
    return { type: 'text', label: 'Today', className: styles.badgeToday };
  }
  if (dayNumber === 5) {
    return { type: 'text', label: 'Gift Card', className: styles.badgeGiftCard };
  }
  if (dayNumber === 6) {
    return { type: 'text', label: 'Coin', className: styles.badgeCoin };
  }
  if (dayNumber === 7) {
    return { type: 'text', label: 'VIP', className: styles.badgeVip };
  }
  return null;
}

function getValueColorClass(dayNumber, state) {
  if (state === 'CLAIMED' || dayNumber === 1) return styles.valueGreen;
  if (dayNumber === 2 || dayNumber === 7 || state === 'TODAY' || state === 'AVAILABLE') return styles.valueGold;
  return styles.valuePurple;
}

function RewardCard({ card, countdown, onSelect }) {
  const day = card.day;
  const state = card.state; // 'CLAIMED' | 'AVAILABLE' | 'TODAY' | 'LOCKED' | 'MISSED'
  const isActionable = state === 'AVAILABLE' || state === 'TODAY';
  const isClaimed = state === 'CLAIMED';
  const badge = getBadge(day, state);
  const cardImg = getCardImage(day, card.reward?.rewardType);
  const valueColorClass = getValueColorClass(day, state);

  // Values and subtitles
  const amountStr = card.reward?.amount ? Math.round(Number(card.reward.amount)) : '';
  const displayValue = card.reward?.rewardType === 'GIFT_CARD'
    ? `₹${amountStr}`
    : `+${amountStr}`;

  const subtitle = card.reward?.rewardType === 'GIFT_CARD'
    ? 'Amazon Gift Card'
    : `${amountStr} VEs`;

  const title = day === 7 ? 'Ultimate Reward' : 'Daily Reward';

  return (
    <article
      className={`${styles.rewardCard} ${isActionable ? styles.cardActive : ''} ${isClaimed ? styles.cardClaimed : ''}`}
      aria-label={`Day ${day}: ${title}`}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardDayLabel}>Day {day}</span>

        {badge && badge.type === 'check' && (
          <div className={styles.cardCheckCircle}>
            <Check size={13} strokeWidth={3} />
          </div>
        )}

        {badge && badge.type === 'text' && (
          <span className={`${styles.cardBadgePill} ${badge.className}`}>
            {badge.label}
          </span>
        )}
      </div>

      <div className={styles.cardImgWrap}>
        <img
          src={cardImg}
          alt={`Day ${day} reward`}
          className={`${styles.cardImg} ${isClaimed ? styles.claimedImg : ''} ${!isActionable && !isClaimed ? styles.lockedImg : ''}`}
        />
      </div>

      <div className={styles.cardTextContent}>
        <span className={styles.cardRewardTitle}>{title}</span>
        <div className={`${styles.cardHighlightValue} ${valueColorClass}`}>
          {displayValue}
        </div>
        <span className={styles.cardSubtitle}>{subtitle}</span>
      </div>

      <div className={styles.cardActionWrap}>
        {isClaimed ? (
          <button className={styles.btnClaimed} type="button" disabled>
            <Check size={14} strokeWidth={2.5} />
            <span>Claimed</span>
          </button>
        ) : isActionable ? (
          <button
            className={styles.btnClaimNow}
            type="button"
            onClick={() => onSelect(card)}
          >
            <span>Claim Reward</span>
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        ) : (
          <button className={styles.btnLocked} type="button" disabled>
            <Lock size={13} />
            <span>{countdown && card.nextClaimAt ? countdown : 'Locked'}</span>
          </button>
        )}
      </div>
    </article>
  );
}

export default RewardCard;
