import { Calendar, CheckCircle2, Flame, Sparkles, Star } from 'lucide-react';
import { ExclusiveRewardImg, TopRightHeroImg, VEsCoinImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function HeroBanner({ status }) {
  const claimedCount = status?.cards
    ? status.cards.filter((c) => c.state === 'CLAIMED').length
    : (status?.checkedIn ?? 1);

  const totalRewards = status?.totalRewards ?? status?.cards?.length ?? 7;

  // Next reward calculation
  const nextCard = status?.cards?.find((c) => c.state === 'AVAILABLE' || c.state === 'TODAY')
    || status?.cards?.find((c) => c.state === 'LOCKED');

  const nextRewardText = nextCard?.reward?.rewardType === 'GIFT_CARD'
    ? `₹${Math.round(Number(nextCard.reward.amount))} Gift Card`
    : `+${Math.round(Number(nextCard?.reward?.amount ?? 10))} VEs`;

  return (
    <div className={styles.heroBannerCard}>
      {/* Ambient background glow & soft light rays */}
      <div className={styles.heroAmbientGlow} />
      <div className={styles.heroLightBeams} />

      <div className={styles.heroBodyRow}>
        {/* Left Column: Heading, Description & Stats */}
        <div className={styles.heroTextCol}>
          {/* DAILY CHECK-IN Pill Tag (Matching Reference) */}
          <div className={styles.heroCheckInTag}>
            <div className={styles.tagFlameCircle}>
              <Flame size={13} strokeWidth={2.8} className={styles.tagFlameSvg} />
            </div>
            <span className={styles.tagLabel}>DAILY CHECK-IN</span>
          </div>

          {/* Headline: High Contrast Bold White + Radiant Gold Gradient */}
          <h2 className={styles.heroMainTitle}>
            Daily Streak,<br />
            <span className={styles.heroGoldTitle}>Bigger Rewards!</span>
          </h2>

          <p className={styles.heroSupportText}>
            Check in every day, maintain your streak and unlock increasingly valuable rewards!
          </p>

          {/* 3 Premium Stats Chips (Total Rewards, Checked In, Next Reward) */}
          <div className={styles.heroStatsRow}>
            {/* 1. Total Rewards */}
            <div className={styles.heroStatChip}>
              <div className={`${styles.statChipIconPlate} ${styles.platePurple}`}>
                <Calendar size={18} strokeWidth={2.3} className={styles.statIconPurple} />
              </div>
              <div className={styles.statChipContent}>
                <span className={styles.statChipLabel}>Total Rewards</span>
                <strong className={styles.statChipValue}>{totalRewards}</strong>
              </div>
            </div>

            {/* 2. Checked In */}
            <div className={styles.heroStatChip}>
              <div className={`${styles.statChipIconPlate} ${styles.plateGreen}`}>
                <CheckCircle2 size={18} strokeWidth={2.5} className={styles.statIconGreen} />
              </div>
              <div className={styles.statChipContent}>
                <span className={styles.statChipLabel}>Checked In</span>
                <strong className={`${styles.statChipValue} ${styles.statValueGreen}`}>{claimedCount}</strong>
              </div>
            </div>

            {/* 3. Next Reward */}
            <div className={styles.heroStatChip}>
              <div className={`${styles.statChipIconPlate} ${styles.plateGold}`}>
                <Star size={18} strokeWidth={2.5} className={styles.statIconGold} />
              </div>
              <div className={styles.statChipContent}>
                <span className={styles.statChipLabel}>Next Reward</span>
                <strong className={`${styles.statChipValue} ${styles.statValueGold}`}>
                  {nextRewardText}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating 3D Gift Box with Orbiting Coins & Glow */}
        <div className={styles.heroVisualCol}>
          <div className={styles.heroArtStage}>
            {/* Pedestal & Glowing Circular Orbit Ring */}
            <div className={styles.heroPedestalBase} />
            <div className={styles.orbitLightRing} />

            {/* Large 3D Purple Gift Box with subtle float and scale pulse */}
            <img
              src={ExclusiveRewardImg || TopRightHeroImg}
              alt="Daily Rewards 3D Gift"
              className={styles.hero3dGiftImg}
            />

            {/* Floating Orbiting Gold Coins */}
            <div className={`${styles.floatingCoinWrap} ${styles.coinPosLeft}`}>
              <img src={VEsCoinImg} alt="" className={styles.orbitCoinImg} />
            </div>
            <div className={`${styles.floatingCoinWrap} ${styles.coinPosRight}`}>
              <img src={VEsCoinImg} alt="" className={styles.orbitCoinImg} />
            </div>
            <div className={`${styles.floatingCoinWrap} ${styles.coinPosTop}`}>
              <img src={VEsCoinImg} alt="" className={styles.orbitCoinImg} />
            </div>

            {/* Ambient Sparkles & Light Dust */}
            <span className={`${styles.heroSparkle} ${styles.spTopRight}`}>✦</span>
            <span className={`${styles.heroSparkle} ${styles.spBottomLeft}`}>★</span>
            <span className={`${styles.heroSparkle} ${styles.spCenterRight}`}>✦</span>
            <span className={`${styles.heroSparkle} ${styles.spCenterLeft}`}>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
