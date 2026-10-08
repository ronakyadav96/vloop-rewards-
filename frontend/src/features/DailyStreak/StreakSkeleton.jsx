import { FlameImg } from '../../assets/veloop/index.js';
import s from './StreakSkeleton.module.css';

// Themed loading state that mirrors the page layout (spec §69–71):
// branded loader on top, then header, hero, stats, ultimate reward,
// seven day cards and the information strip.
function StreakSkeleton() {
  return (
    <div className={s.page} aria-busy="true">
      <div className={s.loader} role="status" aria-live="polite">
        <img src={FlameImg} alt="" />
        <span>Loading your streak…</span>
      </div>

      <div className={s.frame}>
        <div className={s.header}>
          <span className={`${s.block} ${s.icon}`} />
          <span className={s.lines}>
            <span className={`${s.block} ${s.lineLg}`} />
            <span className={`${s.block} ${s.lineSm}`} />
          </span>
          <span className={`${s.block} ${s.badge}`} />
        </div>

        <div className={s.body}>
          <div className={s.top}>
            <div className={s.hero}>
              <span className={`${s.block} ${s.heroArt}`} />
              <span className={s.lines}>
                <span className={`${s.block} ${s.lineLg}`} />
                <span className={`${s.block} ${s.lineXl}`} />
                <span className={`${s.block} ${s.lineSm}`} />
              </span>
              <div className={s.stats}>
                {[0, 1, 2].map((i) => <span key={i} className={`${s.block} ${s.stat}`} />)}
              </div>
            </div>
            <span className={`${s.block} ${s.ultimate}`} />
          </div>

          <span className={`${s.block} ${s.divider}`} />

          <div className={s.cards}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <span key={i} className={`${s.block} ${s.card}`} style={{ '--i': i }} />)}
          </div>

          <span className={`${s.block} ${s.info}`} />
        </div>
      </div>
    </div>
  );
}

export default StreakSkeleton;
