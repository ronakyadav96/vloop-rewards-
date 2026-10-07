import { Calendar, CheckCircle2, Flame, Sparkles, Star } from 'lucide-react';
import { ExclusiveRewardImg, TopRightHeroImg, VEsCoinImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function HeroBanner({ status }) {
  const claimedCount = status?.cards
    ? status.cards.filter((c) => c.state === 'CLAIMED').length
    : (status?.checkedIn ?? 1);

  const totalRewards = status?.totalRewards ?? status?.cards?.length ?? 7;

  // Next reward formatting
  const nextCard = status?.cards?.find((c) => c.state === 'AVAILABLE' || c.state === 'TODAY')
    || status?.cards?.find((c) => c.state === 'LOCKED');

  const nextRewardText = nextCard?.reward?.rewardType === 'GIFT_CARD'
    ? `₹${Math.round(Number(nextCard.reward.amount))} Gift Card`
    : `+${Math.round(Number(nextCard?.reward?.amount ?? 10))} VEs`;

  return (
    <div className={styles.heroBannerCard}>
      {/* Ambient background glow behind the hero */}
      <div className={styles.heroAmbientGlow} />

      <div className={styles.heroBodyRow}>
        {/* Left Column: Headline, Description & 3 Stats */}
        <div className={styles.heroTextCol}>
          {/* DAILY CHECK-IN Pill Tag (Matching Image 1) */}
          <div className={styles.heroCheckInTag}>
            <div className={styles.tagFlameCircle}>
              <Flame size={12} strokeWidth={2.8} className={styles.tagFlameSvg} />
            </div>
            <span className={styles.tagLabel}>DAILY CHECK-IN</span>
          </div>

          {/* Headline with golden radiant accent */}
          <h2 className={styles.heroMainTitle}>
            Daily Streak,<br />
            <span className={styles.heroGoldTitle}>Bigger Rewards!</span>
          </h2>

          <p className={styles.heroSupportText}>
            Check in every day, build your streak and unlock exciting rewards!
          </p>

          {/* 3 Stat Chips (Total Rewards, Checked In, Next Reward) */}
          <div className={styles.heroStatsRow}>
            {/* 1. Total Rewards */}
            <div className={styles.heroStatChip}>
              <div className={`${styles.statChipIconPlate} ${styles.platePurple}`}>
                <Calendar size={17} strokeWidth={2.2} className={styles.statIconPurple} />
              </div>
              <div className={styles.statChipContent}>
                <span className={styles.statChipLabel}>Total Rewards</span>
                <strong className={styles.statChipValue}>{totalRewards}</strong>
              </div>
            </div>

            {/* 2. Checked In */}
            <div className={styles.heroStatChip}>
              <div className={`${styles.statChipIconPlate} ${styles.plateGreen}`}>
                <CheckCircle2 size={17} strokeWidth={2.4} className={styles.statIconGreen} />
              </div>
              <div className={styles.statChipContent}>
                <span className={styles.statChipLabel}>Checked In</span>
                <strong className={styles.statChipValue}>{claimedCount}</strong>
              </div>
            </div>

            {/* 3. Next Reward */}
            <div className={styles.heroStatChip}>
              <div className={`${styles.statChipIconPlate} ${styles.plateGold}`}>
                <Star size={17} strokeWidth={2.4} className={styles.statIconGold} />
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

        {/* Right Column: 3D Gift Box, Orbiting Coins & Sparkles (Matching Image 1) */}
        <div className={styles.heroVisualCol}>
          <div className={styles.heroArtStage}>
            {/* Glowing circular orbit ring behind the gift */}
            <div className={styles.orbitLightRing} />
            <div className={styles.pedestalGlow} />

            {/* Central 3D Purple Gift Box */}
            <img
              src={ExclusiveRewardImg || TopRightHeroImg}
              alt="Daily Streak Rewards 3D Gift"
              className={styles.hero3dGiftImg}
            />

            {/* Orbiting Gold Coins with floating animation */}
            <div className={`${styles.floatingCoinWrap} ${styles.coinPosLeft}`}>
              <img src={VEsCoinImg} alt="Coin" className={styles.orbitCoinImg} />
            </div>
            <div className={`${styles.floatingCoinWrap} ${styles.coinPosRight}`}>
              <img src={VEsCoinImg} alt="Coin" className={styles.orbitCoinImg} />
            </div>
            <div className={`${styles.floatingCoinWrap} ${styles.coinPosTop}`}>
              <img src={VEsCoinImg} alt="Coin" className={styles.orbitCoinImg} />
            </div>

            {/* Sparkles & Star Particles */}
            <span className={`${styles.heroSparkle} ${styles.spTopRight}`}>✦</span>
            <span className={`${styles.heroSparkle} ${styles.spBottomLeft}`}>★</span>
            <span className={`${styles.heroSparkle} ${styles.spCenterRight}`}>✦</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
