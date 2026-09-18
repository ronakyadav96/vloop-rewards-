import { ArrowUpRight, Flame, LockKeyhole, Sparkles, TimerReset } from 'lucide-react';
import styles from './DailyStreak.module.css';

function HeroBanner({ streak, nextReward, claimableCard, checkedIn, countdown, onClaim }) {
  const isAvailable = claimableCard?.state === 'AVAILABLE' || claimableCard?.state === 'TODAY';

  return (
    <section className={styles.heroBanner} aria-labelledby="streak-page-title">
      <div className={styles.heroCopy}>
        <div className={styles.eyebrow}><span className={styles.eyebrowLine} /> DAILY REWARDS</div>
        <h1 id="streak-page-title">Keep your streak.<br /><span>Unlock more.</span></h1>
        <p>Show up every day, build momentum, and unlock rewards made to keep you moving forward.</p>
        <button className={styles.primaryButton} type="button" onClick={onClaim} disabled={!isAvailable}>
          {checkedIn ? 'Streak checked in' : nextReward ? `Claim ${nextReward.title}` : 'Loading reward'}
          <ArrowUpRight size={17} />
        </button>
        <div className={styles.heroMeta}>
          <span><span className={styles.liveDot} /> Backend verified</span>
          <span><LockKeyhole size={13} /> Secure reward flow</span>
          {countdown && <span className={styles.countdownMeta}><TimerReset size={13} /> Next check-in {countdown}</span>}
        </div>
      </div>

      <div className={styles.heroArt} aria-hidden="true">
        <div className={styles.heroHalo} />
        <div className={styles.heroOrb}><Flame size={68} fill="currentColor" strokeWidth={1.2} /></div>
        <div className={`${styles.heroSpark} ${styles.sparkOne}`}><Sparkles size={16} /></div>
        <div className={`${styles.heroSpark} ${styles.sparkTwo}`}><Sparkles size={12} /></div>
        <div className={styles.heroStreakBadge}><Flame size={15} fill="currentColor" /> {streak?.currentStreak ?? 0} day streak</div>
      </div>
    </section>
  );
}

export default HeroBanner;
