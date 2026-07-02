import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '1rem'
  },
  card: {
    background: '#ffffff',
    borderRadius: '1.25rem',
    boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
    padding: '2.75rem 2.5rem 2.25rem',
    width: '100%',
    maxWidth: '440px'
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.75rem',
    borderBottom: '1px solid #e2e8f0'
  },
  logoIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem'
  },
  appName: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.03em',
    marginBottom: '0.25rem'
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500'
  },
  heading: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.35rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '0.65rem',
    fontSize: '0.975rem',
    outline: 'none',
    color: '#1e293b',
    background: '#f8fafc',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s'
  },
  inputPasswordPadding: {
    paddingRight: '2.75rem'
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem',
    lineHeight: 1
  },
  btn: {
    width: '100%',
    padding: '0.8rem',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '0.65rem',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'opacity 0.2s, transform 0.1s',
    letterSpacing: '0.01em'
  },
  toggle: {
    textAlign: 'center',
    marginTop: '1.25rem',
    fontSize: '0.875rem',
    color: '#64748b'
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.875rem',
    padding: 0
  },
  forgotLink: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.8rem',
    padding: 0,
    marginTop: '0.5rem',
    display: 'inline-block',
    textAlign: 'right',
    width: '100%'
  },
  error: {
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    borderRadius: '0.5rem',
    padding: '0.65rem 0.9rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  success: {
    background: '#dcfce7',
    border: '1px solid #86efac',
    color: '#166534',
    borderRadius: '0.5rem',
    padding: '0.65rem 0.9rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  fieldWrap: { marginBottom: '1rem' },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginBottom: '1.25rem'
  }
};

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function ForgotPasswordView({ onBack }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button style={s.backBtn} onClick={onBack}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to sign in
      </button>
      <div style={s.heading}>Reset your password</div>
      {sent ? (
        <div style={s.success}>
          Check your email! We sent a password reset link to <strong>{email}</strong>.
        </div>
      ) : (
        <>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', marginTop: 0 }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          {error && <div style={s.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={s.fieldWrap}>
              <label style={s.label}>Email address</label>
              <div style={s.inputWrap}>
                <input
                  style={s.input}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
            </div>
            <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm, then sign in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoArea}>
          <div style={s.logoIcon}>🩺</div>
          <div style={s.appName}>CPTE Exam Prep</div>
          <div style={s.subtitle}>CPTE by CAPR — Physical Therapy Licensing Exam Practice</div>
        </div>

        {showForgot ? (
          <ForgotPasswordView onBack={() => setShowForgot(false)} />
        ) : (
          <>
            <div style={s.heading}>{isLogin ? 'Sign in to your account' : 'Create your account'}</div>
            {error && <div style={s.error}>{error}</div>}
            {success && <div style={s.success}>{success}</div>}
            <form onSubmit={handleSubmit}>
              <div style={s.fieldWrap}>
                <label style={s.label}>Email address</label>
                <div style={s.inputWrap}>
                  <input
                    style={s.input}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Password</label>
                <div style={s.inputWrap}>
                  <input
                    style={{ ...s.input, ...s.inputPasswordPadding }}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    style={s.eyeBtn}
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {isLogin && (
                  <button
                    type="button"
                    style={s.forgotLink}
                    onClick={() => { setShowForgot(true); setError(''); setSuccess(''); }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <button
                style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            <div style={s.toggle}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button style={s.toggleBtn} onClick={switchMode}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
