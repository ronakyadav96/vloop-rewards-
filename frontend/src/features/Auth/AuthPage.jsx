import { ArrowRight, Flame, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './Auth.module.css';

function AuthPage({ mode = 'login' }) {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signIn, signUp } = useAuth();
  const [form, setForm] = useState({ email: '', displayName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/daily-streak', { replace: true });
  }, [isAuthenticated, navigate]);

  const redirectPath = location.state?.from?.pathname || '/daily-streak';

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignup) await signUp(form.email, form.displayName, form.password);
      else await signIn(form.email, form.password);
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.error?.message ||
          requestError?.response?.data?.message ||
          'We could not complete that request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.authPage}>
      <section className={styles.authIntro}>
        <Link className={styles.authBrand} to="/daily-streak"><span className={styles.brandMark}><Flame size={19} fill="currentColor" /></span>VE<span>Loop</span></Link>
        <div className={styles.introCopy}>
          <span className={styles.eyebrow}><span /> DAILY REWARDS</span>
          <h1>Build your loop.<br /><em>Keep your momentum.</em></h1>
          <p>One account for your streak, wallet, and rewards. Your progress stays with you every time you return.</p>
          <div className={styles.trustLine}><ShieldCheck size={16} /> Backend-verified rewards</div>
        </div>
        <div className={styles.introOrb} aria-hidden="true"><Sparkles size={30} /></div>
      </section>

      <section className={styles.authPanel}>
        <div className={styles.formWrap}>
          <div className={styles.formHeading}>
            <span className={styles.sectionKicker}>{isSignup ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</span>
            <h2>{isSignup ? 'Start your streak.' : 'Sign in to VELoop.'}</h2>
            <p>{isSignup ? 'Join the loop and start unlocking daily rewards.' : 'Continue where your reward loop left off.'}</p>
          </div>

          <form onSubmit={submit} noValidate>
            {isSignup && <label className={styles.field}><span>Display name</span><input name="displayName" value={form.displayName} onChange={updateField} autoComplete="name" placeholder="How should we call you?" minLength="2" required /></label>}
            <label className={styles.field}><span>Email address</span><input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" placeholder="you@example.com" required /></label>
            <label className={styles.field}><span>Password</span><input name="password" type="password" value={form.password} onChange={updateField} autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder="At least 8 characters" minLength="8" required /></label>
            {error && <div className={styles.formError} role="alert"><LockKeyhole size={15} /> {error}</div>}
            <button className={styles.submitButton} type="submit" disabled={loading}>{loading ? 'Securing your session…' : isSignup ? 'Create account' : 'Sign in'} <ArrowRight size={17} /></button>
          </form>

          <p className={styles.switchAuth}>{isSignup ? 'Already have an account?' : 'New to VELoop?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link></p>
          <p className={styles.privacy}><LockKeyhole size={13} /> Your session is secured with a signed access token.</p>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;

