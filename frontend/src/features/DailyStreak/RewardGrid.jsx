import RewardCard from './RewardCard.jsx';
import styles from './DailyStreak.module.css';

function RewardGrid({ cards, countdown, onSelect }) {
  return (
    <section aria-labelledby="daily-rewards-title">
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.sectionKicker}>YOUR REWARD PATH</span>
          <h2 id="daily-rewards-title">Seven days. One loop.</h2>
        </div>
        <span className={styles.dayProgress}>{cards.filter((card) => card.state === 'CLAIMED').length} / {cards.length} claimed</span>
      </div>
      <div className={styles.rewardGrid}>
        {cards.map((card) => <RewardCard key={card.day} card={card} countdown={card.nextClaimAt ? countdown : null} onSelect={onSelect} />)}
      </div>
    </section>
  );
}

export default RewardGrid;
