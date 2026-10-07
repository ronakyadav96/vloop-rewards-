import { Check, Flame, Gift, Sparkles, Target, Trophy } from 'lucide-react';
import RewardCard from './RewardCard.jsx';
import styles from './DailyStreak.module.css';

function RewardGrid({ cards, countdown, onSelect }) {
  const claimedCount = cards.filter((c) => c.state === 'CLAIMED').length;
  const totalDays = cards.length || 7;
  const progressPercent = Math.min(100, Math.round((claimedCount / totalDays) * 100));

  // Determine current active/today day
  const currentActiveCard = cards.find((c) => c.state === 'AVAILABLE' || c.state === 'TODAY');
  const currentActiveDay = currentActiveCard
    ? currentActiveCard.day
    : (claimedCount < 7 ? claimedCount + 1 : 7);

  // Separation for mobile 4 + 3 layout
  const rowOneCards = cards.slice(0, 4);
  const rowTwoCards = cards.slice(4, 7);

  // Progress fill percentage (from 0 to 100 based on nodes 1 to 7)
  const trackFillPercent = claimedCount === 0
    ? 0
    : Math.round(((claimedCount - 0.5) / (totalDays - 1)) * 100);

  // Milestone 1 (Day 4) progress
  const milestone1Percent = Math.min(100, Math.round((Math.min(claimedCount, 4) / 4) * 100));

  return (
    <section className={styles.rewardsSection} id="streak-grid" aria-label="7-Day Streak Challenge">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Main Challenge Card (Centerpiece matching Image 1)              */}
      {/* ------------------------------------------------------------------ */}
      <div className={styles.journeyTrackerCard}>
        {/* Header Row: 7-DAY STREAK CHALLENGE & Progress Counter */}
        <div className={styles.trackerHeader}>
          <div className={styles.trackerTitleBlock}>
            <div className={styles.trackerFlameIconWrap}>
              <Flame size={20} strokeWidth={2.4} className={styles.trackerFlameSvg} />
            </div>
            <div>
              <div className={styles.trackerTagRow}>
                <span className={styles.trackerEyebrow}>7-DAY STREAK CHALLENGE</span>
                <span className={styles.liveBeaconDot} />
              </div>
              <p className={styles.trackerSubtitle}>Stay consistent. Unlock bigger rewards!</p>
            </div>
          </div>

          <div className={styles.trackerProgressPill}>
            <div className={styles.claimedCountTag}>
              <Flame size={14} className={styles.pillFlameSmall} />
              <span><strong>{claimedCount}</strong> of {totalDays} Claimed</span>
            </div>
            <div className={styles.trackerPercentTag}>{progressPercent}%</div>
          </div>
        </div>

        {/* Milestone Node Rail (Connected Glowing Neon Path) */}
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
                  onClick={() => {
                    if (c.state === 'AVAILABLE' || c.state === 'TODAY') {
                      onSelect(c);
                    }
                  }}
                >
                  {isCurrent && (
                    <span className={styles.nodeTodayIndicator}>
                      <Flame size={9} /> TODAY
                    </span>
                  )}
                  {!isCurrent && isDay7Milestone && (
                    <span className={styles.nodeMilestoneBadgeGold}>VIP</span>
                  )}
                  {!isCurrent && isDay4Milestone && (
                    <span className={styles.nodeMilestoneBadgePurple}>Gift</span>
                  )}

                  <div className={styles.nodeCircle}>
                    {isClaimed ? (
                      <Check size={13} strokeWidth={3} className={styles.nodeCheckIcon} />
                    ) : isDay7Milestone ? (
                      <Trophy size={13} strokeWidth={2.4} className={styles.nodeMilestoneIconGold} />
                    ) : isDay4Milestone ? (
                      <Gift size={13} strokeWidth={2.4} className={styles.nodeMilestoneIconPurple} />
                    ) : (
                      <span className={styles.nodeDayNum}>{c.day}</span>
                    )}
                  </div>

                  <span className={styles.nodeLabel}>Day {c.day}</span>
                  <span
                    className={`${styles.nodeRewardPreview} ${
                      isClaimed ? styles.previewClaimed : isCurrent ? styles.previewCurrent : ''
                    }`}
                  >
                    {c.reward?.rewardType === 'GIFT_CARD'
                      ? `₹${Math.round(Number(c.reward?.amount || 1))}`
                      : `+${Math.round(Number(c.reward?.amount || 5))} VEs`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Card Grid (Desktop 7-Col & Mobile 4+3 Layout) */}
        <div className={styles.cardsGridWrap}>
          {/* Desktop 7-Card Row */}
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

          {/* Mobile 2-Row Layout (4 in top row, 3 in bottom row) */}
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
        </div>

        {/* Milestone Callout Chips at Bottom of Challenge (Image 1) */}
        <div className={styles.milestoneHighlightsRow}>
          {/* Milestone 1: Day 4 Amazon Gift Card */}
          <div
            className={`${styles.milestoneCalloutCard} ${
              claimedCount >= 4 ? styles.milestoneCalloutAchieved : ''
            }`}
          >
            <div className={styles.calloutIconCircle}>
              <Target size={16} strokeWidth={2.2} className={styles.calloutTargetIcon} />
            </div>
            <div className={styles.calloutBody}>
              <div className={styles.calloutTopRow}>
                <span className={styles.calloutTitle}>
                  <strong>Milestone 1:</strong> Day 4 Amazon Gift Card
                </span>
                <span className={styles.calloutStatusTag}>
                  {claimedCount >= 4 ? '✓ Unlocked' : 'Unlocks at Day 4'}
                </span>
              </div>
              <div className={styles.calloutProgressBar}>
                <div
                  className={styles.calloutProgressFill}
                  style={{ width: `${milestone1Percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Grand Prize: Day 7 VIP Crown */}
          <div
            className={`${styles.milestoneCalloutCard} ${styles.calloutGoldCard} ${
              claimedCount >= 7 ? styles.milestoneCalloutAchieved : ''
            }`}
          >
            <div className={styles.calloutIconCircleGold}>
              <Trophy size={16} strokeWidth={2.2} className={styles.calloutTrophyIcon} />
            </div>
            <div className={styles.calloutBody}>
              <div className={styles.calloutTopRow}>
                <span className={styles.calloutTitle}>
                  <strong>Grand Prize:</strong> Day 7 VIP Crown
                </span>
                <span className={styles.calloutValueTag}>₹5 Amazon Gift Card</span>
              </div>
              <span className={styles.calloutSub}>
                {claimedCount >= 7 ? '✓ Achieved' : 'Grand Finale'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Floating Golden Ribbon Banner (Matching Image 1)               */}
      {/* ------------------------------------------------------------------ */}
      <div className={styles.goldenStreakRibbon}>
        <span className={styles.ribbonSparkleLeft}>✦</span>
        <div className={styles.ribbonContent}>
          <span className={styles.ribbonCrownIcon}>👑</span>
          <span className={styles.ribbonText}>
            Keep the streak alive and unlock the ultimate reward!
          </span>
        </div>
        <span className={styles.ribbonSparkleRight}>✦</span>
      </div>
    </section>
  );
}

export default RewardGrid;
