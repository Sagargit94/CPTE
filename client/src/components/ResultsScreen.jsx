import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, CheckCircle, XCircle, Flag } from 'lucide-react';

const DOMAIN_COLORS = {
  Musculoskeletal:  'var(--primary)',
  Neuromuscular:    '#7c3aed',
  Cardiopulmonary:  'var(--danger)',
  Integumentary:    'var(--accent)',
  'Other Systems':  'var(--success)',
  'Non-Systems':    '#0891b2',
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const FILTERS = ['All', 'Incorrect', 'Flagged', 'Unanswered'];

export default function ResultsScreen({ attempt, onHome }) {
  const { attempt: attemptData, questions, answers } = attempt;
  const [filter, setFilter] = useState('All');
  const [expandedQ, setExpandedQ] = useState(null);

  const score = attemptData.score ?? 0;
  const total = questions.length;

  const answerMap = {};
  (answers || []).forEach(a => { answerMap[a.question_id] = a; });

  const domainStats = {};
  questions.forEach(q => {
    if (!domainStats[q.domain]) domainStats[q.domain] = { correct: 0, total: 0 };
    domainStats[q.domain].total++;
    const ans = answerMap[q.id];
    if (ans?.selected_option_index === q.correct_option_index) domainStats[q.domain].correct++;
  });

  const correctCount = Math.round((score / 100) * total);
  const pass = score >= 70;

  const filteredQuestions = questions.filter(q => {
    const ans = answerMap[q.id];
    if (filter === 'Incorrect')  return ans?.selected_option_index !== q.correct_option_index;
    if (filter === 'Flagged')    return ans?.is_flagged;
    if (filter === 'Unanswered') return ans?.selected_option_index == null;
    return true;
  });

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)';
  const scoreRaw   = score >= 70 ? '#059669'        : score >= 50 ? '#d97706'        : '#e11d48';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      {/* Header */}
      <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 1.75rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--primary)', fontFamily: 'var(--font-head)' }}>CPTE Prep · Results</div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onHome} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <Home size={14} /> Back to Home
        </motion.button>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.25rem' }}>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.25rem', fontFamily: 'var(--font-head)', letterSpacing: '-0.03em' }}>
            {attemptData.mode === 'practice' ? 'Practice Session' : 'Mock Exam'} Results
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            {correctCount} of {total} correct · {attemptData.mode === 'mock' ? 'Timed exam' : 'Practice mode'}
          </p>
        </motion.div>

        {/* Score ring + domain breakdown */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>

          {/* Score ring */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="card"
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 210px' }}>
            <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="70" cy="70" r={radius} stroke="var(--border)" strokeWidth="10" fill="none" />
              <motion.circle
                cx="70" cy="70" r={radius}
                stroke={scoreRaw}
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ marginTop: '-1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: scoreColor, fontFamily: 'var(--font-head)', letterSpacing: '-0.04em' }}>{score.toFixed(0)}%</div>
              <div style={{ fontSize: '0.8rem', color: pass ? 'var(--success)' : 'var(--danger)', fontWeight: '700', marginTop: '0.2rem' }}>
                {pass ? '✓ Passing' : '✗ Below Passing'}
              </div>
            </div>
            <div style={{ marginTop: '1rem', padding: '0.5rem 0.9rem', borderRadius: '9999px', background: pass ? 'var(--success-light)' : 'var(--danger-light)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: '700', color: pass ? 'var(--success)' : 'var(--danger)' }}>
              {pass ? <CheckCircle size={12} /> : <XCircle size={12} />} {pass ? 'PASS' : 'FAIL'}
            </div>
          </motion.div>

          {/* Domain bars */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="card"
            style={{ padding: '1.5rem', flex: '1 1 300px' }}>
            <div style={{ fontWeight: '800', marginBottom: '1.25rem', color: 'var(--text)', fontFamily: 'var(--font-head)', fontSize: '1rem' }}>Performance by Domain</div>
            {Object.entries(domainStats).map(([domain, { correct, total: dt }]) => {
              const pct = dt > 0 ? (correct / dt) * 100 : 0;
              const barColor = pct >= 70 ? '#059669' : pct >= 50 ? '#d97706' : '#e11d48';
              const domainColor = DOMAIN_COLORS[domain] || 'var(--primary)';
              return (
                <div key={domain} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.35rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: domainColor, display: 'inline-block' }} />
                      {domain}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{correct}/{dt}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                      style={{ height: '100%', background: barColor, borderRadius: '999px' }} />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Question review */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text)', fontFamily: 'var(--font-head)' }}>Question Review</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <motion.button key={f} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setFilter(f)}
                  style={{ padding: '0.35rem 0.85rem', border: `1.5px solid ${filter === f ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '999px', background: filter === f ? 'var(--primary)' : 'transparent', color: filter === f ? '#fff' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  {f}
                </motion.button>
              ))}
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No questions match this filter.</div>
          ) : filteredQuestions.map((q) => {
            const ans = answerMap[q.id];
            const selected = ans?.selected_option_index;
            const correct = q.correct_option_index;
            const isCorrect = selected === correct;
            const isUnanswered = selected == null;
            const isFlagged = ans?.is_flagged;
            const isExpanded = expandedQ === q.id;
            const qNum = questions.indexOf(q) + 1;

            return (
              <div key={q.id} style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '0.65rem', overflow: 'hidden' }}>
                <div
                  onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1rem', cursor: 'pointer', background: isExpanded ? 'var(--bg-subtle)' : 'var(--bg-card)', userSelect: 'none', transition: 'background 0.15s' }}>
                  <span style={{ width: '1.5rem', height: '1.5rem', minWidth: '1.5rem', borderRadius: '50%', background: isUnanswered ? 'var(--text-muted)' : isCorrect ? 'var(--success)' : 'var(--danger)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0, marginTop: '0.1rem' }}>
                    {isUnanswered ? '?' : isCorrect ? '✓' : '✗'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      Q{qNum} · {q.domain} {isFlagged && <Flag size={10} color="var(--accent)" fill="var(--accent)" />}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.45', fontWeight: '500' }}>
                      {q.question_text.length > 120 ? q.question_text.slice(0, 120) + '…' : q.question_text}
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
                </div>

                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.1rem', background: 'var(--bg-subtle)' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: '1.6', marginBottom: '1rem', fontWeight: '500' }}>{q.question_text}</p>
                    <div>
                      {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, idx) => {
                        const isCorrectOpt = idx === correct;
                        const isSelectedOpt = idx === selected;
                        let borderColor = 'var(--border)', bg = 'var(--bg-card)', textColor = 'var(--text)';
                        if (isCorrectOpt) { borderColor = 'var(--success)'; bg = 'var(--success-light)'; textColor = 'var(--success)'; }
                        else if (isSelectedOpt && !isCorrect) { borderColor = 'var(--danger)'; bg = 'var(--danger-light)'; textColor = 'var(--danger)'; }
                        return (
                          <div key={idx} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', padding: '0.6rem 0.75rem', border: `1.5px solid ${borderColor}`, borderRadius: 'var(--radius-sm)', marginBottom: '0.45rem', background: bg }}>
                            <span style={{ fontWeight: '700', color: textColor, flexShrink: 0, width: '1.1rem' }}>{OPTION_LABELS[idx]}.</span>
                            <span style={{ fontSize: '0.875rem', color: textColor, lineHeight: '1.4' }}>{opt}</span>
                            {isCorrectOpt && <span style={{ marginLeft: 'auto', color: 'var(--success)', fontWeight: '700', flexShrink: 0, fontSize: '0.8rem' }}>✓ Correct</span>}
                            {isSelectedOpt && !isCorrectOpt && <span style={{ marginLeft: 'auto', color: 'var(--danger)', fontWeight: '700', flexShrink: 0, fontSize: '0.8rem' }}>Your answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'var(--primary-light)', border: '1px solid var(--primary-mid)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--text)', lineHeight: '1.55' }}>
                      <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Rationale: </span>{q.rationale}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
