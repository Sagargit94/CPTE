import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDashboard } from '../lib/api.js';
import { ArrowLeft, TrendingUp, Award, Target, Flame, BarChart2, Calendar, CheckCircle, XCircle, BookOpen, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const DOMAIN_COLORS = {
  Musculoskeletal:  'var(--primary)',
  Neuromuscular:    '#7c3aed',
  Cardiopulmonary:  'var(--danger)',
  Integumentary:    'var(--accent)',
  'Other Systems':  'var(--success)',
  'Non-Systems':    '#0891b2',
};

const DOMAIN_COLORS_RAW = {
  Musculoskeletal:  '#0d5c73',
  Neuromuscular:    '#7c3aed',
  Cardiopulmonary:  '#e11d48',
  Integumentary:    '#c8921a',
  'Other Systems':  '#059669',
  'Non-Systems':    '#0891b2',
};

function StatCard({ label, value, sub, icon: Icon, iconColor, accentColor }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ padding: '1.4rem 1.5rem', flex: '1', minWidth: '150px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accentColor, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
        {Icon && <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: `${iconColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={16} color={iconColor} /></div>}
      </div>
      <div style={{ fontSize: '2.1rem', fontWeight: '900', color: 'var(--text)', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--font-head)' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: '500' }}>{sub}</div>}
    </motion.div>
  );
}

function DomainBar({ domain, correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const barColorRaw = pct >= 70 ? '#059669' : pct >= 50 ? '#d97706' : '#e11d48';
  const barColor    = pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
  const domainColor = DOMAIN_COLORS[domain] || 'var(--primary)';
  const domainColorRaw = DOMAIN_COLORS_RAW[domain] || '#0d5c73';

  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: domainColorRaw, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text)' }}>{domain}</span>
        </div>
        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: barColor, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {pct}%
          <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.75rem' }}>({correct}/{total})</span>
        </span>
      </div>
      <div style={{ height: '7px', background: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: barColorRaw, borderRadius: '9999px' }} />
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const score = payload[0]?.value;
  const pass = score >= 70;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', boxShadow: 'var(--shadow)', fontSize: '0.85rem' }}>
      <div style={{ color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.3rem' }}>Attempt {label}</div>
      <div style={{ fontWeight: '800', fontSize: '1.1rem', color: pass ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--font-head)' }}>{score?.toFixed(1)}%</div>
      <div style={{ color: pass ? 'var(--success)' : 'var(--danger)', fontWeight: '600', fontSize: '0.75rem' }}>{pass ? '✓ Pass' : '✗ Below Passing'}</div>
    </div>
  );
}

function PassBadge({ score }) {
  const pass = parseFloat(score) >= 70;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', background: pass ? 'var(--success-light)' : 'var(--danger-light)', color: pass ? 'var(--success)' : 'var(--danger)' }}>
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
  const avgScorePass = data && data.avgScore >= 70;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      {/* Header */}
      <header style={{ background: 'var(--bg-card)', padding: '0 1.75rem', height: '60px', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 100 }}>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onHome} className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem' }}>
          <ArrowLeft size={14} /> Home
        </motion.button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={18} color="var(--primary)" />
          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text)', fontFamily: 'var(--font-head)' }}>Performance Dashboard</span>
        </div>
      </header>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1.25rem' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
              Loading analytics…
            </motion.div>
          </div>
        )}

        {error && (
          <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius)', padding: '1rem 1.5rem', marginBottom: '1.5rem', fontWeight: '500' }}>
            Failed to load dashboard: {error}
          </div>
        )}

        {data && (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <StatCard label="Total Attempts" value={data.totalAttempts} icon={Target} iconColor="#0d5c73" accentColor="var(--primary)" sub="exams taken" />
              <StatCard label="Average Score" value={data.totalAttempts > 0 ? `${data.avgScore}%` : '—'} icon={TrendingUp} iconColor={avgScorePass ? '#059669' : '#e11d48'} accentColor={avgScorePass ? 'var(--success)' : 'var(--danger)'} sub={avgScorePass ? 'Passing average' : 'Below passing'} />
              <StatCard label="Best Score" value={data.totalAttempts > 0 ? `${data.bestScore}%` : '—'} icon={Award} iconColor="#7c3aed" accentColor="#7c3aed" sub="personal best" />
              <StatCard label="Study Streak" value={streak} icon={Flame} iconColor="#f59e0b" accentColor="var(--warning)" sub={`${streak === 1 ? 'day' : 'days'} in a row`} />
            </div>

            {/* Score Trend */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--text)', fontSize: '1rem', fontFamily: 'var(--font-head)' }}>Score Trend</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Last {chartData.length} completed attempts</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} /> Pass
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e11d48', display: 'inline-block' }} /> Fail
                  </span>
                </div>
              </div>

              {chartData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  <Calendar size={32} color="var(--border)" style={{ marginBottom: '0.75rem' }} />
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>No completed attempts yet</div>
                  <div style={{ fontSize: '0.85rem' }}>Submit an exam to see your score trend here.</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Attempt', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={70} stroke="#d97706" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: '70% Pass', position: 'right', fontSize: 10, fill: '#d97706', fontWeight: '700' }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#0d5c73"
                      strokeWidth={2.5}
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        const pass = payload.score >= 70;
                        return <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={5} fill={pass ? '#059669' : '#e11d48'} stroke="var(--bg-card)" strokeWidth={2} />;
                      }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Domain + Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem', fontSize: '1rem', fontFamily: 'var(--font-head)' }}>Domain Performance</div>
                {orderedDomains.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>No domain data yet.</div>
                ) : orderedDomains.map(domain => (
                  <DomainBar key={domain} domain={domain} correct={data.domainStats[domain].correct} total={data.domainStats[domain].total} />
                ))}
                <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '1px', background: '#059669', display: 'inline-block' }} /> ≥70% Strong</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '1px', background: '#d97706', display: 'inline-block' }} /> 50–69% OK</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '1px', background: '#e11d48', display: 'inline-block' }} /> &lt;50% Focus</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem', fontSize: '1rem', fontFamily: 'var(--font-head)' }}>Insights</div>
                {insights.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>Complete more exams to unlock personalized insights.</div>
                ) : insights.map(({ icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '0.9rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', marginBottom: '0.65rem', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: '600', lineHeight: 1.45 }}>{text}</span>
                  </div>
                ))}
                <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  {[
                    { label: 'Mock Exams', value: mockCount, icon: Clock, color: 'var(--accent)' },
                    { label: 'Practice Sessions', value: data.attempts.filter(a => a.mode === 'practice').length, icon: BookOpen, color: 'var(--primary)' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border)' }}>
                      <Icon size={16} color={color} style={{ marginBottom: '0.3rem' }} />
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text)', letterSpacing: '-0.03em', fontFamily: 'var(--font-head)' }}>{value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.15rem' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Attempt History Table */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: '800', color: 'var(--text)', fontSize: '1rem', fontFamily: 'var(--font-head)' }}>Attempt History</div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>{data.attempts.length} total</span>
              </div>
              {data.attempts.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No attempts yet.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-subtle)' }}>
                        {['#', 'Date', 'Mode', 'Score', 'Result'].map(h => (
                          <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...data.attempts].reverse().map((attempt, i) => (
                        <tr key={attempt.id} style={{ borderTop: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.8rem' }}>{data.attempts.length - i}</td>
                          <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text)', whiteSpace: 'nowrap', fontWeight: '500' }}>{formatDate(attempt.started_at)}</td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', background: attempt.mode === 'mock' ? 'var(--accent-light)' : 'var(--primary-light)', color: attempt.mode === 'mock' ? 'var(--accent)' : 'var(--primary)', textTransform: 'capitalize' }}>
                              {attempt.mode === 'mock' ? <Clock size={10} /> : <BookOpen size={10} />} {attempt.mode}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem', fontWeight: '800', color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                            {attempt.score != null ? `${parseFloat(attempt.score).toFixed(1)}%` : '—'}
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            {attempt.score != null ? <PassBadge score={attempt.score} /> : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
