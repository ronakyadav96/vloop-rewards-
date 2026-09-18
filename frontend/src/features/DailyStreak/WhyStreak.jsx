import { Clock3, Gem, RotateCcw } from 'lucide-react';
import styles from './DailyStreak.module.css';

function WhyStreak() {
  const points = [
    [Clock3, 'Server-timed', 'Your streak is calculated from verified timestamps.'],
    [Gem, 'Reward-led', 'Every reward is configured and recorded on the backend.'],
    [RotateCcw, 'Keep looping', 'Come back tomorrow and keep your progress moving.'],
  ];

  return (
    <section className={styles.whySection} aria-labelledby="why-title">
      <div className={styles.whyHeading}><span className={styles.sectionKicker}>THE VELOOP PROMISE</span><h2 id="why-title">Consistency feels better<br /><span>when it comes back to you.</span></h2></div>
      <div className={styles.whyGrid}>
        {points.map(([Icon, title, body]) => <div className={styles.whyItem} key={title}><span className={styles.whyIcon}><Icon size={18} /></span><div><strong>{title}</strong><p>{body}</p></div></div>)}
      </div>
    </section>
  );
}

export default WhyStreak;
