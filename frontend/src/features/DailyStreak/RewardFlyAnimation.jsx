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
    }, 350);

    // Phase 3: Impact at navbar wallet
    const impactTimer = setTimeout(() => {
      setStage('impact');
      if (onComplete) onComplete();
    }, 1100);

    // Phase 4: Clean up
    const doneTimer = setTimeout(() => {
      setStage('done');
    }, 2200);

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
  const isGift = rewardType === 'GIFT_CARD' || day === 4 || day === 5 || day === 7;
  const displayText = title || (isGift ? `₹${amount} Gift Card` : `+${amount} VEs`);

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
          <div className={styles.flyHaloSunburst} />
          <span className={`${styles.flySparkle} ${styles.sp1}`}>✦</span>
          <span className={`${styles.flySparkle} ${styles.sp2}`}>★</span>
          <span className={`${styles.flySparkle} ${styles.sp3}`}>✦</span>
          <span className={`${styles.flySparkle} ${styles.sp4}`}>★</span>
          <span className={`${styles.flySparkle} ${styles.sp5}`}>✦</span>
          <span className={`${styles.flySparkle} ${styles.sp6}`}>★</span>
        </div>
      )}

      {/* 2. The Flying Reward Asset */}
      {(stage === 'spawning' || stage === 'flying') && (
        <div
          className={`${styles.flyingAssetContainer} ${
            stage === 'flying' ? styles.flyingActive : styles.spawningActive
          }`}
        >
          <div className={styles.flyingTrailGlow} />
          <img src={asset} alt="Reward" className={styles.flyingAssetImg} />
        </div>
      )}

      {/* 3. Floating Success Toast ("Reward Collected!") */}
      {(stage === 'flying' || stage === 'impact') && (
        <div className={styles.flySuccessBanner}>
          <span className={styles.bannerSparkle}>✦</span>
          <div className={styles.bannerTextWrap}>
            <span className={styles.bannerKicker}>REWARD COLLECTED!</span>
            <strong className={styles.bannerReward}>{displayText}</strong>
          </div>
          <span className={styles.bannerSparkle}>✦</span>
        </div>
      )}
    </div>
  );
}

export default RewardFlyAnimation;
