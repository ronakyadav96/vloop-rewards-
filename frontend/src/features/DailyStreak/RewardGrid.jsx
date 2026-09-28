import RewardCard from './RewardCard.jsx';
import styles from './DailyStreak.module.css';

function RewardGrid({ cards, countdown, onSelect }) {
  // Mobile layout separation: Day 1-4 in row 1, Day 5-7 in row 2
  const rowOneCards = cards.slice(0, 4);
  const rowTwoCards = cards.slice(4, 7);

  return (
    <section className={styles.rewardsSection} id="streak-grid" aria-label="Daily Streak Rewards">
      {/* Middle Banner matching design */}
      <div className={styles.comeBackBanner}>
        <span className={styles.sparkleIcon}>✦</span>
        <span>Come back tomorrow for more rewards!</span>
        <span className={styles.sparkleIcon}>✦</span>
      </div>

      {/* Desktop 7-card row */}
      <div className={styles.desktopRewardGrid}>
        {cards.map((card) => (
          <RewardCard
            key={card.day}
            card={card}
            countdown={card.nextClaimAt ? countdown : null}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Mobile 2-row layout: 4 cards top row, 3 cards bottom row */}
      <div className={styles.mobileRewardLayout}>
        <div className={styles.mobileRowTop}>
          {rowOneCards.map((card) => (
            <RewardCard
              key={card.day}
              card={card}
              countdown={card.nextClaimAt ? countdown : null}
              onSelect={onSelect}
            />
          ))}
        </div>
        <div className={styles.mobileRowBottom}>
          {rowTwoCards.map((card) => (
            <RewardCard
              key={card.day}
              card={card}
              countdown={card.nextClaimAt ? countdown : null}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RewardGrid;
