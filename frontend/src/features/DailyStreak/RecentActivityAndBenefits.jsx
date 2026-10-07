import { ArrowRight, ChevronRight, Gift, Sparkles, Zap } from 'lucide-react';
import {
  Day4BoxImg,
  Day5AmazonImg,
  Day7CrownImg,
  ExclusiveRewardImg,
  TopRightHeroImg,
  VEsCoinImg,
} from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function getRewardAsset(day) {
  if (day === 7) return Day7CrownImg;
  if (day === 5) return Day5AmazonImg;
  if (day === 4) return Day4BoxImg;
  if (day === 2) return TopRightHeroImg;
  return VEsCoinImg;
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'Claimed';
  try {
    const claimDate = new Date(dateString);
    if (isNaN(claimDate.getTime())) return 'Claimed';
    const now = new Date();
    const diffMs = now.getTime() - claimDate.getTime();
    const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 2) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return claimDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return 'Claimed';
  }
}

function RecentActivityAndBenefits({ historyClaims = [], cards = [], onExploreRewards }) {
  // Use real backend claims first; fallback to claimed cards if history not yet populated
  const displayItems = historyClaims && historyClaims.length > 0
    ? historyClaims
    : cards.filter((c) => c.state === 'CLAIMED');

  return (
    <section className={styles.benefitsAndActivitySection} aria-label="Rewards Showcase and Recent Activity">
      <div className={styles.benefitsActivityGrid}>
        {/* Left Column: Rewards Showcase Hero Card (Image 2) */}
        <div className={styles.benefitsPromoCard}>
          <div className={styles.promoAmbientGlow} />

          <div className={styles.promoContentRow}>
            {/* 3D Chest / Box Image */}
            <div className={styles.promoArtWrap}>
              <div className={styles.promoPedestalRing} />
              <img
                src={ExclusiveRewardImg}
                alt="Exclusive Rewards Chest"
                className={styles.promoChestImg}
              />
            </div>

            {/* Promo Text & CTA */}
            <div className={styles.promoTextWrap}>
              <div className={styles.promoBadge}>
                <Gift size={13} strokeWidth={2.4} className={styles.promoGiftIcon} />
                <span>REWARDS &amp; BENEFITS</span>
              </div>

              <h3 className={styles.promoTitle}>
                More Streaks,<br />
                <span className={styles.promoGradientHighlight}>Bigger Rewards!</span>
              </h3>

              <p className={styles.promoDesc}>
                Keep checking in daily to unlock exciting rewards, exclusive Amazon gift cards and the ultimate Day 7 grand prize!
              </p>

              <button
                type="button"
                className={styles.promoCtaBtn}
                onClick={onExploreRewards || (() => {
                  const el = document.getElementById('streak-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                })}
              >
                <span>View All Rewards</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity (Driven by Real Backend History!) */}
        <div className={styles.recentActivityCard}>
          <div className={styles.activityHeaderRow}>
            <div className={styles.activityTitleGroup}>
              <div className={styles.activityZapIconWrap}>
                <Zap size={16} strokeWidth={2.4} className={styles.activityZapSvg} />
              </div>
              <div>
                <h4 className={styles.activityMainTitle}>Recent Activity</h4>
                <span className={styles.activitySubtitle}>Your claimed rewards</span>
              </div>
            </div>
          </div>

          <div className={styles.activityList}>
            {displayItems.length === 0 ? (
              <div className={styles.activityEmptyState}>
                <Sparkles size={20} className={styles.activityEmptySparkle} />
                <p className={styles.activityEmptyText}>
                  No rewards claimed yet in this streak loop. Check in today to earn your first reward!
                </p>
              </div>
            ) : (
              displayItems.slice(0, 5).map((item, idx) => {
                const dayNum = item.day || item.dayNumber || idx + 1;
                const asset = getRewardAsset(dayNum);
                const amount = item.reward?.amount
                  ? Math.round(Number(item.reward.amount))
                  : 5;
                const isGift = item.reward?.rewardType === 'GIFT_CARD';
                const displayVal = item.reward?.title
                  || (isGift ? `₹${amount} Amazon Gift Card` : `+${amount} VEs`);

                const timeLabel = formatRelativeTime(item.claimedAt);

                return (
                  <div key={item.id || item._id || dayNum} className={styles.activityItemRow}>
                    <div className={styles.activityItemIconWrap}>
                      <img src={asset} alt={`Day ${dayNum}`} className={styles.activityItemImg} />
                    </div>

                    <div className={styles.activityItemDetails}>
                      <strong className={styles.activityItemTitle}>Day {dayNum} Reward</strong>
                      <span className={styles.activityItemAmount}>{displayVal}</span>
                    </div>

                    <div className={styles.activityItemRight}>
                      <span className={styles.activityClaimedTag}>Claimed</span>
                      <span className={styles.activityTimeTag}>{timeLabel}</span>
                      <ChevronRight size={14} className={styles.activityChevron} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecentActivityAndBenefits;
