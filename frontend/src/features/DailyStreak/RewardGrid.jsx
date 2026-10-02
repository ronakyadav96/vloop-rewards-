import { Check, Flame, Gift, Sparkles, Trophy } from 'lucide-react';
import RewardCard from './RewardCard.jsx';
import styles from './DailyStreak.module.css';

function RewardGrid({ cards, countdown, onSelect }) {
  const claimedCount = cards.filter((c) => c.state === 'CLAIMED').length;
  const totalDays = cards.length || 7;
  const progressPercent = Math.min(100, Math.round((claimedCount / totalDays) * 100));

  // Determine active/next day
  const currentActiveCard = cards.find((c) => c.state === 'AVAILABLE' || c.state === 'TODAY');
  const currentActiveDay = currentActiveCard ? currentActiveCard.day : (claimedCount < 7 ? claimedCount + 1 : 7);

  // Separation for mobile 4 + 3 layout
  const rowOneCards = cards.slice(0, 4);
  const rowTwoCards = cards.slice(4, 7);

  // Progress fill percentage (from 0 to 100 based on nodes 1 to 7)
  const trackFillPercent = claimedCount === 0 ? 0 : Math.round(((claimedCount - 0.5) / (totalDays - 1)) * 100);

  return (
    <section className={styles.rewardsSection} id="streak-grid" aria-label="Daily Streak Rewards">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Animated Streak Journey & Reward Milestones Tracker             */}
      {/* ------------------------------------------------------------------ */}
      <div className={styles.journeyTrackerCard}>
        <div className={styles.trackerHeader}>
          <div className={styles.trackerTitleBlock}>
            <div className={styles.trackerFlameIconWrap}>
              <Flame size={18} className={styles.trackerFlameSvg} />
            </div>
            <div>
              <span className={styles.trackerEyebrow}>7-DAY STREAK CHALLENGE</span>
              <h3 className={styles.trackerTitle}>Milestone Journey</h3>
            </div>
          </div>

          <div className={styles.trackerProgressPill}>
            <span className={styles.trackerProgressFraction}>
              <strong>{claimedCount}</strong> / {totalDays} Claimed
            </span>
            <div className={styles.trackerPercentTag}>{progressPercent}%</div>
          </div>
        </div>

        {/* Milestone Node Rail */}
        <div className={styles.milestoneRailContainer}>
          <div className={styles.railTrackBackground}>
            <div
              className={styles.railTrackFill}
              style={{ width: `${Math.max(4, Math.min(100, trackFillPercent))}%` }}
            >
              <div className={styles.railGlowLeadingEdge} />
            </div>
          </div>

          <div className={styles.railNodesRow}>
            {cards.map((c) => {
              const isClaimed = c.state === 'CLAIMED';
              const isCurrent = c.day === currentActiveDay;
              const isDay4Milestone = c.day === 4;
              const isDay7Milestone = c.day === 7;

              return (
                <div
                  key={c.day}
                  className={`${styles.railNode} ${isClaimed ? styles.railNodeClaimed : ''} ${
                    isCurrent ? styles.railNodeCurrent : ''
                  } ${isDay4Milestone ? styles.railNodeMilestone4 : ''} ${
                    isDay7Milestone ? styles.railNodeMilestone7 : ''
                  }`}
                  title={`Day ${c.day}: ${c.reward?.title || ''}`}
                >
                  <div className={styles.nodeCircle}>
                    {isClaimed ? (
                      <Check size={11} strokeWidth={3} className={styles.nodeCheckIcon} />
                    ) : isDay7Milestone ? (
                      <Trophy size={11} className={styles.nodeMilestoneIconGold} />
                    ) : isDay4Milestone ? (
                      <Gift size={11} className={styles.nodeMilestoneIconPurple} />
                    ) : (
                      <span className={styles.nodeDayNum}>{c.day}</span>
                    )}
                  </div>
                  <span className={styles.nodeLabel}>Day {c.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones Callout Badges */}
        <div className={styles.milestoneHighlightsRow}>
          <div
            className={`${styles.milestonePill} ${
              claimedCount >= 4 ? styles.milestonePillAchieved : ''
            }`}
          >
            <Gift size={13} className={styles.milestonePillIconGift} />
            <span>
              <strong>Milestone 1:</strong> Day 4 Amazon Gift Card
            </span>
          </div>

          <div
            className={`${styles.milestonePill} ${styles.milestonePillGold} ${
              claimedCount >= 7 ? styles.milestonePillAchieved : ''
            }`}
          >
            <Trophy size={13} className={styles.milestonePillIconCrown} />
            <span>
              <strong>Final Reward:</strong> Day 7 VIP Crown ₹5
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Middle Banner (✦ Come back tomorrow for more rewards! ✦)        */}
      {/* ------------------------------------------------------------------ */}
      <div className={styles.comeBackBanner}>
        <span className={styles.sparkleIcon}>✦</span>
        <span>Come back tomorrow for more rewards!</span>
        <span className={styles.sparkleIcon}>✦</span>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Desktop 7-Card Grid Row                                         */}
      {/* ------------------------------------------------------------------ */}
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

      {/* ------------------------------------------------------------------ */}
      {/* 4. Mobile 2-Row Layout (4 in top row, 3 in bottom row)             */}
      {/* ------------------------------------------------------------------ */}
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
