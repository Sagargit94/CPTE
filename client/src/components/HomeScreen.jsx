import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { getTemplates, getHistory } from '../lib/api.js';
import {
  Stethoscope, BookOpen, Clock, BarChart2, LogOut,
  CheckCircle, ChevronRight, Trophy, Zap, Target,
  TrendingUp, Activity
} from 'lucide-react';

const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const C = {
  primary: '#2563eb', primaryDark: '#1d4ed8', primaryLight: '#eff6ff',
  dark: '#0f172a', navy: '#1e293b', navyMid: '#334155',
  bg: '#f0f4f8', card: '#ffffff',
  border: '#e2e8f0', borderLight: '#f1f5f9',
  text: '#0f172a', textMid: '#334155', muted: '#64748b', mutedLight: '#94a3b8',
  success: '#16a34a', successLight: '#f0fdf4',
  warning: '#d97706', warningLight: '#fffbeb',
  danger: '#dc2626', dangerLight: '#fef2f2',
};

function StatusBadge({ score, status }) {
  if (status === 'in_progress') return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700', background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac', letterSpacing: '0.03em' }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 0 2px #dcfce7' }} /> IN PROGRESS
    </span>
  );
  if (score == null) return null;
  const pass = parseFloat(score) >= 70;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700', background: pass ? '#dcfce7' : '#fee2e2', color: pass ? C.success : C.danger, letterSpacing: '0.03em' }}>
      {pass ? '✓' : '✗'} {parseFloat(score).toFixed(1)}%
    </span>
  );
}

const STAT_ITEMS = [
  { icon: Target, value: '100', label: 'Questions' },
  { icon: BookOpen, value: '6', label: 'Domains' },
  { icon: Clock, value: '100 min', label: 'Mock Timer' },
  { icon: Trophy, value: 'CPTE', label: 'Aligned' },
];

export default function HomeScreen({ user, onStartExam, onDashboard }) {
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [starting, setStarting] = useState(null);

  useEffect(() => {
    getHistory()
      .then(d => setRecentAttempts((d || []).slice(0, 3)))
      .catch(() => setRecentAttempts([]))
      .finally(() => setHistoryLoading(false));
  }, []);

  async function handleMode(mode) {
    setStarting(mode);
    try {
      const templates = await getTemplates();
      if (!templates.length) throw new Error('No exam templates found');
      await onStartExam(templates[0].id, mode);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setStarting(null);
    }
  }

  function fmt(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const userName = user.email?.split('@')[0] || 'there';

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: font }}>

      {/* ── Navbar ── */}
      <nav style={{ background: C.dark, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.75rem', position: 'sticky', top: 0, zIndex: 200, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.4)' }}>
            <Stethoscope size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>CPTE Prep</span>
          <span style={{ padding: '0.1rem 0.45rem', background: 'rgba(37,99,235,0.3)', border: '1px solid rgba(37,99,235,0.5)', borderRadius: '4px', fontSize: '0.6rem', color: '#93c5fd', fontWeight: '800', letterSpacing: '0.08em' }}>CAPR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={onDashboard} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: '600', transition: 'background 0.15s' }}>
            <BarChart2 size={13} /> Analytics
          </button>
          <button onClick={() => supabase.auth.signOut()} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', fontWeight: '600' }}>
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ background: `linear-gradient(160deg, #0f172a 0%, #162035 35%, #1e3a5f 65%, #0f172a 100%)`, padding: '3.5rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(37,99,235,0.12) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(99,102,241,0.08) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', border: '1px solid rgba(37,99,235,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '9999px', padding: '0.3rem 0.9rem', fontSize: '0.7rem', color: '#93c5fd', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            <Zap size={10} fill="#93c5fd" /> CPTE BY CAPR · CANADA
          </div>
          <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1rem', background: 'linear-gradient(135deg, #ffffff 30%, #bfdbfe 70%, #93c5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Hello, {userName}!<br />Ready to ace the CPTE?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto 2.5rem' }}>
            Practice questions aligned with the Canadian Physiotherapy Competency Examination blueprint by CAPR.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {STAT_ITEMS.map(({ icon: Icon, value, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 1.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', backdropFilter: 'blur(12px)', minWidth: '90px', gap: '0.3rem' }}>
                <Icon size={14} color="#93c5fd" strokeWidth={2} />
                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2.25rem 1.25rem' }}>

        {/* ── Section heading ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
          <span style={{ width: '3px', height: '18px', background: 'linear-gradient(180deg, #2563eb, #1d4ed8)', borderRadius: '2px', display: 'block' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: C.text, letterSpacing: '-0.01em' }}>Choose Your Study Mode</h2>
        </div>

        {/* ── Mode Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.1rem', marginBottom: '2rem' }}>

          {/* Practice */}
          <div style={{ background: C.card, borderRadius: '16px', border: `1.5px solid ${C.primary}`, padding: '1.6rem', boxShadow: '0 4px 24px rgba(37,99,235,0.1), 0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(37,99,235,0.15)' }}>
                <BookOpen size={20} color={C.primary} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontWeight: '800', color: C.primary, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>Practice Mode</div>
                <div style={{ fontSize: '0.78rem', color: C.muted, marginTop: '0.1rem', fontWeight: '500' }}>Learn as you go · No time limit</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', marginBottom: '1.4rem' }}>
              {['Instant answer feedback per question', 'Full rationale explanations', 'Randomized question order', 'Cancel anytime without penalty'].map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: C.textMid }}>
                  <CheckCircle size={14} color={C.success} style={{ marginTop: '2px', flexShrink: 0 }} strokeWidth={2.5} />
                  {t}
                </li>
              ))}
            </ul>
            <button onClick={() => handleMode('practice')} disabled={!!starting}
              style={{ width: '100%', padding: '0.8rem', background: starting === 'practice' ? '#93c5fd' : `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', cursor: starting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s' }}>
              <BookOpen size={15} /> {starting === 'practice' ? 'Starting...' : 'Start Practice Session'}
            </button>
          </div>

          {/* Mock */}
          <div style={{ background: C.card, borderRadius: '16px', border: '1.5px solid #f59e0b', padding: '1.6rem', boxShadow: '0 4px 24px rgba(245,158,11,0.1), 0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(245,158,11,0.15)' }}>
                <Clock size={20} color={C.warning} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontWeight: '800', color: C.warning, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>Mock Exam</div>
                <div style={{ fontSize: '0.78rem', color: C.muted, marginTop: '0.1rem', fontWeight: '500' }}>Simulate the real CPTE · 100 min</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', marginBottom: '1.4rem' }}>
              {['100 questions, 100-minute timed exam', 'No answer feedback during exam', 'Full review revealed after submit', 'True CPTE exam simulation'].map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: C.textMid }}>
                  <CheckCircle size={14} color={C.warning} style={{ marginTop: '2px', flexShrink: 0 }} strokeWidth={2.5} />
                  {t}
                </li>
              ))}
            </ul>
            <button onClick={() => handleMode('mock')} disabled={!!starting}
              style={{ width: '100%', padding: '0.8rem', background: starting === 'mock' ? '#fcd34d' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', cursor: starting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s' }}>
              <Clock size={15} /> {starting === 'mock' ? 'Starting...' : 'Start Mock Exam'}
            </button>
          </div>
        </div>

        {/* ── Recent Attempts ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: '3px', height: '18px', background: 'linear-gradient(180deg, #2563eb, #1d4ed8)', borderRadius: '2px', display: 'block' }} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: C.text, letterSpacing: '-0.01em' }}>Recent Attempts</h2>
          </div>
          <button onClick={onDashboard} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.9rem', background: C.primary, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.78rem', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
            Full Dashboard <ChevronRight size={13} />
          </button>
        </div>

        <div style={{ background: C.card, borderRadius: '14px', border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {historyLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: C.muted, fontSize: '0.875rem' }}>
              <Activity size={20} color="#cbd5e1" style={{ marginBottom: '0.5rem' }} /> Loading...
            </div>
          ) : recentAttempts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: C.borderLight, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem' }}>
                <TrendingUp size={22} color={C.mutedLight} />
              </div>
              <div style={{ fontWeight: '700', color: C.text, marginBottom: '0.3rem', fontSize: '0.95rem' }}>No attempts yet</div>
              <div style={{ fontSize: '0.83rem', color: C.muted }}>Start a session above to track your progress.</div>
            </div>
          ) : recentAttempts.map((a, i) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.4rem', borderBottom: i < recentAttempts.length - 1 ? `1px solid ${C.borderLight}` : 'none', background: i % 2 === 1 ? '#f8fafc' : '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: a.mode === 'mock' ? C.warningLight : C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {a.mode === 'mock' ? <Clock size={16} color={C.warning} /> : <BookOpen size={16} color={C.primary} />}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.875rem', color: C.text }}>{a.mode === 'mock' ? 'Mock Exam' : 'Practice Session'}</div>
                  <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '0.1rem' }}>{fmt(a.started_at)}</div>
                </div>
              </div>
              <StatusBadge score={a.score} status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
