import { CalendarCheck2, Gift, TimerReset } from 'lucide-react';
import styles from './DailyStreak.module.css';

function StreakStats({ status }) {
  const stats = [
    { label: 'Total rewards', value: status?.totalRewards ?? '—', icon: Gift, tone: 'gold' },
    { label: 'Checked in', value: status?.checkedIn ? 'Yes' : 'Not yet', icon: CalendarCheck2, tone: 'green' },
    { label: 'Next reward', value: status?.nextReward?.title ?? '—', icon: TimerReset, tone: 'purple' },
  ];

  return (
    <section className={styles.statsGrid} aria-label="Streak statistics">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <article className={`${styles.statCard} ${styles[`stat${tone}`]}`} key={label}>
          <span className={styles.statIcon}><Icon size={18} /></span>
          <div>
            <span className={styles.statLabel}>{label}</span>
            <strong className={styles.statValue}>{value}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}

export default StreakStats;
