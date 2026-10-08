import { useEffect, useState } from 'react';
import { VEsCoinImg } from '../../assets/veloop/index.js';
import Sparkle from './Sparkle.jsx';
import { Check, Gift } from 'lucide-react';
import { describeReward, isGiftCardReward, prefersReducedMotion } from './streakFormat.js';
import styles from './StreakOverlays.module.css';

const COIN_COUNT = 7;
const COIN_STAGGER_MS = 70;
const COIN_FLIGHT_MS = 800;
const BURST_RAYS = 10;

/**
 * Visual-only feedback played after the backend confirms a claim.
 * `flyData.reward` is the reward snapshot from the claim response; VE rewards
 * fly coins into the wallet pill, gift cards (not wallet credits) do not.
 */
function RewardFlyAnimation({ flyData, onWalletHit, onFinish }) {
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    if (!flyData) {
      setPhase('idle');
      return undefined;
    }

    const creditsWallet = !isGiftCardReward(flyData.reward);
    const reduced = prefersReducedMotion();
    const arrival = reduced ? 0 : COIN_FLIGHT_MS + COIN_STAGGER_MS * 2;
    const timers = [];

    setPhase('play');
    if (creditsWallet) timers.push(setTimeout(() => onWalletHit?.(), arrival));
    timers.push(setTimeout(() => setPhase('toast'), reduced ? 0 : COIN_FLIGHT_MS + COIN_STAGGER_MS * COIN_COUNT));
    timers.push(setTimeout(() => onFinish?.(), reduced ? 2600 : 3600));
    return () => timers.forEach(clearTimeout);
  }, [flyData, onWalletHit, onFinish]);

  if (!flyData || phase === 'idle') return null;

  const { startX, startY, endX, endY, reward: rewardSnapshot, pending } = flyData;
  const reward = describeReward(rewardSnapshot);
  const creditsWallet = !isGiftCardReward(rewardSnapshot);
  const reduced = prefersReducedMotion();
  const dx = endX - startX;
  const dy = endY - startY;
  // Keep the centred toast inside narrow viewports.
  const clampX = (x) => Math.min(Math.max(x, 110), window.innerWidth - 110);

  return (
    <div className={styles.flyLayer} aria-hidden="true">
      {!reduced && (
        <div className={styles.flyBurst} style={{ left: startX, top: startY }}>
          <span className={styles.flyBurstRing} />
          {Array.from({ length: BURST_RAYS }, (_, i) => (
            <Sparkle
              key={i}
              className={styles.flyBurstSpark}
              style={{ '--a': `${(360 / BURST_RAYS) * i}deg`, '--dist': `${70 + (i % 3) * 18}px` }}
            />
          ))}
        </div>
      )}

      {!reduced && creditsWallet && Array.from({ length: COIN_COUNT }, (_, i) => (
        <span
          key={i}
          className={styles.flyCoinX}
          style={{
            left: startX + ((i % 3) - 1) * 18,
            top: startY + ((i % 2) ? 10 : -10),
            '--dx': `${dx - ((i % 3) - 1) * 18}px`,
            '--delay': `${i * COIN_STAGGER_MS}ms`,
            '--dur': `${COIN_FLIGHT_MS}ms`,
          }}
        >
          <span className={styles.flyCoinY} style={{ '--dy': `${dy - ((i % 2) ? 10 : -10)}px` }}>
            <img src={VEsCoinImg} alt="" />
          </span>
        </span>
      ))}

      {phase === 'toast' && reward && (
        creditsWallet ? (
          <div className={styles.flyToast} style={{ left: clampX(endX), top: endY + 30 }}>
            <strong>{reward.short}</strong>
            <span><Check size={12} strokeWidth={3.2} /> Added to wallet</span>
          </div>
        ) : (
          <div className={`${styles.flyToast} ${styles.flyToastGift}`} style={{ left: clampX(startX), top: startY - 20 }}>
            <strong><Gift size={18} /> {reward.full}</strong>
            <span><Check size={12} strokeWidth={3.2} /> {pending ? 'Claimed · delivery pending' : 'Claimed'}</span>
          </div>
        )
      )}
    </div>
  );
}

export default RewardFlyAnimation;
