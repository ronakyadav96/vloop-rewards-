import {
  Day4BoxImg,
  Day7CrownImg,
  ExclusiveRewardImg,
  TopRightHeroImg,
  VEsCoinImg,
} from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function AtmosphericDecorations() {
  return (
    <div className={styles.cinematicAtmosphere} aria-hidden="true">
      {/* 1. Slow-moving luminous ambient glowing orbs */}
      <div className={`${styles.ambientOrb} ${styles.orb1}`} />
      <div className={`${styles.ambientOrb} ${styles.orb2}`} />
      <div className={`${styles.ambientOrb} ${styles.orb3}`} />
      <div className={`${styles.ambientOrb} ${styles.orb4}`} />

      {/* 2. Floating 3D Reward Object "Stickers" (Edges & Background Depth) */}
      
      {/* Left Edge: 3D Gold Coin (Floating & Rotating) */}
      <div className={`${styles.bgSticker} ${styles.stickerCoinLeft}`}>
        <div className={styles.stickerGlowHaloGold} />
        <img src={VEsCoinImg} alt="" className={styles.stickerImg} />
      </div>

      {/* Left Edge Lower: Secondary Mini Gold Coin */}
      <div className={`${styles.bgSticker} ${styles.stickerCoinLeftMini}`}>
        <div className={styles.stickerGlowHaloGold} />
        <img src={VEsCoinImg} alt="" className={styles.stickerImg} />
      </div>

      {/* Bottom-Left Margin: 3D Purple Gift Box with Golden Ribbon */}
      <div className={`${styles.bgSticker} ${styles.stickerGiftBottomLeft}`}>
        <div className={styles.stickerGlowHaloPurple} />
        <img src={TopRightHeroImg || Day4BoxImg} alt="" className={styles.stickerImg} />
      </div>

      {/* Right Edge: 3D Gold Coin */}
      <div className={`${styles.bgSticker} ${styles.stickerCoinRight}`}>
        <div className={styles.stickerGlowHaloGold} />
        <img src={VEsCoinImg} alt="" className={styles.stickerImg} />
      </div>

      {/* Top-Right Margin: Floating 3D Golden VIP Crown */}
      <div className={`${styles.bgSticker} ${styles.stickerCrownTopRight}`}>
        <div className={styles.stickerGlowHaloCrown} />
        <img src={Day7CrownImg} alt="" className={styles.stickerImg} />
      </div>

      {/* Mid-Right Margin: Floating 3D Treasure Chest with Coins & Gems */}
      <div className={`${styles.bgSticker} ${styles.stickerChestMidRight}`}>
        <div className={styles.stickerGlowHaloPurple} />
        <img src={ExclusiveRewardImg} alt="" className={styles.stickerImg} />
      </div>

      {/* 3. Shimmering Multi-Point Stars & Sparkles (Framing the Layout) */}
      <span className={`${styles.ambientStar} ${styles.star1}`}>✦</span>
      <span className={`${styles.ambientStar} ${styles.star2}`}>★</span>
      <span className={`${styles.ambientStar} ${styles.star3}`}>✦</span>
      <span className={`${styles.ambientStar} ${styles.star4}`}>★</span>
      <span className={`${styles.ambientStar} ${styles.star5}`}>✦</span>
      <span className={`${styles.ambientStar} ${styles.star6}`}>★</span>
      <span className={`${styles.ambientStar} ${styles.star7}`}>✨</span>
      <span className={`${styles.ambientStar} ${styles.star8}`}>✦</span>

      {/* 4. Slow-drifting gold dust particles */}
      <div className={`${styles.goldDustParticle} ${styles.dust1}`} />
      <div className={`${styles.goldDustParticle} ${styles.dust2}`} />
      <div className={`${styles.goldDustParticle} ${styles.dust3}`} />
      <div className={`${styles.goldDustParticle} ${styles.dust4}`} />
    </div>
  );
}

export default AtmosphericDecorations;
