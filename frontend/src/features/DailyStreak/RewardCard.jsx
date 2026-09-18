import { Check, Crown, Flame, Gift, LockKeyhole, Sparkles } from 'lucide-react';
import styles from './DailyStreak.module.css';

const stateLabel = {
  LOCKED: 'Locked',
  AVAILABLE: 'Available now',
  TODAY: 'Today',
  CLAIMED: 'Claimed',
  MISSED: 'Missed',
};

function RewardArtwork({ reward, day, state }) {
  if (state === 'CLAIMED') return <span className={styles.claimedArtwork}><Check size={22} strokeWidth={3} /></span>;
  if (reward?.rewardType === 'GIFT_CARD') return <span className={styles.giftArtwork}><Gift size={25} /></span>;
  if (day === 7) return <span className={styles.crownArtworkSmall}><Crown size={25} /></span>;
  return <span className={styles.flameArtwork}><Flame size={25} fill="currentColor" /></span>;
}

function RewardCard({ card, countdown, onSelect }) {
  const state = card?.state ?? 'LOCKED';
  const reward = card?.reward;
  const isAvailable = state === 'AVAILABLE' || state === 'TODAY';

  return (
    <article className={`${styles.rewardCard} ${styles[`state${state}`]}`}>
      <div className={styles.cardTopline}>
        <span className={styles.dayLabel}>DAY {card.day}</span>
        <span className={styles.stateLabel}>
          {state === 'LOCKED' ? <LockKeyhole size={12} /> : state === 'CLAIMED' ? <Check size={12} /> : <Sparkles size={12} />}
          {stateLabel[state] ?? state}
        </span>
      </div>
      <div className={styles.rewardArtworkWrap}><RewardArtwork reward={reward} day={card.day} state={state} /></div>
      <div className={styles.rewardCardBody}>
        <h3>{reward?.title ?? 'Reward'}</h3>
        <p>{reward?.description ?? 'Reward details are loading.'}</p>
      </div>
      <button className={styles.cardAction} type="button" onClick={() => onSelect(card)} disabled={!isAvailable}>
        {state === 'CLAIMED' ? 'Claimed' : state === 'LOCKED' && countdown ? `Unlocks in ${countdown}` : state === 'LOCKED' ? 'Locked' : 'Claim reward'}
      </button>
    </article>
  );
}

export default RewardCard;
