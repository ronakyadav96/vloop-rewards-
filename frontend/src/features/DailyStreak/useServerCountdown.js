import { useEffect, useRef, useState } from 'react';

function getPerformanceNow() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

export function formatCountdown(milliseconds) {
  if (milliseconds <= 0) return '00:00:00';
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function useServerCountdown({ serverTime, nextClaimAt, onExpired }) {
  const [remainingMs, setRemainingMs] = useState(null);
  const expirationReported = useRef(false);
  const onExpiredRef = useRef(onExpired);
  onExpiredRef.current = onExpired;

  useEffect(() => {
    const target = Date.parse(nextClaimAt || '');
    const serverNow = Date.parse(serverTime || '');
    if (!Number.isFinite(target) || !Number.isFinite(serverNow)) {
      setRemainingMs(null);
      return undefined;
    }

    const anchorPerformance = getPerformanceNow();
    expirationReported.current = false;

    const update = () => {
      const estimatedServerNow = serverNow + (getPerformanceNow() - anchorPerformance);
      const nextRemaining = target - estimatedServerNow;
      setRemainingMs(Math.max(0, nextRemaining));
      if (nextRemaining <= 0 && !expirationReported.current) {
        expirationReported.current = true;
        onExpiredRef.current?.();
      }
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [serverTime, nextClaimAt]);

  return {
    remainingMs,
    label: remainingMs === null ? null : formatCountdown(remainingMs),
    ready: remainingMs !== null && remainingMs <= 0,
  };
}

