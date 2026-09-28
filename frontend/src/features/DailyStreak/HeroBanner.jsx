import { Calendar as CalendarIcon, ChevronRight, Flame } from 'lucide-react';
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
          <img src={MobileHeroImg} alt="Daily Rewards" className={styles.mobileHeroImg} />
        </div>
        <div className={styles.mobileHeroText}>
          <h2 className={styles.mobileHeroTitle}>
            Login Daily &amp; Earn <span className={styles.yellowText}>Bigger Rewards!</span>
          </h2>
          <p className={styles.mobileHeroSub}>
            Maintain your streak and unlock exciting rewards every day.
          </p>
        </div>
      </div>

      {/* Mobile Streak Toolbar */}
      <div className={styles.mobileStreakBar}>
        <div className={styles.mobileStreakPill}>
          <img src={FlameImg} alt="Flame" className={styles.mobileFlameImg} />
          <span>{streakCount} Day Streak</span>
        </div>
        <a href="#streak-grid" className={styles.mobileCalendarLink}>
          <CalendarIcon size={14} />
          <span>Streak Calendar</span>
          <ChevronRight size={14} />
        </a>
      </div>

      {/* Desktop Hero Left Card */}
      <div className={styles.desktopHeroCard}>
        <div className={styles.desktopHeroContent}>
          <div className={styles.desktopHeroTextWrap}>
            <h2 className={styles.desktopHeroTitle}>
              Daily Check-In<br />
              <span className={styles.heroRewardsText}>Rewards</span>
            </h2>
            <p className={styles.desktopHeroSubtitle}>
              Check in every day and earn exciting rewards!
            </p>
          </div>

          <div className={styles.desktopHeroVisualWrap}>
            <img src={TopLeftHeroImg} alt="Calendar" className={styles.heroCalendarArt} />
            <div className={styles.vrBadge}>VR</div>
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
