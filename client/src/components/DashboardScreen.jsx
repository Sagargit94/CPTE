import React, { useState, useEffect } from 'react';
import { getDashboard } from '../lib/api.js';
import { ArrowLeft, TrendingUp, Award, Target, Flame, BarChart2, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const C = {
  primary: '#2563eb',
  dark: '#0f172a',
  bg: '#f1f5f9',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#1e293b',
  muted: '#64748b',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
};

const DOMAIN_COLORS = {
  Musculoskeletal: '#2563eb',
  Neuromuscular: '#7c3aed',
  Cardiopulmonary: '#dc2626',
  Integumentary: '#d97706',
  'Other Systems': '#059669',
  'Non-Systems': '#0891b2',
};

function StatCard({ label, value, sub, icon: Icon, iconColor, accent }) {
  return (
    <div style={{
      background: C.card,
      borderRadius: '1.1rem',
      border: `1px solid ${C.border}`,
      padding: '1.4rem 1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      flex: '1',
      minWidth: '150px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {accent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accent, borderRadius: '1.1rem 1.1rem 0 0' }} />}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
        {Icon && <div style={{ width: '32px', height: '32px', borderRadius: '0.6rem', background: `${iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={16} color={iconColor} /></div>}
      </div>
      <div style={{ fontSize: '2.1rem', fontWeight: '900', color: C.text, letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: C.muted, marginTop: '0.35rem', fontWeight: '500' }}>{sub}</div>}
    </div>
  );
}

function DomainBar({ domain, correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const color = pct >= 70 ? C.success : pct >= 50 ? C.warning : C.danger;
  const domainColor = DOMAIN_COLORS[domain] || C.primary;

  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: domainColor, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: C.text }}>{domain}</span>
        </div>
        <span style={{ fontSize: '0.82rem', fontWeight: '700', color, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {pct}%
          <span style={{ color: C.muted, fontWeight: '400', fontSize: '0.75rem' }}>({correct}/{total})</span>
        </span>
      </div>
      <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '9999px', transition: 'width 0.7s ease' }} />
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const score = payload[0]?.value;
  const pass = score >= 70;
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.75rem 1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '0.85rem' }}>
      <div style={{ color: C.muted, fontWeight: '600', marginBottom: '0.3rem' }}>Attempt {label}</div>
      <div style={{ fontWeight: '800', fontSize: '1.1rem', color: pass ? C.success : C.danger }}>{score?.toFixed(1)}%</div>
      <div style={{ color: pass ? C.success : C.danger, fontWeight: '600', fontSize: '0.75rem' }}>{pass ? '✓ Pass' : '✗ Below Passing'}</div>
    </div>
  );
}

function PassBadge({ score }) {
  const pass = parseFloat(score) >= 70;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', background: pass ? '#dcfce7' : '#fee2e2', color: pass ? C.success : C.danger }}>
      {pass ? <CheckCircle size={11} /> : <XCircle size={11} />} {pass ? 'Pass' : 'Fail'}
    </span>
  );
}

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
    return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  }

  function computeStreak(attempts) {
    if (!attempts?.length) return 0;
    const days = [...new Set(attempts.filter(a => a.submitted_at).map(a => new Date(a.submitted_at).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
    if (!days.length) return 0;
    let streak = 1;
    for (let i = 1; i < days.length; i++) {
      if ((new Date(days[i - 1]) - new Date(days[i])) / 86400000 === 1) streak++;
      else break;
    }
    return streak;
  }

  function buildInsights(domainStats) {
    if (!domainStats || !Object.keys(domainStats).length) return [];
    const entries = Object.entries(domainStats).filter(([, v]) => v.total > 0).map(([d, v]) => ({ domain: d, pct: Math.round((v.correct / v.total) * 100) })).sort((a, b) => b.pct - a.pct);
    const insights = [];
    if (entries.length > 0) insights.push({ icon: '🏆', text: `Strongest: ${entries[0].domain} at ${entries[0].pct}%` });
    if (entries.length > 1) insights.push({ icon: '📈', text: `Focus area: ${entries[entries.length - 1].domain} at ${entries[entries.length - 1].pct}%` });
    return insights;
  }

  const streak = data ? computeStreak(data.attempts) : 0;
  const mockCount = data ? data.attempts.filter(a => a.mode === 'mock').length : 0;
  const insights = data ? buildInsights(data.domainStats) : [];
  if (data && mockCount > 0) insights.push({ icon: '📋', text: `${mockCount} mock exam${mockCount !== 1 ? 's' : ''} completed` });

  const chartData = data ? data.attempts.filter(a => a.score != null).slice(-10).map((a, i) => ({
    name: i + 1,
    score: parseFloat(parseFloat(a.score).toFixed(1)),
    mode: a.mode,
  })) : [];

  const orderedDomains = data ? Object.keys(data.domainStats).sort() : [];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: font }}>
      {/* Header */}
      <header style={{ background: C.dark, padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={onHome}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5rem', padding: '0.4rem 0.85rem', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.825rem', fontWeight: '600' }}
        >
          <ArrowLeft size={14} /> Home
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={18} color="#93c5fd" />
          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>Performance Dashboard</span>
        </div>
      </header>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '5rem', color: C.muted }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
            Loading analytics...
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '0.85rem', padding: '1rem 1.5rem', marginBottom: '1.5rem', fontWeight: '500' }}>
            Failed to load dashboard: {error}
          </div>
        )}

        {data && (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <StatCard label="Total Attempts" value={data.totalAttempts} icon={Target} iconColor={C.primary} accent={C.primary} sub="exams taken" />
              <StatCard label="Average Score" value={data.totalAttempts > 0 ? `${data.avgScore}%` : '—'} icon={TrendingUp} iconColor={data.avgScore >= 70 ? C.success : C.danger} accent={data.avgScore >= 70 ? C.success : C.danger} sub={data.avgScore >= 70 ? 'Passing average' : 'Below passing'} />
              <StatCard label="Best Score" value={data.totalAttempts > 0 ? `${data.bestScore}%` : '—'} icon={Award} iconColor="#7c3aed" accent="#7c3aed" sub="personal best" />
              <StatCard label="Study Streak" value={streak} icon={Flame} iconColor="#f59e0b" accent="#f59e0b" sub={`${streak === 1 ? 'day' : 'days'} in a row`} />
            </div>

            {/* Score Trend */}
            <div style={{ background: C.card, borderRadius: '1.1rem', border: `1px solid ${C.border}`, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontWeight: '800', color: C.text, fontSize: '1rem' }}>Score Trend</div>
                  <div style={{ fontSize: '0.78rem', color: C.muted, marginTop: '0.15rem' }}>Last {chartData.length} completed attempts</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: C.muted, fontWeight: '600' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: C.success, display: 'inline-block' }} /> Pass
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: C.muted, fontWeight: '600' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: C.danger, display: 'inline-block' }} /> Fail
                  </span>
                </div>
              </div>

              {chartData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: C.muted }}>
                  <Calendar size={32} color="#cbd5e1" style={{ marginBottom: '0.75rem' }} />
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>No completed attempts yet</div>
                  <div style={{ fontSize: '0.85rem' }}>Submit an exam to see your score trend here.</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.muted }} label={{ value: 'Attempt', position: 'insideBottom', offset: -2, fontSize: 11, fill: C.muted }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: C.muted }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={70} stroke="#fbbf24" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: '70% Pass', position: 'right', fontSize: 10, fill: '#d97706', fontWeight: '700' }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={C.primary}
                      strokeWidth={2.5}
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        const pass = payload.score >= 70;
                        return <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={5} fill={pass ? C.success : C.danger} stroke="#fff" strokeWidth={2} />;
                      }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Domain + Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Domain Performance */}
              <div style={{ background: C.card, borderRadius: '1.1rem', border: `1px solid ${C.border}`, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontWeight: '800', color: C.text, marginBottom: '1.25rem', fontSize: '1rem' }}>Domain Performance</div>
                {orderedDomains.length === 0 ? (
                  <div style={{ color: C.muted, fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>No domain data yet.</div>
                ) : (
                  orderedDomains.map(domain => (
                    <DomainBar key={domain} domain={domain} correct={data.domainStats[domain].correct} total={data.domainStats[domain].total} />
                  ))
                )}
                <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: '#f8fafc', borderRadius: '0.6rem', fontSize: '0.75rem', color: C.muted, display: 'flex', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '1px', background: C.success, display: 'inline-block' }} /> ≥70% Strong</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '1px', background: C.warning, display: 'inline-block' }} /> 50–69% OK</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '1px', background: C.danger, display: 'inline-block' }} /> &lt;50% Focus</span>
                </div>
              </div>

              {/* Insights */}
              <div style={{ background: C.card, borderRadius: '1.1rem', border: `1px solid ${C.border}`, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontWeight: '800', color: C.text, marginBottom: '1.25rem', fontSize: '1rem' }}>Insights</div>
                {insights.length === 0 ? (
                  <div style={{ color: C.muted, fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>Complete more exams to unlock personalized insights.</div>
                ) : (
                  insights.map(({ icon, text }, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '0.9rem', background: '#f8fafc', borderRadius: '0.75rem', marginBottom: '0.65rem', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icon}</span>
                      <span style={{ fontSize: '0.875rem', color: C.text, fontWeight: '600', lineHeight: 1.45 }}>{text}</span>
                    </div>
                  ))
                )}

                {/* Quick stats */}
                <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  {[
                    { label: 'Mock Exams', value: mockCount },
                    { label: 'Practice Sessions', value: data.attempts.filter(a => a.mode === 'practice').length },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '0.6rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: C.primary, letterSpacing: '-0.03em' }}>{value}</div>
                      <div style={{ fontSize: '0.72rem', color: C.muted, fontWeight: '600', marginTop: '0.15rem' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attempt History Table */}
            <div style={{ background: C.card, borderRadius: '1.1rem', border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: '800', color: C.text, fontSize: '1rem' }}>Attempt History</div>
                <span style={{ fontSize: '0.78rem', color: C.muted, fontWeight: '600' }}>{data.attempts.length} total</span>
              </div>
              {data.attempts.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: C.muted }}>No attempts yet.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['#', 'Date', 'Mode', 'Score', 'Result'].map(h => (
                          <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontWeight: '700', color: C.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...data.attempts].reverse().map((attempt, i) => (
                        <tr key={attempt.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                          <td style={{ padding: '0.85rem 1.25rem', color: C.muted, fontWeight: '600', fontSize: '0.8rem' }}>{data.attempts.length - i}</td>
                          <td style={{ padding: '0.85rem 1.25rem', color: C.text, whiteSpace: 'nowrap', fontWeight: '500' }}>{formatDate(attempt.started_at)}</td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', background: attempt.mode === 'mock' ? '#fffbeb' : '#eff6ff', color: attempt.mode === 'mock' ? C.warning : C.primary, textTransform: 'capitalize' }}>
                              {attempt.mode === 'mock' ? '⏱' : '📖'} {attempt.mode}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem', fontWeight: '800', color: C.text }}>
                            {attempt.score != null ? `${parseFloat(attempt.score).toFixed(1)}%` : '—'}
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            {attempt.score != null ? <PassBadge score={attempt.score} /> : <span style={{ fontSize: '0.75rem', color: C.muted }}>—</span>}
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
