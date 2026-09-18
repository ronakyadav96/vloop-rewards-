import { ArrowLeft, Bell, ChevronDown, Flame, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './DailyStreak.module.css';

function StreakHeader({ onBack, wallet, onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <button className={styles.backButton} type="button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={18} strokeWidth={2.4} />
          <span>Back</span>
        </button>

        <Link className={styles.brand} to="/daily-streak" aria-label="VELoop home">
          <span className={styles.brandMark}><Flame size={18} fill="currentColor" /></span>
          <span>VE<span className={styles.brandAccent}>Loop</span></span>
        </Link>

        <div className={styles.headerActions}>
          <div className={styles.walletPill} title="Backend wallet balance">
            <Gem size={15} />
            <span>{wallet?.balance ?? '—'} {wallet?.currency ?? 'VE'}</span>
          </div>
          <button className={styles.iconButton} type="button" aria-label="Notifications">
            <Bell size={18} />
            <span className={styles.notificationDot} />
          </button>
          <button className={styles.profileButton} type="button" onClick={onLogout} aria-label="Sign out">
            <span className={styles.avatar}>V</span>
            <ChevronDown size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default StreakHeader;
