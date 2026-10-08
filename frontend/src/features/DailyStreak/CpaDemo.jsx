import { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles, X } from 'lucide-react';
import { describeReward, getRewardArt } from './streakFormat.js';
import styles from './StreakOverlays.module.css';

function CpaDemo({ card, isFinal, onClose, onConfirm, busy }) {
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

  const reward = describeReward(card.reward);

  return (
    <div
      className={styles.modalBackdrop}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cpa-demo-title"
        aria-describedby="cpa-demo-status"
      >
        <button
          className={styles.modalClose}
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <span className={styles.modalKicker}><ShieldCheck size={16} /> Reward verification</span>
        <h2 id="cpa-demo-title" className={styles.modalTitle}>Preparing your reward…</h2>

        <div className={styles.modalReward}>
          <span className={styles.modalArt}>
            <img src={getRewardArt(card.reward, { isFinal })} alt="" />
          </span>
          <span className={styles.modalRewardText}>
            <small>Day {card.day}</small>
            <strong>{reward?.full ?? 'Daily reward'}</strong>
            {card.reward?.description && <span>{card.reward.description}</span>}
          </span>
        </div>

        <div className={styles.modalProgress} aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.modalStatus} id="cpa-demo-status" role="status">
          <span>
            {busy
              ? 'Securing your claim…'
              : stage === 'verifying' ? 'Verifying check-in requirements…' : 'Loading sponsored verification…'}
          </span>
          <span>{progress}%</span>
        </div>

        <p className={styles.modalNote}>
          <Sparkles size={14} />
          Demo verification step. Your reward and wallet are confirmed by the server.
        </p>
      </section>
    </div>
  );
}

export default CpaDemo;
