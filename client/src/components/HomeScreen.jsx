import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { getTemplates } from '../lib/api.js';

const COLORS = {
  primary: '#2563eb',
  primaryLight: '#dbeafe',
  bg: '#f8fafc',
  card: '#fff',
  text: '#1e293b',
  muted: '#64748b',
  border: '#e2e8f0',
  success: '#16a34a',
  warning: '#d97706'
};

const card = {
  background: COLORS.card,
  borderRadius: '1rem',
  boxShadow: '0 2px 12px rgba(37,99,235,0.08)',
  padding: '1.5rem',
  border: `1px solid ${COLORS.border}`
};

export default function HomeScreen({ user, onStartExam }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(null);

  useEffect(() => {
    async function fetchAttempts() {
      const { data, error } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['submitted', 'expired'])
        .order('submitted_at', { ascending: false });
      if (!error) setAttempts(data || []);
      setLoading(false);
    }
    fetchAttempts();
  }, [user.id]);

  async function handleMode(mode) {
    setStarting(mode);
    try {
      const templates = await getTemplates();
      if (!templates.length) throw new Error('No templates found');
      await onStartExam(templates[0].id, mode);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setStarting(null);
    }
  }

  const scores = attempts.filter(a => a.score !== null).map(a => parseFloat(a.score));
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const bestScore = scores.length ? Math.max(...scores).toFixed(1) : null;

  // SVG line chart for last 10 attempts
  const chartData = attempts.slice(0, 10).reverse().filter(a => a.score !== null);
  const W = 320, H = 100, pad = 16;
  function pt(i, score) {
    const x = chartData.length < 2 ? W / 2 : pad + (i / (chartData.length - 1)) * (W - pad * 2);
    const y = pad + ((100 - score) / 100) * (H - pad * 2);
    return `${x},${y}`;
  }
  const polyline = chartData.map((a, i) => pt(i, a.score)).join(' ');

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg }}>
      {/* Header */}
      <div style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`, padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: COLORS.primary }}>CPTE Exam Prep</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: COLORS.muted, fontSize: '0.9rem' }}>{user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{ padding: '0.4rem 1rem', background: 'none', border: `1.5px solid ${COLORS.border}`, borderRadius: '0.5rem', cursor: 'pointer', color: COLORS.muted, fontSize: '0.875rem', fontWeight: '600' }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Attempts', value: attempts.length },
            { label: 'Average Score', value: avgScore ? `${avgScore}%` : '—' },
            { label: 'Best Score', value: bestScore ? `${bestScore}%` : '—' }
          ].map(stat => (
            <div key={stat.label} style={card}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: COLORS.primary, marginTop: '0.25rem' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Score Trend Chart */}
        <div style={{ ...card, marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: '700', color: COLORS.text, marginBottom: '1rem' }}>Score Trend</div>
          {chartData.length === 0 ? (
            <div style={{ color: COLORS.muted, textAlign: 'center', padding: '2rem', fontSize: '0.95rem' }}>
              No completed exams yet. Take your first exam to see your trend!
            </div>
          ) : (
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
              {/* Grid lines */}
              {[25, 50, 75, 100].map(v => (
                <line key={v}
                  x1={pad} y1={pad + ((100 - v) / 100) * (H - pad * 2)}
                  x2={W - pad} y2={pad + ((100 - v) / 100) * (H - pad * 2)}
                  stroke="#e2e8f0" strokeWidth="1"
                />
              ))}
              {/* Pass line at 75% */}
              <line
                x1={pad} y1={pad + 0.25 * (H - pad * 2)}
                x2={W - pad} y2={pad + 0.25 * (H - pad * 2)}
                stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3"
              />
              <text x={W - pad + 4} y={pad + 0.25 * (H - pad * 2) + 4} fontSize="9" fill="#d97706">75%</text>
              {/* Line */}
              {chartData.length > 1 && (
                <polyline points={polyline} fill="none" stroke={COLORS.primary} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              )}
              {/* Dots */}
              {chartData.map((a, i) => {
                const [x, y] = pt(i, a.score).split(',');
                return (
                  <circle key={i} cx={x} cy={y} r="4" fill={COLORS.primary} stroke="#fff" strokeWidth="1.5">
                    <title>{`${parseFloat(a.score).toFixed(1)}%`}</title>
                  </circle>
                );
              })}
            </svg>
          )}
        </div>

        {/* Start Exam */}
        <div style={{ ...card }}>
          <div style={{ fontWeight: '700', color: COLORS.text, fontSize: '1.1rem', marginBottom: '1rem' }}>Start a New Exam</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ border: `2px solid ${COLORS.primaryLight}`, borderRadius: '0.75rem', padding: '1.25rem' }}>
              <div style={{ fontWeight: '700', color: COLORS.primary, fontSize: '1rem', marginBottom: '0.35rem' }}>Practice Mode</div>
              <div style={{ color: COLORS.muted, fontSize: '0.875rem', marginBottom: '1rem' }}>Instant feedback after each question. See correct answers and rationale as you go. No time limit.</div>
              <button
                onClick={() => handleMode('practice')}
                disabled={!!starting}
                style={{ padding: '0.6rem 1.25rem', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: starting ? 'not-allowed' : 'pointer', opacity: starting === 'practice' ? 0.7 : 1, fontSize: '0.9rem' }}
              >
                {starting === 'practice' ? 'Starting...' : 'Start Practice'}
              </button>
            </div>
            <div style={{ border: `2px solid #fef3c7`, borderRadius: '0.75rem', padding: '1.25rem' }}>
              <div style={{ fontWeight: '700', color: COLORS.warning, fontSize: '1rem', marginBottom: '0.35rem' }}>Mock Exam Mode</div>
              <div style={{ color: COLORS.muted, fontSize: '0.875rem', marginBottom: '1rem' }}>100 questions, 100-minute timer. Simulates the real NPTE experience. Results revealed after submission.</div>
              <button
                onClick={() => handleMode('mock')}
                disabled={!!starting}
                style={{ padding: '0.6rem 1.25rem', background: COLORS.warning, color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: starting ? 'not-allowed' : 'pointer', opacity: starting === 'mock' ? 0.7 : 1, fontSize: '0.9rem' }}
              >
                {starting === 'mock' ? 'Starting...' : 'Start Mock Exam'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
