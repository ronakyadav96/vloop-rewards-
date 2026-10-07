import { ChevronRight, Crown, Lock, Sparkles, Trophy } from 'lucide-react';
import { Day7CrownImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function UltimateReward({ card, reward, currentStreak = 1, onClaim }) {
  const isClaimed = card?.state === 'CLAIMED';
  const isAvailable = card?.state === 'AVAILABLE' || card?.state === 'TODAY';
  const amount = reward?.amount ? `₹${Math.round(Number(reward.amount))}` : '₹5';
  const title = reward?.title || 'Amazon Gift Card';

  return (
    <div className={styles.grandPrizePanel}>
      <div className={styles.grandPrizeAmbientGlow} />

      {/* 1. Header Row (Matching Image 1: Gold Crown Icon, "Next Reward - Day 7 Grand Prize >") */}
      <div className={styles.grandPrizeHeaderRow}>
        <div className={styles.grandPrizeTitleGroup}>
          <div className={styles.crownIconPlate}>
            <Crown size={16} strokeWidth={2.4} className={styles.headerCrownSvg} />
          </div>
          <div className={styles.headerTitleWrap}>
            <span className={styles.headerKicker}>Next Reward</span>
            <h3 className={styles.headerTitleText}>Day 7 Grand Prize</h3>
          </div>
        </div>
        <ChevronRight size={18} strokeWidth={2.2} className={styles.headerChevronSvg} />
      </div>

      {/* 2. Main Content: 3D Crown on Left/Center, Value & Button on Right */}
      <div className={styles.grandPrizeBody}>
        {/* Visual: 3D Crown with ULTIMATE REWARD Ribbon & Amazon Badge */}
        <div className={styles.grandPrizeArtWrap}>
          <div className={styles.crownBackdropSunburst} />
          <img
            src={Day7CrownImg}
            alt="Day 7 VIP Crown Grand Prize"
            className={styles.grandPrizeCrownImg}
          />

          {/* Amazon 'a' Tag Badge on Crown */}
          <div className={styles.amazonTagMini}>
            <span className={styles.amazonLetter}>a</span>
          </div>

          {/* Golden Ribbon Banner (Matching Image 1: "ULTIMATE REWARD") */}
          <div className={styles.ultimateRibbonBanner}>
            <span>ULTIMATE REWARD</span>
          </div>
        </div>

        {/* Text & Action on the Right */}
        <div className={styles.grandPrizeInfoCol}>
          <div className={styles.grandPrizeValueWrap}>
            <span className={styles.grandPrizeBigAmount}>{amount}</span>
            <span className={styles.grandPrizeSubtitle}>{title}</span>
          </div>

          {/* Status / Claim Button */}
          <div className={styles.grandPrizeActionWrap}>
            {isClaimed ? (
              <button type="button" className={styles.btnGrandPrizeClaimed} disabled>
                <span>✓ Claimed</span>
              </button>
            ) : isAvailable ? (
              <button
                type="button"
                className={styles.btnGrandPrizeClaim}
                onClick={onClaim}
              >
                <span>Claim Grand Prize</span>
                <Sparkles size={14} className={styles.btnSparkle} />
              </button>
            ) : (
              <button type="button" className={styles.btnGrandPrizeLocked} disabled>
                <Lock size={13} strokeWidth={2.4} className={styles.btnLockIcon} />
                <span>Unlock on Day 7</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UltimateReward;
