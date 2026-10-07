import { useEffect, useState } from 'react';
import {
  Day4BoxImg,
  Day5AmazonImg,
  Day7CrownImg,
  VEsCoinImg,
} from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function getRewardAsset(day, rewardType) {
  if (day === 7) return Day7CrownImg;
  if (day === 4) return Day4BoxImg;
  if (day === 5) return Day5AmazonImg;
  return VEsCoinImg;
}

function RewardFlyAnimation({ flyData, onComplete }) {
  const [stage, setStage] = useState('idle'); // 'spawning' | 'flying' | 'impact' | 'done'

  useEffect(() => {
    if (!flyData || !flyData.active) {
      setStage('idle');
      return;
    }

    // Phase 1: Spawning & burst at card position
    setStage('spawning');

    // Phase 2: Flight toward navbar
    const flyTimer = setTimeout(() => {
      setStage('flying');
    }, 320);

    // Phase 3: Impact at navbar wallet
    const impactTimer = setTimeout(() => {
      setStage('impact');
      if (onComplete) onComplete();
    }, 1050);

    // Phase 4: Clean up
    const doneTimer = setTimeout(() => {
      setStage('done');
    }, 2400);

    return () => {
      clearTimeout(flyTimer);
      clearTimeout(impactTimer);
      clearTimeout(doneTimer);
    };
  }, [flyData, onComplete]);

  if (!flyData || !flyData.active || stage === 'idle' || stage === 'done') {
    return null;
  }

  const { startX, startY, endX, endY, day, rewardType, amount, title } = flyData;
  const asset = getRewardAsset(day, rewardType);
  const isCrown = day === 7;
  const isGiftCard = rewardType === 'GIFT_CARD' || day === 4 || day === 5;
  const isCoinReward = !isCrown && !isGiftCard;

  const kickerText = isCrown
    ? '👑 GRAND PRIZE UNLOCKED!'
    : isGiftCard
      ? '🎁 GIFT CARD COLLECTED!'
      : '✦ REWARD COLLECTED!';

  const displayText = title
    || (isCrown
      ? 'Day 7 VIP Crown ₹5 Amazon Gift Card'
      : isGiftCard
        ? `₹${amount} Amazon Gift Card`
        : `+${amount} VEs Added to Wallet`);

  const dynamicStyle = {
    '--startX': `${startX}px`,
    '--startY': `${startY}px`,
    '--endX': `${endX}px`,
    '--endY': `${endY}px`,
  };

  return (
    <div className={styles.flyAnimationOverlay} style={dynamicStyle} aria-hidden="true">
      {/* 1. Sparkle Particles Burst around spawn location */}
      {stage === 'spawning' && (
        <div className={styles.flyBurstWrap}>
          <div className={`${styles.flyHaloSunburst} ${isCrown ? styles.sunburstGold : isGiftCard ? styles.sunburstPurple : ''}`} />
          <span className={`${styles.flySparkle} ${styles.sp1}`}>✦</span>
          <span className={`${styles.flySparkle} ${styles.sp2}`}>★</span>
          <span className={`${styles.flySparkle} ${styles.sp3}`}>✦</span>
          <span className={`${styles.flySparkle} ${styles.sp4}`}>★</span>
          <span className={`${styles.flySparkle} ${styles.sp5}`}>✦</span>
          <span className={`${styles.flySparkle} ${styles.sp6}`}>★</span>
          {isCrown && (
            <>
              <span className={`${styles.flySparkle} ${styles.spCrown1}`}>👑</span>
              <span className={`${styles.flySparkle} ${styles.spCrown2}`}>✨</span>
            </>
          )}
        </div>
      )}

      {/* 2. The Flying Reward Asset(s) */}
      {(stage === 'spawning' || stage === 'flying') && (
        <>
          {/* Main Flying Asset */}
          <div
            className={`${styles.flyingAssetContainer} ${
              stage === 'flying' ? styles.flyingActive : styles.spawningActive
            } ${isCrown ? styles.flyingCrownSpecial : ''}`}
          >
            <div className={`${styles.flyingTrailGlow} ${isCrown ? styles.trailGold : ''}`} />
            <img src={asset} alt="Reward" className={styles.flyingAssetImg} />
          </div>

          {/* Multiple Emerging Coins for VE Coin Rewards (Staggered Trajectory) */}
          {isCoinReward && stage === 'flying' && (
            <>
              <div className={`${styles.flyingAssetContainer} ${styles.flyingActive} ${styles.flyingCoinFollower1}`}>
                <div className={styles.flyingTrailGlow} />
                <img src={VEsCoinImg} alt="" className={styles.flyingMiniCoinImg} />
              </div>
              <div className={`${styles.flyingAssetContainer} ${styles.flyingActive} ${styles.flyingCoinFollower2}`}>
                <div className={styles.flyingTrailGlow} />
                <img src={VEsCoinImg} alt="" className={styles.flyingMiniCoinImg} />
              </div>
            </>
          )}
        </>
      )}

      {/* 3. Floating Celebration Toast ("Reward Collected!" / "Grand Prize Unlocked!") */}
      {(stage === 'flying' || stage === 'impact') && (
        <div className={`${styles.flySuccessBanner} ${isCrown ? styles.bannerGoldPrize : ''}`}>
          <span className={styles.bannerSparkle}>✦</span>
          <div className={styles.bannerTextWrap}>
            <span className={styles.bannerKicker}>{kickerText}</span>
            <strong className={styles.bannerReward}>{displayText}</strong>
          </div>
          <span className={styles.bannerSparkle}>✦</span>
        </div>
      )}
    </div>
  );
}

export default RewardFlyAnimation;
