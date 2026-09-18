import { ArrowRight, BadgeCheck, Bolt, ShieldCheck } from 'lucide-react';
import styles from './DailyStreak.module.css';

function CpaDemo() {
  return (
    <section className={styles.loopSection} aria-labelledby="loop-title">
      <div>
        <span className={styles.sectionKicker}>WHY THE DAILY LOOP?</span>
        <h2 id="loop-title">Small actions.<br /><span>Real momentum.</span></h2>
        <p>VELoop turns consistency into a habit with transparent rewards, a clear path, and a wallet you can trust.</p>
      </div>
      <div className={styles.benefitList}>
        <div className={styles.benefitItem}><BadgeCheck size={19} /><span><strong>Always transparent</strong><small>Rewards are verified by the backend.</small></span></div>
        <div className={styles.benefitItem}><Bolt size={19} /><span><strong>Built for momentum</strong><small>Every check-in moves your loop forward.</small></span></div>
        <div className={styles.benefitItem}><ShieldCheck size={19} /><span><strong>Secure by design</strong><small>Claims are protected and traceable.</small></span></div>
        <a className={styles.textButton} href="#why-title">Learn how it works <ArrowRight size={15} /></a>
      </div>
    </section>
  );
}

export default CpaDemo;
