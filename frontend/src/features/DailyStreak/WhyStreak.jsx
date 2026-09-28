import {
  BiggerStreakImg,
  ExclusiveRewardImg,
  StayActiveImg,
  TrustShieldImg,
} from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

const benefits = [
  {
    icon: StayActiveImg,
    title: 'Stay Active',
    desc: 'Keep your streak alive & earn more!',
  },
  {
    icon: BiggerStreakImg,
    title: 'Bigger Streak',
    desc: 'More consecutive logins, bigger rewards!',
  },
  {
    icon: ExclusiveRewardImg,
    title: 'Exclusive Rewards',
    desc: 'Get coins, gift cards & special bonuses!',
  },
  {
    icon: TrustShieldImg,
    title: "Don't Miss Out",
    desc: 'Come back every day & unlock all rewards!',
  },
];

function WhyStreak() {
  return (
    <section className={styles.whyMaintainSection} aria-label="Why Maintain Your Streak">
      <div className={styles.whyMaintainHeading}>
        <span className={styles.sparkleIcon}>✦</span>
        <span>Why Maintain Your Streak?</span>
        <span className={styles.sparkleIcon}>✦</span>
      </div>

      <div className={styles.benefitsGrid}>
        {benefits.map((item) => (
          <div className={styles.benefitCard} key={item.title}>
            <div className={styles.benefitIconWrap}>
              <img src={item.icon} alt={item.title} className={styles.benefitImg} />
            </div>
            <div className={styles.benefitTextWrap}>
              <strong className={styles.benefitTitle}>{item.title}</strong>
              <p className={styles.benefitDesc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyStreak;
