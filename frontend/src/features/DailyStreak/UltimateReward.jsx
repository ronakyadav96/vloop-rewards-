import { ChevronRight, Crown, Lock, Sparkles, Trophy } from 'lucide-react';
import { Day5AmazonImg, Day7CrownImg, VEsCoinImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function UltimateReward({ card, reward, currentStreak = 1, onClaim }) {
  const isClaimed = card?.state === 'CLAIMED';
  const isAvailable = card?.state === 'AVAILABLE' || card?.state === 'TODAY';
  const amount = reward?.amount ? `₹${Math.round(Number(reward.amount))}` : '₹5';
  const title = reward?.title || 'Amazon Gift Card';

  return (
    <div className={styles.grandPrizePanel}>
      {/* Radiant Gold/Purple Ambient Glow */}
      <div className={styles.grandPrizeAmbientGlow} />
      <div className={styles.grandPrizeLightRays} />

      {/* 1. Header Row (Crown Icon, "Next Reward - Day 7 Grand Prize >") */}
      <div className={styles.grandPrizeHeaderRow}>
        <div className={styles.grandPrizeTitleGroup}>
          <div className={styles.crownIconPlate}>
            <Crown size={17} strokeWidth={2.4} className={styles.headerCrownSvg} />
          </div>
          <div className={styles.headerTitleWrap}>
            <span className={styles.headerKicker}>Next Reward</span>
            <h3 className={styles.headerTitleText}>Day 7 Grand Prize</h3>
          </div>
        </div>
        <ChevronRight size={18} strokeWidth={2.4} className={styles.headerChevronSvg} />
      </div>

      {/* 2. Main Content: 3D Crown as the Visual Hero + Big Bright ₹5 */}
      <div className={styles.grandPrizeBody}>
        {/* Visual Hero: 3D Crown on Pedestal with Amazon Badge & Animated Light Sweep */}
        <div className={styles.grandPrizeArtWrap}>
          <div className={styles.crownBackdropSunburst} />
          <div className={styles.crownPedestalGlow} />

          {/* Floating 3D VIP Crown */}
          <div className={styles.crownFloatContainer}>
            <img
              src={Day7CrownImg}
              alt="Day 7 VIP Crown"
              className={styles.grandPrizeCrownImg}
            />
            {/* Animated Golden Shine Sweep */}
            <div className={styles.crownShineSweep} />
          </div>

          {/* Mini Floating Gold Coin near Crown */}
          <div className={styles.crownFloatingCoin}>
            <img src={VEsCoinImg} alt="" className={styles.crownMiniCoinImg} />
          </div>

          {/* Amazon 'a' Logo Badge */}
          <div className={styles.amazonTagMini}>
            <span className={styles.amazonLetter}>a</span>
          </div>

          {/* ULTIMATE REWARD Golden Ribbon Banner */}
          <div className={styles.ultimateRibbonBanner}>
            <span>ULTIMATE REWARD</span>
          </div>
        </div>

        {/* Text & Action on the Right: ₹5 BIG & BRIGHT */}
        <div className={styles.grandPrizeInfoCol}>
          <div className={styles.grandPrizeValueWrap}>
            <span className={styles.grandPrizeBigAmount}>{amount}</span>
            <span className={styles.grandPrizeSubtitle}>{title}</span>
          </div>

          {/* Action / State Button */}
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
