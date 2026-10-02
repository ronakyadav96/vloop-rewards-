import { Calendar, CheckSquare, Sparkles, Star } from 'lucide-react';
import styles from './DailyStreak.module.css';

function StreakStats({ status }) {
  const totalRewards = status?.totalRewards ?? 7;
  const checkedInCount = status?.checkedInCount ?? (typeof status?.checkedIn === 'number' ? status.checkedIn : status?.checkedIn ? 1 : 0);
  const nextRewardTitle = status?.nextReward?.title ?? '+10 VEs';

  return (
    <div className={styles.statsContainer}>
      {/* 1. Total Rewards */}
      <div className={`${styles.statCard} ${styles.statCardPurple}`}>
        <div className={styles.statIconWrap}>
          <Calendar size={17} className={styles.statIconPurple} />
        </div>
        <div className={styles.statTextWrap}>
          <span className={styles.statTitle}>Total Rewards</span>
          <strong className={styles.statNumber}>{totalRewards}</strong>
        </div>
      </div>

      {/* 2. Checked In */}
      <div className={`${styles.statCard} ${styles.statCardGreen}`}>
        <div className={styles.statIconWrap}>
          <div className={styles.checkBadgeSquare}>
            <CheckSquare size={17} className={styles.statIconGreen} />
          </div>
        </div>
        <div className={styles.statTextWrap}>
          <span className={styles.statTitle}>Checked In</span>
          <strong className={styles.statNumber}>{checkedInCount}</strong>
        </div>
      </div>

      {/* 3. Next Reward */}
      <div className={`${styles.statCard} ${styles.statCardGold}`}>
        <div className={styles.statIconWrap}>
          <div className={styles.starCircle}>
            <Star size={16} fill="currentColor" className={styles.statIconGold} />
          </div>
        </div>
        <div className={styles.statTextWrap}>
          <span className={styles.statTitle}>Next Reward</span>
          <strong className={styles.statNumber}>{nextRewardTitle}</strong>
        </div>
      </div>
    </div>
  );
}

export default StreakStats;
