import { ChevronRight, ShieldCheck } from 'lucide-react';
import styles from './DailyStreak.module.css';

function TrustFooter() {
  return (
    <footer className={styles.trustFooter}>
      <div className={styles.trustStrip}>
        <div className={styles.trustLeft}>
          <div className={styles.vrShieldLogo}>
            <span className={styles.vrText}>VR</span>
            <div className={styles.shieldPulseRing} />
          </div>
          <div className={styles.trustTextWrap}>
            <span className={styles.trustDomain}>Official rewards only on VeloopRewards.in</span>
            <span className={styles.trustDivider}>|</span>
            <span className={styles.trustTagline}>Stay active, stay rewarded!</span>
          </div>
        </div>

        <div className={styles.trustRight}>
          <span className={styles.trustSecureTag}>
            <ShieldCheck size={13} className={styles.shieldCheckSvg} />
            <span>Verified System</span>
          </span>
          <ChevronRight size={17} className={styles.trustChevron} />
        </div>
      </div>
    </footer>
  );
}

export default TrustFooter;
