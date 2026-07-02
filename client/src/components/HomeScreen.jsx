import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { getTemplates, getHistory } from '../lib/api.js';
import { Stethoscope, BookOpen, Clock, BarChart2, LogOut, CheckCircle, ChevronRight, Trophy, Zap, Target } from 'lucide-react';

const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const C = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  dark: '#0f172a',
  navy: '#1e293b',
  bg: '#f1f5f9',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#1e293b',
  muted: '#64748b',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
};

function StatusBadge({ score, status }) {
  if (status === 'in_progress') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
        In Progress
      </span>
    );
  }
  if (score == null) return null;
  const pass = parseFloat(score) >= 70;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', background: pass ? '#dcfce7' : '#fee2e2', color: pass ? C.success : C.danger }}>
      {pass ? '✓' : '✗'} {parseFloat(score).toFixed(1)}%
    </span>
  );
}

export default function HomeScreen({ user, onStartExam, onDashboard }) {
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [starting, setStarting] = useState(null);

  useEffect(() => {
    getHistory()
      .then(data => setRecentAttempts((data || []).slice(0, 3)))
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

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const userName = user.email?.split('@')[0] || 'there';

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: font }}>
      {/* Navbar */}
      <header style={{
        background: C.dark,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '34px', height: '34px', background: 'rgba(37,99,235,0.3)', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(37,99,235,0.5)' }}>
            <Stethoscope size={18} color="#93c5fd" />
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>CPTE Exam Prep</span>
          <span style={{ display: 'inline-block', padding: '0.15rem 0.55rem', background: 'rgba(37,99,235,0.25)', border: '1px solid rgba(37,99,235,0.4)', borderRadius: '9999px', fontSize: '0.65rem', color: '#93c5fd', fontWeight: '700', letterSpacing: '0.05em', marginLeft: '0.25rem' }}>CAPR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onDashboard}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5rem', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.825rem', fontWeight: '600' }}
          >
            <BarChart2 size={14} /> Analytics
          </button>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>{user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: '600' }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, ${C.dark} 0%, #1a2f50 40%, #1e3a5f 70%, ${C.dark} 100%)`,
        padding: '4rem 2rem 3.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)', borderRadius: '9999px', padding: '0.35rem 1rem', fontSize: '0.75rem', color: '#93c5fd', fontWeight: '700', letterSpacing: '0.06em', marginBottom: '1.75rem' }}>
            <Zap size={12} fill="#93c5fd" /> CPTE BY CAPR · CANADA
          </div>
          <h1 style={{
            margin: '0 0 1.1rem',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '900',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            background: 'linear-gradient(135deg, #fff 0%, #bfdbfe 60%, #93c5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Hello, {userName}!<br />Ready to ace the CPTE?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', margin: '0 0 2.5rem', lineHeight: 1.7, maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            Comprehensive practice questions aligned with the Canadian Physiotherapy Competency Examination blueprint.
          </p>
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: <Target size={15} />, value: '101', label: 'Questions' },
              { icon: <BookOpen size={15} />, value: '6', label: 'Domains' },
              { icon: <Clock size={15} />, value: '100 min', label: 'Mock Timer' },
              { icon: <Trophy size={15} />, value: 'CPTE', label: 'Aligned' },
            ].map(({ icon, value, label }) => (
              <div key={label} style={{ textAlign: 'center', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', backdropFilter: 'blur(8px)', minWidth: '100px' }}>
                <div style={{ color: '#93c5fd', marginBottom: '0.3rem', display: 'flex', justifyContent: 'center' }}>{icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
        {/* Mode Cards */}
        <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: C.text, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '4px', height: '20px', background: C.primary, borderRadius: '2px', display: 'inline-block' }} />
          Choose Your Study Mode
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {/* Practice Card */}
          <div style={{ background: C.card, borderRadius: '1.25rem', border: `1.5px solid ${C.primary}`, padding: '1.75rem', boxShadow: '0 4px 24px rgba(37,99,235,0.12)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle at top right, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '0.85rem', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={22} color={C.primary} />
              </div>
              <div>
                <div style={{ fontWeight: '800', color: C.primary, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>Practice Mode</div>
                <div style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '500', marginTop: '0.15rem' }}>Learn as you go</div>
              </div>
            </div>
            <ul style={{ margin: '0 0 1.5rem', padding: 0, listStyle: 'none' }}>
              {[
                'Instant answer feedback after each question',
                'Full rationale explanations',
                'No time pressure — go at your own pace',
                'Randomized question order',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.6rem', fontSize: '0.875rem', color: C.navy }}>
                  <CheckCircle size={14} color={C.success} style={{ marginTop: '2px', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleMode('practice')}
              disabled={!!starting}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
                color: '#fff',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: starting ? 'not-allowed' : 'pointer',
                opacity: starting === 'practice' ? 0.65 : 1,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                transition: 'opacity 0.2s',
              }}
            >
              {starting === 'practice' ? 'Starting...' : <><BookOpen size={16} /> Start Practice Session</>}
            </button>
          </div>

          {/* Mock Exam Card */}
          <div style={{ background: C.card, borderRadius: '1.25rem', border: '1.5px solid #f59e0b', padding: '1.75rem', boxShadow: '0 4px 24px rgba(245,158,11,0.12)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle at top right, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '0.85rem', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={22} color={C.warning} />
              </div>
              <div>
                <div style={{ fontWeight: '800', color: C.warning, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>Mock Exam</div>
                <div style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '500', marginTop: '0.15rem' }}>Simulate the real CPTE</div>
              </div>
            </div>
            <ul style={{ margin: '0 0 1.5rem', padding: 0, listStyle: 'none' }}>
              {[
                '100 questions, 100-minute timed exam',
                'No feedback during the exam',
                'Full results revealed after submission',
                'True CPTE simulation experience',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.6rem', fontSize: '0.875rem', color: C.navy }}>
                  <CheckCircle size={14} color={C.warning} style={{ marginTop: '2px', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleMode('mock')}
              disabled={!!starting}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '700',
                cursor: starting ? 'not-allowed' : 'pointer',
                opacity: starting === 'mock' ? 0.65 : 1,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
                transition: 'opacity 0.2s',
              }}
            >
              {starting === 'mock' ? 'Starting...' : <><Clock size={16} /> Start Mock Exam</>}
            </button>
          </div>
        </div>

        {/* Recent Attempts */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: C.text, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '4px', height: '20px', background: C.primary, borderRadius: '2px', display: 'inline-block' }} />
            Recent Attempts
          </h2>
          <button
            onClick={onDashboard}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 1rem', background: C.primary, color: '#fff', border: 'none', borderRadius: '0.6rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Full Dashboard <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ background: C.card, borderRadius: '1.15rem', border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {historyLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: C.muted, fontSize: '0.9rem' }}>Loading...</div>
          ) : recentAttempts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', background: '#f1f5f9', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem' }}>
                <BarChart2 size={24} color={C.muted} />
              </div>
              <div style={{ fontWeight: '700', color: C.text, marginBottom: '0.25rem' }}>No attempts yet</div>
              <div style={{ fontSize: '0.875rem', color: C.muted }}>Start a practice session or mock exam to track your progress.</div>
            </div>
          ) : (
            recentAttempts.map((attempt, i) => (
              <div
                key={attempt.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  borderBottom: i < recentAttempts.length - 1 ? `1px solid ${C.border}` : 'none',
                  background: i % 2 === 1 ? '#f8fafc' : '#fff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '0.65rem', background: attempt.mode === 'mock' ? '#fffbeb' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {attempt.mode === 'mock' ? <Clock size={18} color={C.warning} /> : <BookOpen size={18} color={C.primary} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: C.text, textTransform: 'capitalize' }}>
                      {attempt.mode === 'mock' ? 'Mock Exam' : 'Practice Session'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: C.muted, marginTop: '0.1rem' }}>{formatDate(attempt.started_at)}</div>
                  </div>
                </div>
                <StatusBadge score={attempt.score} status={attempt.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
