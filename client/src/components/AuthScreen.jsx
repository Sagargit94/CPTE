import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { Eye, EyeOff, Stethoscope, ArrowLeft, Mail, Lock, User } from 'lucide-react';

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c1a2e 100%)',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '3rem',
    color: '#fff',
  },
  right: {
    width: '480px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
  },
  card: {
    background: '#ffffff',
    borderRadius: '1.25rem',
    boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
  },
};

function InputField({ icon: Icon, label, type, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
            <Icon size={16} />
          </div>
        )}
        <input
          type={actualType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: `0.7rem ${isPassword ? '2.75rem' : '0.9rem'} 0.7rem ${Icon ? '2.75rem' : '0.9rem'}`,
            border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
            borderRadius: '0.65rem',
            fontSize: '0.9rem',
            color: '#111827',
            background: '#f9fafb',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
          onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb'; e.target.style.background = '#f9fafb'; }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.3rem' }}>{error}</div>}
    </div>
  );
}

function PrimaryBtn({ children, onClick, loading, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%',
        padding: '0.8rem',
        background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '0.65rem',
        fontWeight: '700',
        fontSize: '0.95rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        letterSpacing: '0.01em',
        boxShadow: loading ? 'none' : '0 4px 12px rgba(37,99,235,0.35)',
        transition: 'all 0.2s',
      }}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}

function LoginView({ onSwitch, onForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <form onSubmit={handleLogin}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
          <Stethoscope size={28} color="#fff" />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: '0 0 0.25rem' }}>Welcome back</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Sign in to your CPTE account</p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.6rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#b91c1c', fontSize: '0.85rem', fontWeight: '500' }}>
          {error}
        </div>
      )}

      <InputField icon={Mail} label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <InputField icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

      <div style={{ textAlign: 'right', marginBottom: '1.25rem', marginTop: '-0.5rem' }}>
        <button type="button" onClick={onForgot} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}>
          Forgot password?
        </button>
      </div>

      <PrimaryBtn type="submit" loading={loading}>Sign in</PrimaryBtn>

      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.25rem', margin: '1.25rem 0 0' }}>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', padding: 0 }}>
          Sign up free
        </button>
      </p>
    </form>
  );
}

function SignupView({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>Check your email</h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignup}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
          <User size={28} color="#fff" />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: '0 0 0.25rem' }}>Create account</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Start your CPTE exam prep today</p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.6rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#b91c1c', fontSize: '0.85rem', fontWeight: '500' }}>
          {error}
        </div>
      )}

      <InputField icon={Mail} label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <InputField icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 6 characters" />

      <div style={{ marginBottom: '1.25rem' }} />
      <PrimaryBtn type="submit" loading={loading}>Create account</PrimaryBtn>

      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.25rem', margin: '1.25rem 0 0' }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', padding: 0 }}>
          Sign in
        </button>
      </p>
    </form>
  );
}

function ForgotView({ onBack }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>Reset link sent</h2>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>Check your inbox for a password reset link.</p>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={14} /> Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset}>
      <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: 0, marginBottom: '1.5rem', fontWeight: '600' }}>
        <ArrowLeft size={14} /> Back
      </button>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: '0 0 0.25rem' }}>Reset password</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Enter your email to receive a reset link</p>
      </div>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.6rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#b91c1c', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
      <InputField icon={Mail} label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <div style={{ marginBottom: '1.25rem' }} />
      <PrimaryBtn type="submit" loading={loading}>Send reset link</PrimaryBtn>
    </form>
  );
}

export default function AuthScreen() {
  const [view, setView] = useState('login');

  return (
    <div style={s.page}>
      {/* Left panel - hidden on small screens */}
      <div style={{ ...s.left, display: 'flex' }}>
        <div style={{ maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(37,99,235,0.3)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(37,99,235,0.5)' }}>
              <Stethoscope size={20} color="#93c5fd" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>CPTE Exam Prep</span>
          </div>

          <div style={{ display: 'inline-block', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)', borderRadius: '9999px', padding: '0.3rem 1rem', fontSize: '0.75rem', color: '#93c5fd', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
            CAPR · CPTE Preparation
          </div>

          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: '900', lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1.25rem', margin: '0 0 1.25rem' }}>
            <span style={{ background: 'linear-gradient(135deg, #fff 0%, #93c5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Pass the CPTE.<br />Start practicing today.
            </span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '2.5rem' }}>
            Comprehensive practice questions aligned with the Canadian Physiotherapy Competency Examination (CPTE) by CAPR.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { icon: '📚', text: '100+ CPTE-aligned questions across 6 domains' },
              { icon: '⚡', text: 'Instant feedback in Practice Mode' },
              { icon: '⏱️', text: 'Timed Mock Exam with full CPTE simulation' },
              { icon: '📊', text: 'Analytics dashboard to track your progress' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '1.1rem', width: '28px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', fontWeight: '500' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={s.right}>
        <div style={s.card}>
          {view === 'login' && <LoginView onSwitch={() => setView('signup')} onForgot={() => setView('forgot')} />}
          {view === 'signup' && <SignupView onSwitch={() => setView('login')} />}
          {view === 'forgot' && <ForgotView onBack={() => setView('login')} />}
        </div>
      </div>
    </div>
  );
}
