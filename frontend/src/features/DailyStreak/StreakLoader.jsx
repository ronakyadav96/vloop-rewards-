import { FlameImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function StreakLoader() {
  return (
    <div className={styles.loaderScreen} role="status" aria-live="polite">
      <div className={styles.loaderMark}>
        <img src={FlameImg} alt="VELoop Flame" style={{ width: 34, height: 34, objectFit: 'contain' }} />
      </div>
      <span>Loading your streak...</span>
      <div className={styles.loaderBar}><span /></div>
    </div>
  );
}

export default StreakLoader;
