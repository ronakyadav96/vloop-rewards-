import { ChevronLeft, LogOut } from 'lucide-react';
import { FlameImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function StreakHeader({ onBack, wallet, onLogout }) {
  const balance = wallet?.balance !== undefined && wallet?.balance !== null
    ? Math.round(Number(wallet.balance))
    : 120;

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <button
          className={styles.headerBackBtn}
          type="button"
          onClick={onBack || (() => window.history.back())}
          aria-label="Go back"
        >
          <ChevronLeft size={22} strokeWidth={2.6} />
        </button>

        <div className={styles.headerTitleWrap}>
          <h1 className={styles.headerTitle}>Daily Streak</h1>
          <img className={styles.headerFlame} src={FlameImg} alt="Flame" />
        </div>

        <div className={styles.headerRightActions}>
          <div className={styles.headerGemPill} title={`Wallet Balance: ${wallet?.balance ?? 0} ${wallet?.currency ?? 'VEs'}`}>
            <span className={styles.gemIcon}>💎</span>
            <span className={styles.gemCount}>{balance}</span>
          </div>

          {onLogout && (
            <button
              className={styles.headerLogoutBtn}
              type="button"
              onClick={onLogout}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default StreakHeader;
