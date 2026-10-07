import { Gift, Home, User, Wallet } from 'lucide-react';
import styles from './DailyStreak.module.css';

function SidebarNav({ activeItem = 'home', onItemClick }) {
  return (
    <aside className={styles.sidebarDock} aria-label="Quick Navigation">
      <nav className={styles.sidebarNavList}>
        <button
          type="button"
          className={`${styles.sidebarBtn} ${activeItem === 'home' ? styles.sidebarBtnActive : ''}`}
          onClick={() => onItemClick && onItemClick('home')}
          title="Home"
          aria-label="Home"
        >
          <Home size={18} strokeWidth={2.3} className={styles.sidebarIcon} />
          <span className={styles.sidebarTooltip}>Home</span>
        </button>

        <button
          type="button"
          className={`${styles.sidebarBtn} ${activeItem === 'rewards' ? styles.sidebarBtnActive : ''}`}
          onClick={() => onItemClick && onItemClick('rewards')}
          title="Rewards"
          aria-label="Rewards"
        >
          <Gift size={18} strokeWidth={2.3} className={styles.sidebarIcon} />
          <span className={styles.sidebarTooltip}>Rewards</span>
        </button>

        <button
          type="button"
          className={`${styles.sidebarBtn} ${activeItem === 'wallet' ? styles.sidebarBtnActive : ''}`}
          onClick={() => onItemClick && onItemClick('wallet')}
          title="Wallet"
          aria-label="Wallet"
        >
          <Wallet size={18} strokeWidth={2.3} className={styles.sidebarIcon} />
          <span className={styles.sidebarTooltip}>Wallet</span>
        </button>

        <button
          type="button"
          className={`${styles.sidebarBtn} ${activeItem === 'profile' ? styles.sidebarBtnActive : ''}`}
          onClick={() => onItemClick && onItemClick('profile')}
          title="Profile"
          aria-label="Profile"
        >
          <User size={18} strokeWidth={2.3} className={styles.sidebarIcon} />
          <span className={styles.sidebarTooltip}>Profile</span>
        </button>
      </nav>
    </aside>
  );
}

export default SidebarNav;
