import { Flame, Lock } from 'lucide-react';
import { Day7CrownImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function UltimateReward({ reward, currentStreak = 1, showDesktopBadge = false }) {
  const amount = reward?.amount ? `₹${Math.round(Number(reward.amount))}` : '₹5';
  const subtitle = reward?.title || 'Amazon Gift Card';

  return (
    <div className={styles.ultimateRewardCard}>
      {showDesktopBadge && (
        <div className={styles.desktopStreakBadge}>
          <Flame size={16} className={styles.streakFlameIcon} />
          <span>{currentStreak} Day Streak</span>
          <span className={styles.streakBadgeSub}>Keep it going!</span>
        </div>
      )}

      <div className={styles.ultimateCardContent}>
        <div className={styles.crownGlowWrap}>
          <img src={Day7CrownImg} alt="Ultimate Reward Crown" className={styles.ultimateCrownImg} />
        </div>

        <div className={styles.ultimateInfo}>
          <span className={styles.ultimateTitle}>Ultimate Reward</span>
          <div className={styles.ultimateAmount}>{amount}</div>
          <div className={styles.amazonBrandWrap}>
            <span className={styles.amazonLetter}>a</span>
            <span className={styles.amazonBrandName}>{subtitle.includes('Amazon') ? subtitle : `${subtitle} (Amazon)`}</span>
          </div>
        </div>

        <div className={styles.ultimateLockWrap}>
          <Lock size={15} className={styles.ultimateLockIcon} />
          <span>Unlock on Day 7</span>
        </div>
      </div>
    </div>
  );
}

export default UltimateReward;
