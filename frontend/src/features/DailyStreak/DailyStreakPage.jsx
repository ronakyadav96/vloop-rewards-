import { AlertCircle, KeyRound, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AUTH_TOKEN_KEY,
  claimDailyStreak,
  getDailyStreak,
  getDailyStreakHistory,
  isAuthenticationError,
} from '../../services/api.js';
import { isDemoMode, mockStreakHistory, mockStreakResponse } from '../../services/mockStreak.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { TopRightHeroImg, VEsCoinImg } from '../../assets/veloop/index.js';
import CpaDemo from './CpaDemo.jsx';
import HeroBanner from './HeroBanner.jsx';
import RecentActivityAndBenefits from './RecentActivityAndBenefits.jsx';
import RewardFlyAnimation from './RewardFlyAnimation.jsx';
import RewardGrid from './RewardGrid.jsx';
import SidebarNav from './SidebarNav.jsx';
import StreakHeader from './StreakHeader.jsx';
import StreakLoader from './StreakLoader.jsx';
import StreakSkeleton from './StreakSkeleton.jsx';
import TrustFooter from './TrustFooter.jsx';
import UltimateReward from './UltimateReward.jsx';
import WhyStreak from './WhyStreak.jsx';
import { useServerCountdown } from './useServerCountdown.js';
import styles from './DailyStreak.module.css';

function AuthRequired() {
  return (
    <main className={styles.centerState}>
      <div className={styles.centerIcon}><KeyRound size={24} /></div>
      <span className={styles.sectionKicker}>AUTHENTICATION REQUIRED</span>
      <h1>Sign in to enter your loop.</h1>
      <p>Your streak and wallet are tied to your verified account. Sign in, then return here to continue.</p>
      <Link className={styles.primaryBtnLink} to="/login">Go to sign in</Link>
    </main>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <main className={styles.centerState}>
      <div className={styles.centerIcon}><AlertCircle size={24} /></div>
      <span className={styles.sectionKicker}>COULDN'T LOAD YOUR LOOP</span>
      <h1>We hit a small pause.</h1>
      <p>{message || 'The Daily Streak service is unavailable right now. Please try again.'}</p>
      <button className={styles.primaryBtnLink} type="button" onClick={onRetry}>
        Try again <RefreshCw size={16} />
      </button>
    </main>
  );
}

function EmptyState() {
  return (
    <main className={styles.centerState}>
      <div className={styles.centerIcon}><AlertCircle size={24} /></div>
      <h1>No active streak yet.</h1>
      <p>There is no active reward configuration available right now. Check back soon.</p>
    </main>
  );
}

function InlineNotice({ notice, onClose }) {
  if (!notice) return null;
  const noticeClass = notice.type === 'error'
    ? styles.noticeError
    : notice.type === 'reset'
      ? styles.noticeReset
      : styles.noticeSuccess;

  return (
    <div
      className={`${styles.inlineNotice} ${noticeClass}`}
      role={notice.type === 'error' || notice.type === 'reset' ? 'alert' : 'status'}
    >
      <span>{notice.message}</span>
      {onClose && <button type="button" onClick={onClose} aria-label="Dismiss message">×</button>}
    </div>
  );
}

function DailyStreakPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [claimCard, setClaimCard] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (isDemoMode()) {
      setStatus(mockStreakResponse);
      setHistory(mockStreakHistory.claims);
      setLoading(false);
      return;
    }

    if (!localStorage.getItem(AUTH_TOKEN_KEY)) {
      setLoading(false);
      setError({ auth: true });
      return;
    }

    try {
      const data = await getDailyStreak();
      setStatus(data);
    } catch (requestError) {
      setError({
        auth: isAuthenticationError(requestError),
        message: requestError?.response?.data?.error?.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    if (isDemoMode()) {
      setHistory(mockStreakHistory.claims);
      return;
    }
    if (!localStorage.getItem(AUTH_TOKEN_KEY)) return;

    try {
      const histData = await getDailyStreakHistory(15);
      if (histData?.claims) {
        setHistory(histData.claims);
      }
    } catch {
      // Fallback silently to claimed cards from status
    }
  }, []);

  useEffect(() => {
    loadStatus();
    loadHistory();
  }, [loadStatus, loadHistory]);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible' && status) {
        loadStatus();
        loadHistory();
      }
    };
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => document.removeEventListener('visibilitychange', refreshWhenVisible);
  }, [loadStatus, loadHistory, status]);

  const timerCard = status?.cards?.find((card) => card.nextClaimAt && card.state === 'LOCKED');
  const timerTarget = timerCard?.nextClaimAt || (status?.streakStatus === 'COMPLETED' ? status.nextClaimAt : null);
  const countdown = useServerCountdown({
    serverTime: status?.serverTime,
    nextClaimAt: timerTarget,
    onExpired: loadStatus,
  });

  const resetNotice = status?.resetOccurred && status.lastReset
    ? {
        type: 'reset',
        message: `Your previous streak was reset because Day ${status.lastReset.missedDay} missed its claim window. You are starting a new loop at Day ${status.currentDay} with a ${status.currentStreak}-day streak.`,
      }
    : null;

  const finalCard = useMemo(
    () => status?.cards?.find((card) => card.day === 7),
    [status]
  );

  const [flyData, setFlyData] = useState(null);
  const [walletCelebrating, setWalletCelebrating] = useState(false);

  const handleFlyComplete = useCallback(() => {
    setWalletCelebrating(true);
    setTimeout(() => {
      setWalletCelebrating(false);
    }, 1400);
  }, []);

  const handleClaim = async () => {
    if (!claimCard || claiming) return;
    if (isDemoMode()) {
      setClaimCard(null);
      setNotice({ type: 'success', message: 'Preview only: no backend claim was sent.' });
      return;
    }

    const currentClaim = claimCard;
    const sourceEl = document.querySelector(`[data-day="${currentClaim.day}"]`) || document.getElementById('streak-grid');
    const startRect = sourceEl ? sourceEl.getBoundingClientRect() : null;
    const walletEl = document.getElementById('navbar-wallet-pill');
    const endRect = walletEl ? walletEl.getBoundingClientRect() : null;

    setClaiming(true);
    try {
      const response = await claimDailyStreak();
      setClaimCard(null);

      // Trigger reward pop & flight animation
      if (startRect && endRect) {
        setFlyData({
          active: true,
          startX: Math.round(startRect.left + startRect.width / 2),
          startY: Math.round(startRect.top + startRect.height / 2),
          endX: Math.round(endRect.left + endRect.width / 2),
          endY: Math.round(endRect.top + endRect.height / 2),
          day: currentClaim.day,
          rewardType: currentClaim.reward?.rewardType,
          amount: currentClaim.reward?.amount,
          title: response?.claim?.reward?.title,
        });
      }

      await Promise.all([loadStatus(), loadHistory()]);

      setNotice({
        type: 'success',
        message: response?.claim?.reward?.title
          ? `${response.claim.reward.title} claimed! Added to your wallet.`
          : 'Reward claim confirmed by the backend.',
      });
    } catch (requestError) {
      setClaimCard(null);
      const message =
        requestError?.response?.data?.error?.message ||
        'The claim could not be completed. Your streak was not changed.';
      setError({ auth: isAuthenticationError(requestError), message });
      setNotice({ type: 'error', message });
    } finally {
      setClaiming(false);
    }
  };

  if (loading && !status) return <><StreakLoader /><StreakSkeleton /></>;
  if (error?.auth) return <AuthRequired />;
  if (error && !status) return <ErrorState message={error.message} onRetry={loadStatus} />;
  if (!status?.cards?.length) return <EmptyState />;

  return (
    <div className={styles.pageShell}>
      {/* 1. Cinematic Background Atmosphere (Floating coins, gift boxes, stars & glowing orbs) */}
      <div className={styles.cinematicAtmosphere} aria-hidden="true">
        {/* Slow-moving glowing orbs */}
        <div className={`${styles.ambientOrb} ${styles.orb1}`} />
        <div className={`${styles.ambientOrb} ${styles.orb2}`} />
        <div className={`${styles.ambientOrb} ${styles.orb3}`} />

        {/* Ambient floating 3D coins blurred in background */}
        <img src={VEsCoinImg} alt="" className={`${styles.bgFloatingAsset} ${styles.bgCoin1}`} />
        <img src={VEsCoinImg} alt="" className={`${styles.bgFloatingAsset} ${styles.bgCoin2}`} />
        <img src={VEsCoinImg} alt="" className={`${styles.bgFloatingAsset} ${styles.bgCoin3}`} />

        {/* Ambient floating 3D gift box */}
        <img src={TopRightHeroImg} alt="" className={`${styles.bgFloatingAsset} ${styles.bgGift1}`} />

        {/* Twinkling star particles */}
        <span className={`${styles.ambientStar} ${styles.star1}`}>✦</span>
        <span className={`${styles.ambientStar} ${styles.star2}`}>★</span>
        <span className={`${styles.ambientStar} ${styles.star3}`}>✦</span>
        <span className={`${styles.ambientStar} ${styles.star4}`}>★</span>
        <span className={`${styles.ambientStar} ${styles.star5}`}>✦</span>
        <span className={`${styles.ambientStar} ${styles.star6}`}>★</span>
      </div>

      {/* 2. Top Navbar with branding, nav links, coin pill & user menu */}
      <StreakHeader
        wallet={status.wallet}
        user={user}
        currentStreak={status.currentStreak ?? 1}
        onLogout={handleLogout}
        isCelebrating={walletCelebrating}
      />

      {isDemoMode() && (
        <div className={styles.demoBanner}>Preview mode · values are mock API data</div>
      )}

      {/* 3. Main Dashboard Workspace (Sidebar dock + Main Canvas) */}
      <div className={styles.dashboardLayout}>
        {/* Desktop Icon Sidebar Dock (Image 1) */}
        <SidebarNav
          activeItem={activeNav}
          onItemClick={(item) => setActiveNav(item)}
        />

        {/* Main Content Area */}
        <main className={styles.mainContentCanvas}>
          <InlineNotice
            notice={
              notice ||
              resetNotice ||
              (error && status
                ? { type: 'error', message: error.message || 'The latest state could not be refreshed.' }
                : null)
            }
            onClose={
              resetNotice && !notice
                ? undefined
                : () => {
                    setNotice(null);
                    setError(null);
                  }
            }
          />

          {/* Top Row: Daily Check-In Hero (Left) + Day 7 Grand Prize Panel (Right) */}
          <section className={styles.topSectionRow}>
            <div className={styles.topSectionLeft}>
              <HeroBanner status={status} />
            </div>

            <div className={styles.topSectionRight}>
              <UltimateReward
                card={finalCard}
                reward={finalCard?.reward}
                currentStreak={status?.currentStreak ?? 1}
                onClaim={() => {
                  if (finalCard?.state === 'AVAILABLE' || finalCard?.state === 'TODAY') {
                    setClaimCard(finalCard);
                  }
                }}
              />
            </div>
          </section>

          {/* Centerpiece: 7-Day Streak Challenge Milestone Journey */}
          <RewardGrid
            cards={status.cards}
            countdown={countdown.label}
            onSelect={(card) => setClaimCard(card)}
          />

          {/* Lower Section: Rewards Showcase + Real Backend Recent Activity (Image 2) */}
          <RecentActivityAndBenefits
            historyClaims={history}
            cards={status.cards}
            onExploreRewards={() => {
              const el = document.getElementById('streak-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Benefits Section: Why Maintain Your Streak? (4 Compact Benefit Cards) */}
          <WhyStreak />

          {/* Footer: 4 Feature Pills + Security Verification */}
          <TrustFooter />
        </main>
      </div>

      {/* CPA Advertisement Demo State Modal */}
      <CpaDemo
        card={claimCard}
        busy={claiming}
        onClose={() => !claiming && setClaimCard(null)}
        onConfirm={handleClaim}
      />

      {/* Reward Collection Flying Animation (Smooth Flight to Navbar) */}
      <RewardFlyAnimation flyData={flyData} onComplete={handleFlyComplete} />
    </div>
  );
}

export default DailyStreakPage;
