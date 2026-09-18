import { Check, CircleCheck, LoaderCircle, Play, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './DailyStreak.module.css';

function ClaimModal({ card, busy, onClose, onConfirm }) {
  const [stage, setStage] = useState('confirm');
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (!card) setStage('confirm');
  }, [card]);

  if (!card) return null;

  const startDemo = () => {
    setDemoLoading(true);
    window.setTimeout(() => {
      setDemoLoading(false);
      setStage('complete');
    }, 900);
  };

  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={styles.claimModal} role="dialog" aria-modal="true" aria-labelledby="claim-modal-title">
        <button className={styles.modalClose} type="button" onClick={onClose} aria-label="Close claim dialog"><X size={19} /></button>
        <div className={styles.modalIcon}>{stage === 'complete' ? <CircleCheck size={27} /> : <Play size={24} />}</div>
        <span className={styles.sectionKicker}>{stage === 'confirm' ? 'CPA DEMO · STEP 1 OF 2' : 'CPA DEMO · STEP 2 OF 2'}</span>
        <h2 id="claim-modal-title">{stage === 'confirm' ? 'One quick check-in.' : stage === 'complete' ? 'Demo complete.' : 'Demo in progress…'}</h2>
        <p>
          {stage === 'confirm'
            ? 'This is a local placeholder experience. Completing it only unlocks the real backend claim request.'
            : stage === 'complete'
              ? 'Now submit the claim. The backend will recalculate the reward and eligibility.'
              : 'Simulating the placeholder completion. No ad network or external tracking is used.'}
        </p>
        <div className={styles.modalReward}><strong>{card.reward?.title}</strong><span>{card.reward?.description}</span></div>
        {stage !== 'complete' && <div className={styles.demoDisclaimer}><ShieldCheck size={14} /> Demo only · it cannot grant rewards</div>}
        {stage === 'confirm' && <button className={styles.primaryButton} type="button" onClick={startDemo} disabled={busy}><Play size={16} /> Start demo</button>}
        {stage === 'complete' && <button className={styles.primaryButton} type="button" onClick={onConfirm} disabled={busy}>{busy ? 'Verifying with backend…' : 'Submit real claim'} <Check size={17} /></button>}
        {demoLoading && <div className={styles.demoProgress}><LoaderCircle size={14} /> Completing placeholder…</div>}
      </section>
    </div>
  );
}

export default ClaimModal;
