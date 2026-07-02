import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { getTemplates, getHistory } from '../lib/api.js';

const C = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  dark: '#0f172a',
  navy: '#1e293b',
  navyLight: '#334155',
  bg: '#f1f5f9',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#1e293b',
  muted: '#64748b',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626'
};

const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function ScoreBadge({ score }) {
  const num = parseFloat(score);
  const pass = num >= 70;
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.6rem',
      borderRadius: '9999px',
      fontSize: '0.8rem',
      fontWeight: '700',
      background: pass ? '#dcfce7' : '#fee2e2',
      color: pass ? C.success : C.danger
    }}>
      {num.toFixed(1)}%
    </span>
  );
}

function StatPill({ value, label }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '1.25rem 1.5rem',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '0.85rem',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(8px)',
      flex: '1',
      minWidth: '120px'
    }}>
      <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.03em' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.2rem', fontWeight: '500' }}>{label}</div>
    </div>
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

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: font }}>
      {/* Header */}
      <header style={{
        background: C.dark,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 2rem',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🩺</span>
          <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>CPTE Exam Prep</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: '0.35rem 0.9rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.825rem',
              fontWeight: '600'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, ${C.dark} 0%, #1e3a5f 50%, ${C.dark} 100%)`,
        padding: '4rem 2rem 3.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(37,99,235,0.25)',
            border: '1px solid rgba(37,99,235,0.4)',
            borderRadius: '9999px',
            padding: '0.3rem 1rem',
            fontSize: '0.8rem',
            color: '#93c5fd',
            fontWeight: '600',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em'
          }}>
            CPTE BY CAPR PREPARATION PLATFORM
          </div>
          <h1 style={{
            margin: '0 0 1rem',
            fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
            fontWeight: '900',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #fff 0%, #93c5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Master the CPTE.<br />Pass with Confidence.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', margin: '0 0 2.5rem', lineHeight: 1.6 }}>
            Comprehensive practice questions aligned with the Canadian Physiotherapy Competency Examination blueprint.
          </p>
          {/* Stats Row */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatPill value="101" label="Questions" />
            <StatPill value="6" label="Domains" />
            <StatPill value="2" label="Modes" />
            <StatPill value="CPTE" label="Aligned" />
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
        {/* Mode Picker */}
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: '800', color: C.text }}>
          Choose Your Study Mode
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {/* Practice Card */}
          <div style={{
            background: C.card,
            borderRadius: '1rem',
            border: `2px solid ${C.primary}`,
            padding: '1.75rem',
            boxShadow: '0 4px 20px rgba(37,99,235,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '0.6rem',
                background: '#eff6ff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0
              }}>📖</div>
              <div>
                <div style={{ fontWeight: '800', color: C.primary, fontSize: '1.05rem' }}>Practice Mode</div>
                <div style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '500' }}>Learn as you go</div>
              </div>
            </div>
            <ul style={{ margin: '0 0 1.25rem', padding: '0 0 0 0', listStyle: 'none' }}>
              {[
                'Instant feedback after each question',
                'Correct answers + full rationale',
                'No time pressure',
                'Randomized question order'
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: C.navy }}>
                  <span style={{ color: C.success, fontWeight: '700', marginTop: '0.1rem' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleMode('practice')}
              disabled={!!starting}
              style={{
                width: '100%',
                padding: '0.7rem',
                background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
                color: '#fff',
                border: 'none',
                borderRadius: '0.6rem',
                fontWeight: '700',
                cursor: starting ? 'not-allowed' : 'pointer',
                opacity: starting === 'practice' ? 0.7 : 1,
                fontSize: '0.95rem',
                transition: 'opacity 0.2s'
              }}
            >
              {starting === 'practice' ? 'Starting...' : 'Start Practice Session'}
            </button>
          </div>

          {/* Mock Exam Card */}
          <div style={{
            background: C.card,
            borderRadius: '1rem',
            border: '2px solid #f59e0b',
            padding: '1.75rem',
            boxShadow: '0 4px 20px rgba(245,158,11,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '0.6rem',
                background: '#fffbeb', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0
              }}>⏱️</div>
              <div>
                <div style={{ fontWeight: '800', color: C.warning, fontSize: '1.05rem' }}>Mock Exam Mode</div>
                <div style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '500' }}>Simulate the real CPTE</div>
              </div>
            </div>
            <ul style={{ margin: '0 0 1.25rem', padding: '0 0 0 0', listStyle: 'none' }}>
              {[
                '100 questions, 100-minute timer',
                'No feedback during the exam',
                'Results revealed after submission',
                'True exam simulation experience'
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: C.navy }}>
                  <span style={{ color: C.warning, fontWeight: '700', marginTop: '0.1rem' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleMode('mock')}
              disabled={!!starting}
              style={{
                width: '100%',
                padding: '0.7rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.6rem',
                fontWeight: '700',
                cursor: starting ? 'not-allowed' : 'pointer',
                opacity: starting === 'mock' ? 0.7 : 1,
                fontSize: '0.95rem',
                transition: 'opacity 0.2s'
              }}
            >
              {starting === 'mock' ? 'Starting...' : 'Start Mock Exam'}
            </button>
          </div>
        </div>

        {/* Recent Attempts */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: C.text }}>Recent Attempts</h2>
          {onDashboard && (
            <button
              onClick={onDashboard}
              style={{
                padding: '0.45rem 1rem',
                background: C.primary,
                color: '#fff',
                border: 'none',
                borderRadius: '0.55rem',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.825rem'
              }}
            >
              View Full Dashboard →
            </button>
          )}
        </div>
        <div style={{
          background: C.card,
          borderRadius: '1rem',
          border: `1px solid ${C.border}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          {historyLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: C.muted }}>Loading...</div>
          ) : recentAttempts.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: C.muted }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>No attempts yet</div>
              <div style={{ fontSize: '0.875rem' }}>Start a practice session or mock exam to track your progress.</div>
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
                  background: i % 2 === 1 ? '#f8fafc' : '#fff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '0.5rem',
                    background: attempt.mode === 'mock' ? '#fffbeb' : '#eff6ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0
                  }}>
                    {attempt.mode === 'mock' ? '⏱️' : '📖'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: C.text, textTransform: 'capitalize' }}>
                      {attempt.mode} Exam
                    </div>
                    <div style={{ fontSize: '0.8rem', color: C.muted }}>
                      {formatDate(attempt.started_at)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {attempt.score != null ? (
                    <ScoreBadge score={attempt.score} />
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: C.muted }}>In progress</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
