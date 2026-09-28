import { AlertCircle, KeyRound, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AUTH_TOKEN_KEY,
  claimDailyStreak,
  getDailyStreak,
  isAuthenticationError,
} from '../../services/api.js';
import { isDemoMode, mockStreakResponse } from '../../services/mockStreak.js';
import { useAuth } from '../../context/AuthContext.jsx';
import CpaDemo from './CpaDemo.jsx';
import HeroBanner from './HeroBanner.jsx';
import RewardGrid from './RewardGrid.jsx';
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
  const { signOut } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [claimCard, setClaimCard] = useState(null);
  const [claiming, setClaiming] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (isDemoMode()) {
      setStatus(mockStreakResponse);
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

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible' && status) loadStatus();
    };
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => document.removeEventListener('visibilitychange', refreshWhenVisible);
  }, [loadStatus, status]);

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

  const finalReward = useMemo(
    () => status?.cards?.find((card) => card.day === 7)?.reward,
    [status]
  );

  const handleClaim = async () => {
    if (!claimCard || claiming) return;
    if (isDemoMode()) {
      setClaimCard(null);
      setNotice({ type: 'success', message: 'Preview only: no backend claim was sent.' });
      return;
    }

    setClaiming(true);
    try {
      const response = await claimDailyStreak();
      setClaimCard(null);
      await loadStatus();
      setNotice({
        type: 'success',
        message: response?.claim?.reward?.title
          ? `${response.claim.reward.title} confirmed by the backend.`
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
      {/* Navbar matching Page 62 & 63 */}
      <StreakHeader
        onBack={() => window.history.back()}
        wallet={status.wallet}
        onLogout={handleLogout}
      />

      {isDemoMode() && (
        <div className={styles.demoBanner}>Preview mode · values are mock API data</div>
      )}

      <main className={styles.pageContent}>
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

        {/* Top Hero Section (Desktop 2-column: Hero Left + Ultimate Right; Mobile stacked) */}
        <section className={styles.topSectionRow}>
          <div className={styles.topSectionLeft}>
            <HeroBanner status={status} />
          </div>

          <div className={styles.topSectionRight}>
            <UltimateReward
              reward={finalReward}
              currentStreak={status?.currentStreak ?? 1}
              showDesktopBadge={true}
            />
          </div>
        </section>

        {/* 7 Daily Reward Cards */}
        <RewardGrid
          cards={status.cards}
          countdown={countdown.label}
          onSelect={(card) => setClaimCard(card)}
        />

        {/* Why Maintain Your Streak Section */}
        <WhyStreak />
      </main>

      {/* Trust strip footer */}
      <TrustFooter />

      {/* CPA Advertisement Demo State Modal */}
      <CpaDemo
        card={claimCard}
        busy={claiming}
        onClose={() => !claiming && setClaimCard(null)}
        onConfirm={handleClaim}
      />
    </div>
  );
}

export default DailyStreakPage;
