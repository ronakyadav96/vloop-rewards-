import { ChevronLeft, LogOut } from 'lucide-react';
import { FlameImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function GemIcon({ size = 18, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gemFacetGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3E8FF" />
          <stop offset="0.45" stopColor="#C084FC" />
          <stop offset="1" stopColor="#7E22CE" />
        </linearGradient>
      </defs>
      <path
        d="M6 3H18L22 9L12 21L2 9L6 3Z"
        fill="url(#gemFacetGrad)"
        stroke="#E9D5FF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M2 9H22M6 3L10 9L12 21M18 3L14 9L12 21M12 3V9"
        stroke="rgba(255, 255, 255, 0.55)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <div className={styles.headerTitleWrap}>
          <h1 className={styles.headerTitle}>Daily Streak</h1>
          <div className={styles.headerFlameWrap}>
            <img className={styles.headerFlame} src={FlameImg} alt="Flame" />
            <div className={styles.headerFlameGlow} />
          </div>
        </div>

        <div className={styles.headerRightActions}>
          <div className={styles.headerGemPill} title={`Wallet Balance: ${wallet?.balance ?? 0} ${wallet?.currency ?? 'VEs'}`}>
            <GemIcon size={16} className={styles.headerGemSvg} />
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
              <LogOut size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default StreakHeader;
