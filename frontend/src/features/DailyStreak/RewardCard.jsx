import { Check, ChevronRight, Clock, Flame, Gift, Lock, Sparkles, Trophy } from 'lucide-react';
import {
  Day4BoxImg,
  Day5AmazonImg,
  Day7CrownImg,
  VEsCoinImg,
} from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function getCardImage(dayNumber) {
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
    return { type: 'text', label: 'Today', className: styles.badgeToday, icon: Flame };
  }
  if (dayNumber === 5) {
    return { type: 'text', label: 'Gift Card', className: styles.badgeGiftCard, icon: Gift };
  }
  if (dayNumber === 6) {
    return { type: 'text', label: 'Coin', className: styles.badgeCoin, icon: Sparkles };
  }
  if (dayNumber === 7) {
    return { type: 'text', label: 'VIP', className: styles.badgeVip, icon: Trophy };
  }
  return null;
}

function getValueColorClass(dayNumber, state) {
  if (state === 'CLAIMED') return styles.valueGreen;
  if (state === 'TODAY' || state === 'AVAILABLE' || dayNumber === 2) return styles.valueGold;
  if (dayNumber === 7) return styles.valueGold;
  return styles.valueNormal;
}

function RewardCard({ card, countdown, onSelect }) {
  const day = card.day;
  const state = card.state; // 'CLAIMED' | 'AVAILABLE' | 'TODAY' | 'LOCKED' | 'MISSED'
  const isActionable = state === 'AVAILABLE' || state === 'TODAY';
  const isClaimed = state === 'CLAIMED';
  const isDay4 = day === 4;
  const isDay7 = day === 7;

  const badge = getBadge(day, state);
  const cardImg = getCardImage(day);
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
      className={`${styles.rewardCard} ${isActionable ? styles.cardActive : ''} ${
        isClaimed ? styles.cardClaimed : ''
      } ${isDay4 ? styles.cardMilestone4 : ''} ${isDay7 ? styles.cardMilestone7 : ''}`}
      aria-label={`Day ${day}: ${title}`}
    >
      {/* Ambient Radial Glow Effect */}
      <div className={styles.cardAuraGlow} />

      {/* Card Header (Day Number + Badge) */}
      <div className={styles.cardHeader}>
        <span className={styles.cardDayLabel}>Day {day}</span>

        {badge && badge.type === 'check' && (
          <div className={styles.cardCheckCircle} title="Claimed">
            <Check size={12} strokeWidth={3} />
          </div>
        )}

        {badge && badge.type === 'text' && (
          <span className={`${styles.cardBadgePill} ${badge.className}`}>
            {badge.icon && <badge.icon size={10} className={styles.badgeIcon} />}
            {badge.label}
          </span>
        )}
      </div>

      {/* Card Artwork with Pedestal Halo */}
      <div className={styles.cardImgWrap}>
        <div className={styles.cardPedestalHalo} />
        <img
          src={cardImg}
          alt={`Day ${day} reward`}
          className={`${styles.cardImg} ${isClaimed ? styles.claimedImg : ''} ${
            !isActionable && !isClaimed ? styles.lockedImg : ''
          }`}
        />
      </div>

      {/* Card Value Content */}
      <div className={styles.cardTextContent}>
        <span className={styles.cardRewardTitle}>{title}</span>
        <div className={`${styles.cardHighlightValue} ${valueColorClass}`}>
          {displayValue}
        </div>
        <span className={styles.cardSubtitle}>{subtitle}</span>
      </div>

      {/* Card Action Button */}
      <div className={styles.cardActionWrap}>
        {isClaimed ? (
          <button className={styles.btnClaimed} type="button" disabled>
            <Check size={13} strokeWidth={2.8} />
            <span>Claimed</span>
          </button>
        ) : isActionable ? (
          <button
            className={styles.btnClaimNow}
            type="button"
            onClick={() => onSelect(card)}
          >
            <span>Claim Reward</span>
            <ChevronRight size={14} strokeWidth={2.8} />
          </button>
        ) : (
          <button className={styles.btnLocked} type="button" disabled>
            {countdown && card.nextClaimAt ? (
              <Clock size={12} strokeWidth={2.2} className={styles.btnLockSvg} />
            ) : (
              <Lock size={12} strokeWidth={2.2} className={styles.btnLockSvg} />
            )}
            <span>{countdown && card.nextClaimAt ? countdown : 'Locked'}</span>
          </button>
        )}
      </div>
    </article>
  );
}

export default RewardCard;
