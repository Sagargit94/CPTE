import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 60%, #dbeafe 100%)' },
  card: { background: '#fff', borderRadius: '1.25rem', boxShadow: '0 8px 32px rgba(37,99,235,0.12)', padding: '2.5rem 2.5rem 2rem', width: '100%', maxWidth: '420px' },
  logo: { textAlign: 'center', marginBottom: '1.75rem' },
  appName: { fontSize: '2rem', fontWeight: '800', color: '#2563eb', letterSpacing: '-0.02em' },
  subtitle: { fontSize: '0.95rem', color: '#64748b', marginTop: '0.25rem' },
  label: { display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' },
  input: { width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', color: '#1e293b' },
  btn: { width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.6rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.75rem', transition: 'background 0.2s' },
  toggle: { textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: '#64748b' },
  toggleBtn: { background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' },
  error: { background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '0.5rem', padding: '0.65rem 0.9rem', marginBottom: '1rem', fontSize: '0.875rem' },
  success: { background: '#dcfce7', border: '1px solid #86efac', color: '#166534', borderRadius: '0.5rem', padding: '0.65rem 0.9rem', marginBottom: '1rem', fontSize: '0.875rem' },
  fieldWrap: { marginBottom: '1rem' }
};

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.appName}>CPTE Exam Prep</div>
          <div style={s.subtitle}>Physical Therapy Licensing Exam Practice</div>
        </div>
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.fieldWrap}>
            <label style={s.label}>Email address</label>
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
          <div style={s.fieldWrap}>
            <label style={s.label}>Password</label>
            <input
              style={s.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div style={s.toggle}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button style={s.toggleBtn} onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
