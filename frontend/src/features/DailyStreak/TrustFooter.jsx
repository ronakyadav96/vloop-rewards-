import { Calendar, Crown, Gift, ShieldCheck, Trophy } from 'lucide-react';
import styles from './DailyStreak.module.css';

function TrustFooter() {
  return (
    <footer className={styles.trustFooterSection} aria-label="Benefits Overview">
      {/* 4 Feature Pills from Image 2 */}
      <div className={styles.featurePillsRow}>
        <div className={styles.featurePill}>
          <div className={styles.featurePillIconWrap}>
            <Calendar size={18} strokeWidth={2.2} className={styles.featureIconPurple} />
          </div>
          <div className={styles.featurePillText}>
            <strong className={styles.featurePillTitle}>Daily Check-In</strong>
            <span className={styles.featurePillDesc}>Just a few seconds</span>
          </div>
        </div>

        <div className={styles.featurePill}>
          <div className={styles.featurePillIconWrap}>
            <Gift size={18} strokeWidth={2.2} className={styles.featureIconPink} />
          </div>
          <div className={styles.featurePillText}>
            <strong className={styles.featurePillTitle}>Exciting Rewards</strong>
            <span className={styles.featurePillDesc}>Coins, gift cards &amp; more</span>
          </div>
        </div>

        <div className={styles.featurePill}>
          <div className={styles.featurePillIconWrap}>
            <Crown size={18} strokeWidth={2.2} className={styles.featureIconGold} />
          </div>
          <div className={styles.featurePillText}>
            <strong className={styles.featurePillTitle}>Build Your Streak</strong>
            <span className={styles.featurePillDesc}>Unlock bigger prizes</span>
          </div>
        </div>

        <div className={styles.featurePill}>
          <div className={styles.featurePillIconWrap}>
            <Trophy size={18} strokeWidth={2.2} className={styles.featureIconYellow} />
          </div>
          <div className={styles.featurePillText}>
            <strong className={styles.featurePillTitle}>Ultimate Prize</strong>
            <span className={styles.featurePillDesc}>Grand finale at Day 7</span>
          </div>
        </div>
      </div>

      {/* Security & Official Verification Strip */}
      <div className={styles.trustStrip}>
        <div className={styles.trustLeft}>
          <ShieldCheck size={16} strokeWidth={2.4} className={styles.trustShieldSvg} />
          <div className={styles.trustTextWrap}>
            <span className={styles.trustDomain}>Official rewards only on VeloopRewards.in</span>
            <span className={styles.trustDivider}>•</span>
            <span className={styles.trustTagline}>Stay active, stay rewarded!</span>
          </div>
        </div>

        <div className={styles.trustRight}>
          <span className={styles.trustSecureTag}>
            <span>100% Verified Rewards &amp; Instant Wallet Credit</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default TrustFooter;
