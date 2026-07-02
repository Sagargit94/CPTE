import React, { useState, useEffect } from 'react';
import { getDashboard } from '../lib/api.js';

const C = {
  primary: '#2563eb',
  dark: '#0f172a',
  navy: '#1e293b',
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

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: C.card,
      borderRadius: '0.85rem',
      border: `1px solid ${C.border}`,
      padding: '1.25rem 1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      flex: '1',
      minWidth: '140px'
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: '900', color: color || C.primary, letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: C.muted, marginTop: '0.3rem' }}>{sub}</div>}
    </div>
  );
}

function ScoreChart({ attempts }) {
  const chartData = attempts.filter(a => a.score != null).slice(-10);
  if (chartData.length === 0) {
    return <div style={{ color: C.muted, textAlign: 'center', padding: '2rem' }}>No completed attempts yet.</div>;
  }

  const W = 500, H = 130, padX = 20, padY = 18;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  function getX(i) {
    return padX + (chartData.length < 2 ? innerW / 2 : (i / (chartData.length - 1)) * innerW);
  }
  function getY(score) {
    return padY + ((100 - score) / 100) * innerH;
  }

  const passY = getY(70);
  const points = chartData.map((a, i) => `${getX(i)},${getY(a.score)}`).join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', display: 'block' }}>
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1={padX} y1={getY(v)} x2={W - padX} y2={getY(v)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={padX - 4} y={getY(v) + 3.5} fontSize="9" fill="#94a3b8" textAnchor="end">{v}</text>
        </g>
      ))}
      {/* 70% pass line */}
      <line x1={padX} y1={passY} x2={W - padX} y2={passY} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x={W - padX + 5} y={passY + 3.5} fontSize="9" fill="#d97706" fontWeight="600">70%</text>
      {/* Line */}
      {chartData.length > 1 && (
        <polyline points={points} fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      )}
      {/* Area fill */}
      {chartData.length > 1 && (
        <polyline
          points={`${getX(0)},${getY(0)} ${points} ${getX(chartData.length - 1)},${getY(0)}`}
          fill={`${C.primary}15`}
          strokeWidth="0"
        />
      )}
      {/* Dots */}
      {chartData.map((a, i) => {
        const pass = a.score >= 70;
        return (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(a.score)} r="5" fill={pass ? C.success : C.danger} stroke="#fff" strokeWidth="2" />
            <title>{`Attempt ${i + 1}: ${parseFloat(a.score).toFixed(1)}%`}</title>
          </g>
        );
      })}
    </svg>
  );
}

function DomainBar({ domain, correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const color = pct >= 70 ? C.success : pct >= 50 ? C.warning : C.danger;
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: C.text }}>{domain}</span>
        <span style={{ fontSize: '0.825rem', fontWeight: '700', color }}>
          {pct}% <span style={{ color: C.muted, fontWeight: '400' }}>({correct}/{total})</span>
        </span>
      </div>
      <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: '9999px',
          transition: 'width 0.6s ease'
        }} />
      </div>
    </div>
  );
}

function PassBadge({ score }) {
  const pass = parseFloat(score) >= 70;
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.18rem 0.55rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '700',
      background: pass ? '#dcfce7' : '#fee2e2',
      color: pass ? C.success : C.danger
    }}>
      {pass ? 'Pass' : 'Fail'}
    </span>
  );
}

const DOMAIN_ORDER = [
  'Musculoskeletal',
  'Neuromuscular',
  'Cardiopulmonary',
  'Integumentary',
  'Metabolic',
  'Other'
];

export default function DashboardScreen({ onHome }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Compute streak from submitted attempts sorted ascending
  function computeStreak(attempts) {
    if (!attempts || attempts.length === 0) return 0;
    const days = [...new Set(
      attempts
        .filter(a => a.submitted_at)
        .map(a => new Date(a.submitted_at).toDateString())
    )].sort((a, b) => new Date(b) - new Date(a));
    if (days.length === 0) return 0;
    let streak = 1;
    for (let i = 1; i < days.length; i++) {
      const diff = (new Date(days[i - 1]) - new Date(days[i])) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  }

  // Build performance insights
  function buildInsights(domainStats) {
    if (!domainStats || Object.keys(domainStats).length === 0) return [];
    const entries = Object.entries(domainStats)
      .filter(([, v]) => v.total > 0)
      .map(([d, v]) => ({ domain: d, pct: Math.round((v.correct / v.total) * 100) }))
      .sort((a, b) => b.pct - a.pct);
    const insights = [];
    if (entries.length > 0) insights.push(`Strongest domain: ${entries[0].domain} (${entries[0].pct}%)`);
    if (entries.length > 1) insights.push(`Needs work: ${entries[entries.length - 1].domain} (${entries[entries.length - 1].pct}%)`);
    return insights;
  }

  const streak = data ? computeStreak(data.attempts) : 0;
  const mockCount = data ? data.attempts.filter(a => a.mode === 'mock').length : 0;
  const insights = data ? buildInsights(data.domainStats) : [];
  const allInsights = [...insights];
  if (mockCount > 0) allInsights.push(`You've completed ${mockCount} mock exam${mockCount !== 1 ? 's' : ''}`);

  const orderedDomains = data
    ? [...Object.keys(data.domainStats)].sort((a, b) => {
        const ai = DOMAIN_ORDER.indexOf(a);
        const bi = DOMAIN_ORDER.indexOf(b);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
    : [];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: font }}>
      {/* Header */}
      <header style={{
        background: C.dark,
        padding: '0 2rem',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <button
          onClick={onHome}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '0.5rem',
            padding: '0.35rem 0.75rem',
            color: 'rgba(255,255,255,0.8)',
            cursor: 'pointer',
            fontSize: '0.825rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Home
        </button>
        <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>Performance Dashboard</span>
      </header>

      <div style={{ maxWidth: '940px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: C.muted }}>Loading analytics...</div>
        )}
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '0.75rem', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <StatCard label="Total Attempts" value={data.totalAttempts} />
              <StatCard label="Average Score" value={data.totalAttempts > 0 ? `${data.avgScore}%` : '—'} color={data.avgScore >= 70 ? C.success : C.danger} />
              <StatCard label="Best Score" value={data.totalAttempts > 0 ? `${data.bestScore}%` : '—'} color={C.primary} />
              <StatCard label="Day Streak" value={streak} sub={streak === 1 ? 'day' : 'days'} color="#7c3aed" />
            </div>

            {/* Score Trend */}
            <div style={{ background: C.card, borderRadius: '1rem', border: `1px solid ${C.border}`, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontWeight: '800', color: C.text, marginBottom: '1rem', fontSize: '1rem' }}>Score Trend</div>
              <div style={{ fontSize: '0.8rem', color: C.muted, marginBottom: '1rem', display: 'flex', gap: '1.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: C.success }} />
                  Pass (≥70%)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: C.danger }} />
                  Fail (&lt;70%)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ display: 'inline-block', width: '24px', height: '2px', background: '#fbbf24', verticalAlign: 'middle' }} />
                  Passing line
                </span>
              </div>
              <ScoreChart attempts={data.attempts} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Domain Performance */}
              <div style={{ background: C.card, borderRadius: '1rem', border: `1px solid ${C.border}`, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ fontWeight: '800', color: C.text, marginBottom: '1.25rem', fontSize: '1rem' }}>Domain Performance</div>
                {orderedDomains.length === 0 ? (
                  <div style={{ color: C.muted, fontSize: '0.9rem' }}>No domain data yet.</div>
                ) : (
                  orderedDomains.map(domain => (
                    <DomainBar
                      key={domain}
                      domain={domain}
                      correct={data.domainStats[domain].correct}
                      total={data.domainStats[domain].total}
                    />
                  ))
                )}
              </div>

              {/* Insights */}
              <div style={{ background: C.card, borderRadius: '1rem', border: `1px solid ${C.border}`, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ fontWeight: '800', color: C.text, marginBottom: '1.25rem', fontSize: '1rem' }}>Performance Insights</div>
                {allInsights.length === 0 ? (
                  <div style={{ color: C.muted, fontSize: '0.9rem' }}>Complete more exams to see personalized insights.</div>
                ) : (
                  allInsights.map((insight, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.85rem',
                      background: '#f8fafc',
                      borderRadius: '0.65rem',
                      marginBottom: '0.65rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <span style={{ fontSize: '1.1rem' }}>{i === 0 ? '🏆' : i === 1 ? '📈' : '📊'}</span>
                      <span style={{ fontSize: '0.875rem', color: C.text, fontWeight: '500', lineHeight: 1.4 }}>{insight}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Attempts Table */}
            <div style={{ background: C.card, borderRadius: '1rem', border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontWeight: '800', color: C.text, fontSize: '1rem' }}>Attempt History</div>
              </div>
              {data.attempts.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: C.muted }}>No attempts yet.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['#', 'Date', 'Mode', 'Score', 'Status'].map(h => (
                          <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontWeight: '700', color: C.muted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...data.attempts].reverse().map((attempt, i) => (
                        <tr
                          key={attempt.id}
                          style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', borderTop: '1px solid #f1f5f9' }}
                        >
                          <td style={{ padding: '0.8rem 1.25rem', color: C.muted, fontWeight: '600' }}>{data.attempts.length - i}</td>
                          <td style={{ padding: '0.8rem 1.25rem', color: C.text, whiteSpace: 'nowrap' }}>{formatDate(attempt.started_at)}</td>
                          <td style={{ padding: '0.8rem 1.25rem' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.18rem 0.6rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              background: attempt.mode === 'mock' ? '#fffbeb' : '#eff6ff',
                              color: attempt.mode === 'mock' ? C.warning : C.primary,
                              textTransform: 'capitalize'
                            }}>
                              {attempt.mode}
                            </span>
                          </td>
                          <td style={{ padding: '0.8rem 1.25rem', fontWeight: '700', color: C.text }}>
                            {attempt.score != null ? `${parseFloat(attempt.score).toFixed(1)}%` : '—'}
                          </td>
                          <td style={{ padding: '0.8rem 1.25rem' }}>
                            {attempt.score != null ? <PassBadge score={attempt.score} /> : (
                              <span style={{ fontSize: '0.75rem', color: C.muted }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
