import { LockKeyhole } from 'lucide-react';
import styles from './DailyStreak.module.css';

function TrustFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}><span className={styles.brandMark}><LockKeyhole size={15} /></span><span>VELoop Rewards</span></div>
      <span>Rewards are subject to eligibility and backend verification.</span>
      <span className={styles.footerSecure}><LockKeyhole size={13} /> Secure reward flow</span>
    </footer>
  );
}

export default TrustFooter;
