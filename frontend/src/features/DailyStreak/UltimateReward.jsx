import { Flame, Lock, Sparkles, Trophy } from 'lucide-react';
import { Day7CrownImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function UltimateReward({ reward, currentStreak = 1, showDesktopBadge = false }) {
  const amount = reward?.amount ? `₹${Math.round(Number(reward.amount))}` : '₹5';
  const subtitle = reward?.title || 'Amazon Gift Card';

  return (
    <div className={styles.ultimateRewardCard}>
      <div className={styles.ultimateCardGlowAura} />

      {showDesktopBadge && (
        <div className={styles.desktopStreakBadge}>
          <div className={styles.flameHaloRing}>
            <Flame size={15} strokeWidth={2.2} className={styles.streakFlameIcon} />
          </div>
          <span className={styles.desktopStreakTitle}>{currentStreak} Day Streak</span>
          <span className={styles.streakBadgeSub}>Keep it going! 🔥</span>
        </div>
      )}

      <div className={styles.ultimateCardContent}>
        <div className={styles.crownGlowWrap}>
          <div className={styles.crownSunburstHalo} />
          <img src={Day7CrownImg} alt="Ultimate Reward Crown" className={styles.ultimateCrownImg} />
        </div>

        <div className={styles.ultimateInfo}>
          <div className={styles.ultimateKicker}>
            <Trophy size={13} strokeWidth={2.2} className={styles.kickerTrophy} />
            <span>DAY 7 GRAND PRIZE</span>
          </div>
          <div className={styles.ultimateAmount}>{amount}</div>
          <div className={styles.amazonBadgePill}>
            <div className={styles.amazonLogoSquare}>
              <span className={styles.amazonLetterA}>a</span>
            </div>
            <span className={styles.amazonBrandText}>
              {subtitle.includes('Amazon') ? subtitle : `${subtitle} (Amazon)`}
            </span>
          </div>
        </div>

        <div className={styles.ultimateLockWrap}>
          <Lock size={14} strokeWidth={2.2} className={styles.ultimateLockIcon} />
          <span>Unlock on Day 7</span>
        </div>
      </div>
    </div>
  );
}

export default UltimateReward;
