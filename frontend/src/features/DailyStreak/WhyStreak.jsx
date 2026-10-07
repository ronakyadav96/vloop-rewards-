import { Calendar, Gift, Trophy, Zap } from 'lucide-react';
import styles from './DailyStreak.module.css';

const benefitsData = [
  {
    icon: Calendar,
    title: 'Daily Check-In',
    desc: 'Check in daily and keep your streak alive.',
    plateClass: styles.benefitPlatePurple,
    iconClass: styles.benefitIconPurple,
  },
  {
    icon: Zap,
    title: 'Bigger Rewards',
    desc: 'Longer streaks unlock increasingly better rewards.',
    plateClass: styles.benefitPlateGold,
    iconClass: styles.benefitIconGold,
  },
  {
    icon: Gift,
    title: 'Exclusive Rewards',
    desc: 'Collect VEs, Amazon gift cards and special bonuses.',
    plateClass: styles.benefitPlatePink,
    iconClass: styles.benefitIconPink,
  },
  {
    icon: Trophy,
    title: 'Ultimate Prize',
    desc: 'Reach Day 7 to unlock the grand VIP reward.',
    plateClass: styles.benefitPlateYellow,
    iconClass: styles.benefitIconYellow,
  },
];

function WhyStreak() {
  return (
    <section className={styles.benefitsSection} aria-label="Benefits of Maintaining Streak">
      <div className={styles.benefitsHeaderRow}>
        <div className={styles.benefitsTitleGroup}>
          <span className={styles.sparkleIcon}>✦</span>
          <h4 className={styles.benefitsSectionTitle}>Why Maintain Your Streak?</h4>
          <span className={styles.sparkleIcon}>✦</span>
        </div>
      </div>

      <div className={styles.benefitsGridRow}>
        {benefitsData.map((item) => {
          const IconComp = item.icon;
          return (
            <div className={styles.benefitCardItem} key={item.title}>
              <div className={`${styles.benefitIconPlate} ${item.plateClass}`}>
                <IconComp size={20} strokeWidth={2.3} className={item.iconClass} />
              </div>
              <div className={styles.benefitTextWrap}>
                <strong className={styles.benefitItemTitle}>{item.title}</strong>
                <p className={styles.benefitItemDesc}>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WhyStreak;
