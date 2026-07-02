import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient.js';
import { Eye, EyeOff, ArrowLeft, Stethoscope, Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/theme.jsx';

const slide = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22 } },
  exit:    { opacity: 0, x: -16, transition: { duration: 0.15 } },
};

function Field({ label, type, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPwd = type === 'password';

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '0.35rem', fontFamily: 'var(--font-body)' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPwd ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: `0.65rem ${isPwd ? '2.75rem' : '0.85rem'} 0.65rem 0.85rem`,
            border: `1.5px solid ${focused ? 'var(--border-focus)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)', fontSize: '0.9rem',
            background: 'var(--bg-card)', color: 'var(--text)',
            outline: 'none', fontFamily: 'var(--font-body)',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: focused ? '0 0 0 3px var(--primary-light)' : 'var(--shadow-xs)',
          }}
        />
        {isPwd && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex', padding: '2px' }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Btn({ children, onClick, type = 'button', loading, variant = 'primary', full }) {
  const isPrimary = variant === 'primary';
  return (
    <motion.button
      type={type} onClick={onClick} disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.015 }}
      whileTap={{ scale: loading ? 1 : 0.97 }}
      style={{
        width: full ? '100%' : 'auto',
        padding: '0.72rem 1.4rem',
        background: isPrimary ? 'var(--primary)' : 'transparent',
        color: isPrimary ? '#fff' : 'var(--primary)',
        border: isPrimary ? 'none' : '1.5px solid var(--primary)',
        borderRadius: 'var(--radius)', fontWeight: '700', fontSize: '0.9rem',
        cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
        fontFamily: 'var(--font-body)',
        boxShadow: isPrimary ? '0 2px 8px rgba(13,92,115,0.3)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
      }}
    >
      {loading ? <motion.span animate={{ opacity: [0.5,1,0.5] }} transition={{ duration: 1.2, repeat: Infinity }}>Please wait…</motion.span> : children}
    </motion.button>
  );
}

function Alert({ msg, type = 'error' }) {
  if (!msg) return null;
  const isErr = type === 'error';
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: '0.7rem 1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.83rem', fontWeight: '500',
        background: isErr ? 'var(--danger-light)' : 'var(--success-light)',
        color: isErr ? 'var(--danger)' : 'var(--success)',
        border: `1px solid ${isErr ? 'var(--danger)' : 'var(--success)'}30`,
        fontFamily: 'var(--font-body)',
      }}>
      {msg}
    </motion.div>
  );
}

function LoginView({ onSwitch, onForgot }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setErr(error.message);
    setLoading(false);
  }

  return (
    <form onSubmit={submit}>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.45rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.3rem', letterSpacing: '-0.03em' }}>Sign in</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Welcome back to CPTE Exam Prep</p>
      <Alert msg={err} />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
      <Field label="Password" type="password" value={pw} onChange={setPw} placeholder="••••••••" autoComplete="current-password" />
      <div style={{ textAlign: 'right', marginBottom: '1.25rem', marginTop: '-0.5rem' }}>
        <button type="button" onClick={onForgot} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Forgot password?
        </button>
      </div>
      <Btn type="submit" loading={loading} full>Sign in</Btn>
      <p style={{ textAlign: 'center', fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: '1.25rem', fontFamily: 'var(--font-body)' }}>
        No account?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Create one free
        </button>
      </p>
    </form>
  );
}

function SignupView({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setErr('');
    if (pw.length < 6) { setErr('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password: pw });
    if (error) setErr(error.message); else setDone(true);
    setLoading(false);
  }

  if (done) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📬</div>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>Check your email</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>We sent a link to <strong>{email}</strong>. Click it to activate your account.</p>
      <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>Back to sign in</button>
    </motion.div>
  );

  return (
    <form onSubmit={submit}>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.45rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.3rem', letterSpacing: '-0.03em' }}>Create account</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Start your CPTE prep journey</p>
      <Alert msg={err} />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
      <Field label="Password" type="password" value={pw} onChange={setPw} placeholder="Min. 6 characters" autoComplete="new-password" />
      <div style={{ marginBottom: '1.25rem' }} />
      <Btn type="submit" loading={loading} full>Create account</Btn>
      <p style={{ textAlign: 'center', fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: '1.25rem', fontFamily: 'var(--font-body)' }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Sign in</button>
      </p>
    </form>
  );
}

function ForgotView({ onBack }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) setErr(error.message); else setDone(true);
    setLoading(false);
  }

  if (done) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✉️</div>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.5rem' }}>Reset link sent</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>Check your inbox for a password reset link.</p>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
        <ArrowLeft size={13} /> Back to sign in
      </button>
    </motion.div>
  );

  return (
    <form onSubmit={submit}>
      <button type="button" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>
        <ArrowLeft size={13} /> Back
      </button>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.45rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.3rem', letterSpacing: '-0.03em' }}>Reset password</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>We'll send a reset link to your email</p>
      <Alert msg={err} />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
      <div style={{ marginBottom: '1.25rem' }} />
      <Btn type="submit" loading={loading} full>Send reset link</Btn>
    </form>
  );
}

const FEATURES = [
  { icon: '📚', text: '100 CPTE-aligned questions across 6 domains' },
  { icon: '⚡', text: 'Instant feedback with full rationale in Practice Mode' },
  { icon: '⏱️', text: '100-minute timed Mock Exam simulation' },
  { icon: '📊', text: 'Analytics dashboard tracking your progress over time' },
];

export default function AuthScreen() {
  const [view, setView] = useState('login');
  const { dark, toggle } = useTheme();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 3.5rem', background: 'var(--primary)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', left: '60%', width: '160px', height: '160px', background: 'rgba(200,146,26,0.12)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '440px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '3.5rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Stethoscope size={19} color="#fff" strokeWidth={2.2} />
            </div>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>CPTE Exam Prep</span>
            <span style={{ padding: '0.1rem 0.4rem', background: 'rgba(200,146,26,0.3)', border: '1px solid rgba(200,146,26,0.5)', borderRadius: '4px', fontSize: '0.58rem', color: '#fcd34d', fontWeight: '800', letterSpacing: '0.1em' }}>CAPR</span>
          </div>

          <div style={{ display: 'inline-block', padding: '0.25rem 0.85rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '9999px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '1.25rem', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}>
            Canadian Physiotherapy · CAPR
          </div>

          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', fontWeight: '900', color: '#fff', lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '1.1rem', textWrap: 'balance' }}>
            Pass the CPTE.<br />
            <span style={{ color: '#fcd34d' }}>Start practicing</span> today.
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Questions built for Canada's physiotherapy licensing exam — practice the way you'll be tested.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {FEATURES.map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '1rem', width: '26px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.875rem', fontWeight: '500' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: '480px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', position: 'relative' }}>
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
          onClick={toggle}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: '36px', height: '36px', borderRadius: '9px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </motion.button>

        <div style={{ width: '100%', maxWidth: '360px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={view} variants={slide} initial="initial" animate="animate" exit="exit">
              {view === 'login'  && <LoginView onSwitch={() => setView('signup')} onForgot={() => setView('forgot')} />}
              {view === 'signup' && <SignupView onSwitch={() => setView('login')} />}
              {view === 'forgot' && <ForgotView onBack={() => setView('login')} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
