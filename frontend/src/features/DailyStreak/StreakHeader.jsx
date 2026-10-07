import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Flame,
  Gift,
  Home,
  LogOut,
  User,
  Wallet,
} from 'lucide-react';
import { FlameImg, VEsCoinImg } from '../../assets/veloop/index.js';
import styles from './DailyStreak.module.css';

function VeloopLogo() {
  return (
    <div className={styles.navLogoWrap}>
      <div className={styles.logoMarkEmblem}>
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vLogoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.45" stopColor="#818CF8" />
              <stop offset="1" stopColor="#C084FC" />
            </linearGradient>
            <linearGradient id="vWingGrad" x1="4" y1="8" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <path
            d="M5 8L16 26L27 8H20.5L16 16.5L11.5 8H5Z"
            fill="url(#vLogoGrad)"
          />
          <path
            d="M10 8L16 19.5L22 8H17.8L16 12.2L14.2 8H10Z"
            fill="url(#vWingGrad)"
            opacity="0.9"
          />
        </svg>
      </div>
      <div className={styles.logoTextGroup}>
        <span className={styles.logoTextMain}>VE<span className={styles.logoTextAccent}>loop</span></span>
      </div>
    </div>
  );
}

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 650;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value, displayValue]);

  return <>{displayValue}</>;
}

function StreakHeader({ wallet, user, currentStreak = 1, onLogout, isCelebrating }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const balance = wallet?.balance !== undefined && wallet?.balance !== null
    ? Math.round(Number(wallet.balance))
    : 120;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [profileOpen]);

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : 'U';

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Reward Explorer';

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {/* 1. Left Branding */}
        <div className={styles.headerLeftBrand}>
          <VeloopLogo />
        </div>

        {/* 2. Center Navigation Links (Matching Image 1) */}
        <nav className={styles.headerCenterNav} aria-label="Main Navigation">
          <a href="#home" className={styles.navItemLink}>
            <Home size={16} strokeWidth={2.2} className={styles.navItemIcon} />
            <span>Home</span>
          </a>

          <a href="#rewards" className={styles.navItemLink}>
            <Gift size={16} strokeWidth={2.2} className={styles.navItemIcon} />
            <span>Rewards</span>
          </a>

          <div className={styles.navItemActivePill} aria-current="page">
            <div className={styles.activeFlameWrap}>
              <Flame size={15} strokeWidth={2.4} className={styles.activeFlameSvg} />
              <div className={styles.activeFlameAura} />
            </div>
            <span>Daily Streak</span>
          </div>

          <a href="#wallet" className={styles.navItemLink}>
            <Wallet size={16} strokeWidth={2.2} className={styles.navItemIcon} />
            <span>Wallet</span>
          </a>
        </nav>

        {/* 3. Right Section: Wallet Coin Pill & User Profile */}
        <div className={styles.headerRightActions}>
          {/* Wallet Coin Pill (Image 1: Gold coin with balance & chevron) */}
          <div
            id="navbar-wallet-pill"
            className={`${styles.headerCoinPill} ${isCelebrating ? styles.walletCelebrating : ''}`}
            title={`Wallet Balance: ${balance} ${wallet?.currency ?? 'VEs'}`}
          >
            {isCelebrating && <div className={styles.walletShockwave} />}
            <div className={styles.coinIconWrap}>
              <img src={VEsCoinImg} alt="Coin" className={styles.coinImg} />
            </div>
            <span className={styles.coinCountNumber}>
              <AnimatedNumber value={balance} />
            </span>
            <ChevronRight size={14} strokeWidth={2.5} className={styles.coinPillChevron} />
          </div>

          {/* User Profile Avatar with Dropdown Menu */}
          <div className={styles.profileMenuWrap} ref={profileRef}>
            <button
              type="button"
              className={styles.profileAvatarBtn}
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label="User profile menu"
              aria-expanded={profileOpen}
            >
              <div className={styles.avatarCircle}>
                <span className={styles.avatarLetter}>{userInitial}</span>
              </div>
              <ChevronDown size={13} strokeWidth={2.4} className={styles.avatarChevron} />
            </button>

            {profileOpen && (
              <div className={styles.profileDropdownMenu}>
                <div className={styles.profileMenuHeader}>
                  <div className={styles.menuAvatarLarge}>{userInitial}</div>
                  <div className={styles.menuUserDetails}>
                    <strong className={styles.menuUserName}>{userDisplayName}</strong>
                    <span className={styles.menuUserEmail}>{user?.email || 'member@veloop.in'}</span>
                  </div>
                </div>

                <div className={styles.menuStreakBadgeRow}>
                  <div className={styles.menuStreakPill}>
                    <img src={FlameImg} alt="Streak" className={styles.menuFlameIcon} />
                    <span>{currentStreak} Day Streak</span>
                  </div>
                  <span className={styles.menuBalanceText}>{balance} VEs Available</span>
                </div>

                <div className={styles.menuDivider} />

                {onLogout && (
                  <button
                    type="button"
                    className={styles.menuLogoutBtn}
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={15} strokeWidth={2.2} />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default StreakHeader;
