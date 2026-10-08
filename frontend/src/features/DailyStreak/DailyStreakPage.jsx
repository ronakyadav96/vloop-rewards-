import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, CircleAlert, Lock, RefreshCw } from 'lucide-react';
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
import CpaDemo from './CpaDemo.jsx';
import DailyStreakView from './DailyStreakView.jsx';
import RewardFlyAnimation from './RewardFlyAnimation.jsx';
import StreakSkeleton from './StreakSkeleton.jsx';
import { isClaimable } from './streakFormat.js';
import { useServerCountdown } from './useServerCountdown.js';
import { buildViewModel } from './viewModel.js';
import styles from './StreakOverlays.module.css';

function AuthRequired() {
  return (
    <main className={styles.centerState}>
      <div className={styles.centerIcon}><Lock size={30} /></div>
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
      <div className={styles.centerIcon}><CircleAlert size={30} /></div>
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
      <div className={styles.centerIcon}><CalendarDays size={30} /></div>
      <h1>No active streak yet.</h1>
      <p>There is no active reward configuration available right now. Check back soon.</p>
    </main>
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
  // `resetOccurred` is only true on the one response that performed the reset;
  // keep it for the session so a later refresh doesn't hide it.
  const [lastReset, setLastReset] = useState(null);

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
      if (data?.resetOccurred && data.lastReset) setLastReset(data.lastReset);
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

  const resetNotice = lastReset && status
    ? {
        type: 'reset',
        message: `Your previous streak was reset because Day ${lastReset.missedDay} missed its claim window. You are starting a new loop at Day ${status.currentDay} with a ${status.currentStreak}-day streak.`,
      }
    : null;

  const finalCard = useMemo(
    () => (status?.cards?.length ? status.cards[status.cards.length - 1] : null),
    [status]
  );

  const [flyData, setFlyData] = useState(null);
  const [walletCelebrating, setWalletCelebrating] = useState(false);
  const [celebrateDay, setCelebrateDay] = useState(null);
  // While coins are in flight the navbar keeps showing the pre-claim backend
  // balance; it switches to the refreshed backend balance when they land.
  const [heldWallet, setHeldWallet] = useState(null);

  const handleWalletHit = useCallback(() => {
    setHeldWallet(null);
    setWalletCelebrating(true);
    setTimeout(() => {
      setWalletCelebrating(false);
    }, 1400);
  }, []);

  const handleFlyFinish = useCallback(() => {
    setFlyData(null);
    setHeldWallet(null);
    setCelebrateDay(null);
  }, []);

  const handleClaim = async () => {
    if (!claimCard || claiming) return;
    if (isDemoMode()) {
      setClaimCard(null);
      setNotice({ type: 'success', message: 'Preview only: no backend claim was sent.' });
      return;
    }

    const currentClaim = claimCard;
    // Start the reward burst from whichever view of the day is on screen.
    const inView = (el) => {
      const rect = el?.getBoundingClientRect();
      return rect && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    };
    const sourceEl = [
      document.querySelector(`[data-day="${currentClaim.day}"]`),
      document.querySelector(`[data-node-day="${currentClaim.day}"]`),
    ].find(inView);
    const startRect = sourceEl
      ? sourceEl.getBoundingClientRect()
      : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    const walletEl = document.getElementById('navbar-wallet-pill');
    const endRect = walletEl ? walletEl.getBoundingClientRect() : null;

    setClaiming(true);
    try {
      const response = await claimDailyStreak();
      setClaimCard(null);

      // Visual feedback only, driven by the reward the backend just confirmed.
      const confirmedReward = response?.claim?.reward || currentClaim.reward;
      const pendingFulfillment = response?.claim?.status === 'PENDING_FULFILLMENT';
      setCelebrateDay(currentClaim.day);
      if (endRect) {
        if (response?.wallet) setHeldWallet(status?.wallet ?? null);
        setFlyData({
          id: Date.now(),
          startX: Math.round(startRect.left + startRect.width / 2),
          startY: Math.round(startRect.top + startRect.height / 2),
          endX: Math.round(endRect.left + endRect.width / 2),
          endY: Math.round(endRect.top + endRect.height / 2),
          reward: confirmedReward,
          pending: pendingFulfillment,
        });
      }

      await Promise.all([loadStatus(), loadHistory()]);

      setNotice({
        type: 'success',
        message: response?.claim?.reward?.title
          ? pendingFulfillment
            ? `${response.claim.reward.title} claimed! Delivery is pending.`
            : `${response.claim.reward.title} claimed! Added to your wallet.`
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

  if (loading && !status) return <StreakSkeleton />;
  if (error?.auth) return <AuthRequired />;
  if (error && !status) return <ErrorState message={error.message} onRetry={loadStatus} />;
  if (!status?.cards?.length) return <EmptyState />;

  const openClaim = (card) => {
    if (isClaimable(card)) setClaimCard(card);
  };

  const activeNotice =
    notice ||
    resetNotice ||
    (error && status ? { type: 'error', message: error.message || 'The latest state could not be refreshed.' } : null);
  const dismissNotice = resetNotice && !notice
    ? undefined
    : () => {
        setNotice(null);
        setError(null);
      };

  const vm = buildViewModel({
    status,
    history,
    countdown: countdown.label,
    lastReset,
    wallet: heldWallet ?? status.wallet,
    user,
  });

  return (
    <>
      <DailyStreakView
        vm={vm}
        notice={activeNotice}
        onDismissNotice={dismissNotice}
        walletCelebrating={walletCelebrating}
        celebrateDay={celebrateDay}
        demoMode={isDemoMode()}
        onClaim={openClaim}
        onLogout={handleLogout}
      />
      <CpaDemo
        card={claimCard}
        isFinal={claimCard?.day === finalCard?.day}
        busy={claiming}
        onClose={() => !claiming && setClaimCard(null)}
        onConfirm={handleClaim}
      />
      <RewardFlyAnimation flyData={flyData} onWalletHit={handleWalletHit} onFinish={handleFlyFinish} />
    </>
  );
}

export default DailyStreakPage;
