import { Check, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { VEsCoinImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function CpaDemo({ card, onClose, onConfirm, busy }) {
  const [stage, setStage] = useState('loading'); // 'loading' -> 'verifying' -> 'confirmed'
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!card) {
      setStage('loading');
      setProgress(15);
      return;
    }

    // Step 1: Simulate ad / reward verification sequence
    const t1 = setTimeout(() => {
      setProgress(60);
      setStage('verifying');
    }, 700);

    const t2 = setTimeout(() => {
      setProgress(100);
      // Trigger the real backend claim API
      onConfirm();
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [card]);

  if (!card) return null;

  const rewardTitle = card.reward?.title || 'Daily Reward';
  const rewardDesc = card.reward?.description || 'Consistency reward';

  return (
    <div
      className={styles.modalBackdrop}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <section
        className={styles.cpaModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cpa-demo-title"
      >
        <button
          className={styles.modalCloseBtn}
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className={styles.cpaHeader}>
          <div className={styles.cpaShieldIcon}>
            <ShieldCheck size={26} />
          </div>
          <span className={styles.cpaSubtitle}>Advertisement / Reward Verification</span>
          <h2 id="cpa-demo-title" className={styles.cpaTitle}>
            Preparing your reward...
          </h2>
          <p className={styles.cpaPleaseWait}>Please wait...</p>
        </div>

        {/* Ad simulation card */}
        <div className={styles.cpaAdPlaceholderCard}>
          <div className={styles.cpaAdBadgeWrap}>
            <span className={styles.cpaSponsorBadge}>Sponsored Demo Verification</span>
            <span className={styles.cpaSecureText}><Sparkles size={12} /> Backend Protected</span>
          </div>

          <div className={styles.cpaRewardPreview}>
            <img src={VEsCoinImg} alt="" className={styles.cpaCoinImg} />
            <div className={styles.cpaRewardMeta}>
              <strong className={styles.cpaRewardHeading}>Day {card.day}: {rewardTitle}</strong>
              <span className={styles.cpaRewardSub}>{rewardDesc}</span>
            </div>
          </div>

          <div className={styles.cpaProgressBarWrap}>
            <div
              className={styles.cpaProgressBarFill}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={styles.cpaProgressStatus}>
            <span>{busy ? 'Securing claim on backend ledger…' : 'Verifying check-in requirements…'}</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className={styles.cpaFooterNote}>
          <small>
            Demo placeholder state matching VELoop theme. Actual rewards and wallet updates are verified by MongoDB transactions.
          </small>
        </div>
      </section>
    </div>
  );
}

export default CpaDemo;
