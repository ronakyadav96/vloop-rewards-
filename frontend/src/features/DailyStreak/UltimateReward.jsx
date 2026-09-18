import { Crown, Sparkles } from 'lucide-react';
import styles from './DailyStreak.module.css';

function UltimateReward({ reward }) {
  return (
    <section className={styles.ultimateCard}>
      <div className={styles.ultimateGlow} />
      <div className={styles.ultimateCopy}>
        <div className={styles.sectionKicker}><Crown size={14} /> DAY 7 · ULTIMATE REWARD</div>
        <h2>{reward?.title ?? 'Ultimate reward'}</h2>
        <p>{reward?.description ?? 'Complete the full streak to reveal your final reward.'}</p>
        <span className={styles.ultimateHint}><Sparkles size={14} /> Keep the loop going</span>
      </div>
      <div className={styles.crownArtwork} aria-hidden="true"><div className={styles.crownRing} /><Crown size={78} fill="currentColor" strokeWidth={1.1} /></div>
    </section>
  );
}

export default UltimateReward;
