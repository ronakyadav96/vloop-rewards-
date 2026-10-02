import { Calendar as CalendarIcon, ChevronRight, Flame, Sparkles } from 'lucide-react';
import {
  FlameImg,
  MobileHeroImg,
  TopLeftHeroImg,
  TopRightHeroImg,
} from '../../assets/veloop/index.js';
import StreakStats from './StreakStats.jsx';
import styles from './DailyStreak.module.css';

function HeroBanner({ status }) {
  const streakCount = status?.currentStreak ?? 1;

  return (
    <div className={styles.heroSection}>
      {/* Mobile Top Hero Banner */}
      <div className={styles.mobileHeroBanner}>
        <div className={styles.mobileHeroArt}>
          <div className={styles.mobileHeroGlowBackdrop} />
          <img src={MobileHeroImg} alt="Daily Rewards" className={styles.mobileHeroImg} />
        </div>
        <div className={styles.mobileHeroText}>
          <div className={styles.heroMiniTag}>
            <Sparkles size={12} className={styles.heroMiniSparkle} />
            <span>DAILY CHECK-IN REWARDS</span>
          </div>
          <h2 className={styles.mobileHeroTitle}>
            Login Daily &amp; Earn <span className={styles.yellowText}>Bigger Rewards!</span>
          </h2>
          <p className={styles.mobileHeroSub}>
            Maintain your streak and unlock increasingly valuable rewards every day.
          </p>
        </div>
      </div>

      {/* Mobile Streak Toolbar with Glowing Fire Aura */}
      <div className={styles.mobileStreakBar}>
        <div className={styles.mobileStreakPill}>
          <div className={styles.flameHaloRing}>
            <img src={FlameImg} alt="Flame" className={styles.mobileFlameImg} />
          </div>
          <span className={styles.mobileStreakNumber}>{streakCount} Day Streak</span>
          <span className={styles.mobileStreakTag}>Active</span>
        </div>
        <a href="#streak-grid" className={styles.mobileCalendarLink}>
          <CalendarIcon size={14} />
          <span>Streak Calendar</span>
          <ChevronRight size={14} />
        </a>
      </div>

      {/* Desktop Hero Left Card */}
      <div className={styles.desktopHeroCard}>
        <div className={styles.desktopHeroBackdropGlow} />

        <div className={styles.desktopHeroContent}>
          <div className={styles.desktopHeroTextWrap}>
            <div className={styles.heroMiniTag}>
              <Sparkles size={13} className={styles.heroMiniSparkle} />
              <span>DAILY CHECK-IN</span>
            </div>
            <h2 className={styles.desktopHeroTitle}>
              Daily Check-In<br />
              <span className={styles.heroRewardsText}>Rewards</span>
            </h2>
            <p className={styles.desktopHeroSubtitle}>
              Check in every day, maintain consecutive progress, and unlock exciting daily rewards!
            </p>
          </div>

          <div className={styles.desktopHeroVisualWrap}>
            <div className={styles.heroVisualAura} />
            <img src={TopLeftHeroImg} alt="Calendar" className={styles.heroCalendarArt} />
            <div className={styles.vrBadge}>
              <span className={styles.vrText}>VR</span>
            </div>
            <img src={TopRightHeroImg} alt="Gifts" className={styles.heroGiftArt} />
          </div>
        </div>

        {/* Embedded Stats row inside the hero container */}
        <StreakStats status={status} />
      </div>
    </div>
  );
}

export default HeroBanner;
