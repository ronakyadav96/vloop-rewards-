import { Flame } from 'lucide-react';
import styles from './DailyStreak.module.css';

function StreakLoader() {
  return (
    <div className={styles.loaderScreen} role="status" aria-live="polite">
      <div className={styles.loaderMark}><Flame size={30} fill="currentColor" /></div>
      <span>Loading your loop</span>
      <div className={styles.loaderBar}><span /></div>
    </div>
  );
}

export default StreakLoader;

