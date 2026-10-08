import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crown,
  Gem,
  Gift,
  Lock,
  LogOut,
  RotateCcw,
  ShieldCheck,
  Sparkle,
  Star,
  TrendingUp,
  X,
} from 'lucide-react';
import { FaAmazon } from 'react-icons/fa';
import {
  BiggerStreakImg,
  Day4BoxImg,
  Day5AmazonImg,
  Day7CrownImg,
  ExclusiveRewardImg,
  FlameImg,
  StayActiveImg,
  TopLeftHeroImg,
  TopRightHeroImg,
  TrustShieldImg,
  VEsCoinImg,
} from '../../assets/veloop/index.js';
import AnimatedNumber from './AnimatedNumber.jsx';
import s from './DailyStreakView.module.css';

/*
 * VELoop Daily Streak view, built from the supplied desktop & mobile designs.
 * Purely presentational: every value comes from the backend view model
 * (see viewModel.js); claims are handed back to the page via `onClaim`.
 */

// Spec §21: the backend sends an asset identifier; the frontend owns the art.
function artFor(d) {
  const asset = String(d.card.reward?.assetType || '').toLowerCase().replaceAll('_', '-');
  if (d.isFinal || asset === 'crown') return Day7CrownImg;
  if (asset === 'gift-box') return Day4BoxImg;
  if (asset.includes('gift') || d.kind === 'gift') return Day5AmazonImg;
  return VEsCoinImg;
}

function badgeFor(d) {
  const metaBadge = d.card.reward?.metadata?.badge;
  if (metaBadge) return { label: metaBadge, tone: 'violet' };
  if (d.isFinal) return { label: 'VIP', tone: 'gold' };
  if (d.variant === 'locked' || d.variant === 'next') return { label: d.kind === 'gift' ? 'Gift Card' : 'Coin', tone: 'violet' };
  return null;
}

function unitFor(d) {
  if (!d.reward) return '';
  return d.kind === 'coin' ? `${d.reward.amount.replace('+', '')} ${d.reward.unit}` : d.reward.kind;
}

/* ---------------------------------------------------------------- header */

function Account({ vm, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div className={s.account} ref={ref}>
      <button type="button" className={s.accountBtn} onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu">
        <span className={s.avatar}>{vm.user.initial}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className={s.menu} role="menu">
          <p className={s.menuName}>{vm.user.name}</p>
          {vm.user.email && <p className={s.menuEmail}>{vm.user.email}</p>}
          <button type="button" role="menuitem" className={s.menuItem} onClick={onLogout}><LogOut size={15} /> Sign out</button>
        </div>
      )}
    </div>
  );
}

function Header({ vm, walletCelebrating, onLogout }) {
  const navigate = useNavigate();
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate('/'));
  const streakLabel = `${vm.currentStreak} Day Streak`;

  return (
    <header className={s.header}>
      <button type="button" className={s.back} onClick={goBack} aria-label="Go back"><ChevronLeft size={20} /></button>
      <span className={s.headerIcon}><CalendarDays size={26} strokeWidth={2} /></span>
      <div className={s.headerText}>
        <h1>Daily Streak <img src={FlameImg} alt="" className={s.titleFlame} /></h1>
        <p>Login daily, maintain your streak, and unlock bigger rewards every day!</p>
      </div>

      <div className={s.headerRight}>
        <div id="navbar-wallet-pill" className={`${s.balance} ${walletCelebrating ? s.balanceHit : ''}`} title="VE balance">
          <Gem size={18} className={s.gem} />
          <strong>{vm.balance === null ? '—' : <AnimatedNumber value={vm.balance} />}</strong>
        </div>
        <Account vm={vm} onLogout={onLogout} />
        <div className={s.streakBadge}>
          <img src={FlameImg} alt="" className={s.badgeFlame} />
          <span>
            <strong>{streakLabel}</strong>
            <small>{vm.currentStreak > 0 ? 'Keep it going!' : 'Start your streak today!'}</small>
          </span>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ hero */

function Stats({ vm }) {
  return (
    <div className={s.stats}>
      <div className={s.stat}>
        <span className={`${s.statIcon} ${s.iconViolet}`}><CalendarDays size={26} strokeWidth={2} /></span>
        <span><small>Total Rewards</small><strong>{vm.totalRewards}</strong></span>
      </div>
      <div className={s.stat}>
        <span className={`${s.statIcon} ${s.iconGreen}`}><CalendarCheck size={26} strokeWidth={2} /></span>
        <span><small>Checked In</small><strong>{vm.checkedIn}</strong></span>
      </div>
      <div className={s.stat}>
        <span className={`${s.statIcon} ${s.iconGold}`}><Star size={20} strokeWidth={2.4} /></span>
        <span><small>Next Reward</small><strong className={s.goldValue}>{vm.nextReward?.short ?? '—'}</strong></span>
      </div>
    </div>
  );
}

function Hero({ vm }) {
  return (
    <section className={s.hero} aria-labelledby="ref-hero-title">
      <div className={s.heroArt}>
        <img src={TopLeftHeroImg} alt="" />
      </div>
      <div className={s.heroCopy}>
        <h2 id="ref-hero-title">
          <span>Daily Check-In</span>
          <strong>Rewards</strong>
        </h2>
        <p>Check in every day and earn <em>exciting rewards!</em></p>
      </div>
      <Stats vm={vm} />
    </section>
  );
}

function Ultimate({ final, onClaim }) {
  if (!final) return null;
  const state = final.variant === 'claimed'
    ? <span className={s.ultState}><CheckCircle2 size={18} /> Claimed</span>
    : final.variant === 'available'
      ? <button type="button" className={s.claimBtn} onClick={() => onClaim(final.card)}>Claim Reward <ChevronRight size={18} /></button>
      : <span className={s.ultUnlock}>Unlock on <b>Day {final.day}</b></span>;

  return (
    <section className={s.ultimate} aria-labelledby="ref-ultimate">
      <div className={s.ultArt}>
        <span className={s.ultRays} aria-hidden="true" />
        <img src={TopRightHeroImg} alt="" />
      </div>
      <div className={s.ultText}>
        <p id="ref-ultimate" className={s.ultLabel}>Ultimate Reward</p>
        <strong className={s.ultValue}>{final.reward?.amount ?? '—'}</strong>
        <span className={s.ultPill}><FaAmazon /> {final.reward?.kind ?? 'Gift Card'}</span>
        {state}
      </div>
      {(final.variant === 'locked' || final.variant === 'next') && (
        <div className={s.ultLock} aria-hidden="true">
          <span><Lock size={20} /></span>
          <small>Unlock on <b>Day {final.day}</b></small>
        </div>
      )}
    </section>
  );
}

/* ---------------------------------------------------- mobile-only parts */

function MobileBanner() {
  return (
    <section className={s.banner} aria-label="Login daily and earn bigger rewards">
      <img src={StayActiveImg} alt="" className={s.bannerCal} />
      <div>
        <p className={s.bannerTitle}>Login Daily &amp; Earn <strong>Bigger Rewards!</strong></p>
        <p className={s.bannerText}>Maintain your streak and unlock <em>exciting rewards</em> every day.</p>
      </div>
      <img src={ExclusiveRewardImg} alt="" className={s.bannerGift} />
    </section>
  );
}

function StreakBar({ vm }) {
  return (
    <div className={s.streakBar}>
      <span className={s.streakPill}><img src={FlameImg} alt="" /> {vm.currentStreak} Day Streak</span>
      <a href="#streak-grid" className={s.calendarLink}><CalendarDays size={16} /> Streak Calendar <ChevronRight size={15} /></a>
    </div>
  );
}

/* ----------------------------------------------------------------- cards */

function CardAction({ d, onClaim }) {
  if (d.variant === 'claimed') return <span className={`${s.cardBtn} ${s.btnClaimed}`}><CheckCircle2 size={18} /> Claimed</span>;
  if (d.variant === 'available') {
    return (
      <button type="button" className={`${s.cardBtn} ${s.btnClaim}`} onClick={() => onClaim(d.card)}>
        <span className={s.longTitle}>Claim Reward</span><span className={s.shortTitle}>Claim Now</span> <ChevronRight size={17} />
      </button>
    );
  }
  if (d.variant === 'missed') return <span className={`${s.cardBtn} ${s.btnMissed}`}><X size={16} /> Missed</span>;
  if (d.variant === 'next' && d.countdown) return <span className={`${s.cardBtn} ${s.btnTimer}`}><Clock3 size={15} /> {d.countdown}</span>;
  return <span className={`${s.cardBtn} ${s.btnLocked}`}><Lock size={15} /> Locked</span>;
}

function RewardCards({ vm, celebrateDay, onClaim }) {
  const daysToGo = Math.max(0, vm.total - vm.claimedCount);
  return (
    <ol className={s.cards} id="streak-grid">
      {vm.days.map((d) => {
        const badge = badgeFor(d);
        return (
          <li
            key={d.day}
            data-day={d.day}
            style={{ '--i': d.index }}
            className={`${s.card} ${s[`card_${d.variant}`] ?? ''} ${d.isFinal ? s.cardFinal : ''} ${celebrateDay === d.day ? s.celebrate : ''}`}
          >
            <div className={s.cardTop}>
              <span className={s.dayPill}>Day {d.day}</span>
              {d.variant === 'claimed' && <CheckCircle2 size={22} className={s.claimedTick} aria-label="Claimed" />}
              {d.variant !== 'claimed' && d.variant !== 'available' && badge && (
                <span className={`${s.typeBadge} ${s[`badge_${badge.tone}`] ?? ''}`}>{badge.label}</span>
              )}
            </div>
            {d.variant === 'available' && <span className={s.todayTab}>Today</span>}
            <div className={s.cardArt}>
              {d.isFinal && <span className={s.finalRays} aria-hidden="true" />}
              <img src={artFor(d)} alt="" loading="lazy" />
            </div>
            <div className={s.cardBody}>
              {d.isFinal && <p className={s.finalTag}><Crown size={14} strokeWidth={2.4} /> Grand Milestone</p>}
              <p className={s.cardTitle}>{d.isFinal ? 'Ultimate Reward' : 'Daily Reward'}</p>
              <strong className={s.cardValue}>{d.reward?.amount ?? '—'}</strong>
              <p className={s.cardUnit}>{unitFor(d)}</p>
              {d.isFinal && (d.variant === 'locked' || d.variant === 'next') && (
                <p className={s.finalNote}>{daysToGo} {daysToGo === 1 ? 'day' : 'days'} to go · complete every day to unlock</p>
              )}
              <CardAction d={d} onClaim={onClaim} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* --------------------------------------------------------- lower strips */

const BENEFITS = [
  { title: 'Login Daily', text: 'Keep your streak alive to earn more!', icon: CalendarDays, img: StayActiveImg, tone: 'iconViolet', short: 'Stay Active' },
  { title: 'Bigger Streak', text: 'More consecutive logins, bigger rewards!', icon: TrendingUp, img: BiggerStreakImg, tone: 'iconGold', short: 'Bigger Streak' },
  { title: 'Exclusive Rewards', text: 'Get coins, gift cards & special bonuses!', icon: Gift, img: ExclusiveRewardImg, tone: 'iconViolet', short: 'Exclusive Rewards' },
  { title: "Don't Miss Out", text: 'Come back every day & unlock all rewards!', icon: ShieldCheck, img: TrustShieldImg, tone: 'iconGreen', short: "Don't Miss Out" },
];

function Benefits() {
  return (
    <section className={s.benefits} aria-labelledby="ref-why">
      <h2 id="ref-why" className={s.whyTitle}><Sparkle size={14} /> Why Maintain Your Streak? <Sparkle size={14} /></h2>
      <ul>
        {BENEFITS.map(({ title, text, icon: Icon, img, tone, short }) => (
          <li key={title}>
            <span className={`${s.benefitIcon} ${s[tone]}`}><Icon size={26} strokeWidth={2} /></span>
            <img src={img} alt="" className={s.benefitImg} loading="lazy" />
            <span className={s.benefitText}>
              <strong><span className={s.longTitle}>{title}</span><span className={s.shortTitle}>{short}</span></strong>
              <small>{text}</small>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Trust() {
  return (
    <footer className={s.trust}>
      <ShieldCheck size={22} className={s.trustIcon} />
      <p>
        <span>Official rewards only on <b>VeloopRewards.in</b></span>
        <span className={s.trustSep} aria-hidden="true">|</span>
        <span>Stay active, stay rewarded!</span>
      </p>
      <ChevronRight size={18} className={s.trustChevron} aria-hidden="true" />
    </footer>
  );
}

function dividerText(vm) {
  if (vm.claimable) return `Claim Day ${vm.claimable.day} to keep your streak alive!`;
  if (vm.completed) return 'Streak complete! A new loop starts soon.';
  return 'Come back tomorrow for more rewards!';
}

/* ------------------------------------------------------------------ page */

function DailyStreakView({ vm, notice, onDismissNotice, walletCelebrating, celebrateDay, demoMode, onClaim, onLogout }) {
  return (
    <div className={s.page} id="top">
      <div className={s.frame}>
        <Header vm={vm} walletCelebrating={walletCelebrating} onLogout={onLogout} />

        <div className={s.body}>
          {demoMode && <p className={s.demo}>Preview mode · mock API data</p>}
          {notice && (
            <div className={`${s.notice} ${s[`notice_${notice.type}`] ?? ''}`} role={notice.type === 'success' ? 'status' : 'alert'}>
              {notice.type === 'reset' ? <RotateCcw size={18} /> : notice.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
              <span>{notice.message}</span>
              {onDismissNotice && <button type="button" onClick={onDismissNotice} aria-label="Dismiss"><X size={16} /></button>}
            </div>
          )}

          <MobileBanner />

          <div className={s.top}>
            <StreakBar vm={vm} />
            <Hero vm={vm} />
            <Ultimate final={vm.final} onClaim={onClaim} />
          </div>

          <p className={s.divider}><Sparkle size={16} /> {dividerText(vm)} <Sparkle size={16} /></p>

          <RewardCards vm={vm} celebrateDay={celebrateDay} onClaim={onClaim} />

          <Benefits />
          <Trust />
        </div>
      </div>
    </div>
  );
}

export default DailyStreakView;
