import React, { useState } from 'react';

const C = {
  primary: '#2563eb',
  success: '#16a34a',
  danger: '#dc2626',
  bg: '#f8fafc',
  card: '#ffffff',
  text: '#1e293b',
  muted: '#64748b',
  border: '#e2e8f0',
};

const DOMAIN_COLORS = {
  Musculoskeletal: '#2563eb',
  Neuromuscular: '#7c3aed',
  Cardiopulmonary: '#dc2626',
  Integumentary: '#d97706',
  'Other Systems': '#059669',
  'Non-Systems': '#0891b2',
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const FILTERS = ['All', 'Incorrect', 'Flagged', 'Unanswered'];

export default function ResultsScreen({ attempt, onHome }) {
  const { attempt: attemptData, questions, answers } = attempt;
  const [filter, setFilter] = useState('All');
  const [expandedQ, setExpandedQ] = useState(null);

  const score = attemptData.score ?? 0;
  const total = questions.length;

  // Build lookup maps
  const answerMap = {};
  (answers || []).forEach(a => { answerMap[a.question_id] = a; });

  const questionMap = {};
  (questions || []).forEach(q => { questionMap[q.id] = q; });

  // Domain breakdown
  const domainStats = {};
  questions.forEach(q => {
    if (!domainStats[q.domain]) domainStats[q.domain] = { correct: 0, total: 0 };
    domainStats[q.domain].total++;
    const ans = answerMap[q.id];
    if (ans?.selected_option_index === q.correct_option_index) {
      domainStats[q.domain].correct++;
    }
  });

  const correctCount = Math.round((score / 100) * total);

  // Filtered question list
  const filteredQuestions = questions.filter(q => {
    const ans = answerMap[q.id];
    if (filter === 'Incorrect') return ans?.selected_option_index !== q.correct_option_index;
    if (filter === 'Flagged') return ans?.is_flagged;
    if (filter === 'Unanswered') return ans?.selected_option_index == null;
    return true;
  });

  const scoreColor = score >= 70 ? C.success : score >= 50 ? '#d97706' : C.danger;
  const mode = attemptData.mode;

  // SVG circle for score ring
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      {/* Header */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: '800', fontSize: '1.2rem', color: C.primary }}>CPTE Exam Prep</div>
        <button
          onClick={onHome}
          style={{ padding: '0.5rem 1.25rem', background: C.primary, color: '#fff', border: 'none', borderRadius: '0.6rem', fontWeight: '700', cursor: 'pointer' }}
        >
          ← Back to Home
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: C.text, marginBottom: '0.25rem' }}>
          {mode === 'practice' ? 'Practice Session' : 'Mock Exam'} Results
        </h1>
        <p style={{ color: C.muted, marginBottom: '2rem' }}>
          Submitted · {correctCount} of {total} correct
        </p>

        {/* Score ring + domain breakdown */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {/* Score ring */}
          <div style={{ background: C.card, borderRadius: '1rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 200px' }}>
            <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="70" cy="70" r={radius} stroke={C.border} strokeWidth="10" fill="none" />
              <circle
                cx="70" cy="70" r={radius}
                stroke={scoreColor}
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div style={{ marginTop: '-1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: scoreColor }}>{score.toFixed(0)}%</div>
              <div style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '600' }}>
                {score >= 70 ? 'Passing' : 'Below Passing'}
              </div>
            </div>
          </div>

          {/* Domain bars */}
          <div style={{ background: C.card, borderRadius: '1rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: '1.5rem', flex: '1 1 300px' }}>
            <div style={{ fontWeight: '700', marginBottom: '1rem', color: C.text }}>Performance by Domain</div>
            {Object.entries(domainStats).map(([domain, { correct, total: dt }]) => {
              const pct = dt > 0 ? (correct / dt) * 100 : 0;
              const color = DOMAIN_COLORS[domain] || C.primary;
              return (
                <div key={domain} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', color: C.text, marginBottom: '0.3rem' }}>
                    <span>{domain}</span>
                    <span style={{ color: C.muted }}>{correct}/{dt}</span>
                  </div>
                  <div style={{ height: '8px', background: C.border, borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '999px', transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question review */}
        <div style={{ background: C.card, borderRadius: '1rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: C.text }}>Question Review</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    border: `1.5px solid ${filter === f ? C.primary : C.border}`,
                    borderRadius: '999px',
                    background: filter === f ? C.primary : 'transparent',
                    color: filter === f ? '#fff' : C.muted,
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: C.muted }}>No questions match this filter.</div>
          ) : (
            filteredQuestions.map((q, i) => {
              const ans = answerMap[q.id];
              const selected = ans?.selected_option_index;
              const correct = q.correct_option_index;
              const isCorrect = selected === correct;
              const isUnanswered = selected == null;
              const isFlagged = ans?.is_flagged;
              const isExpanded = expandedQ === q.id;
              const qNum = questions.indexOf(q) + 1;

              return (
                <div key={q.id} style={{ border: `1.5px solid ${C.border}`, borderRadius: '0.75rem', marginBottom: '0.65rem', overflow: 'hidden' }}>
                  {/* Question row */}
                  <div
                    onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem 1rem', cursor: 'pointer', background: isExpanded ? '#f8fafc' : C.card, userSelect: 'none' }}
                  >
                    <span style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      minWidth: '1.5rem',
                      borderRadius: '50%',
                      background: isUnanswered ? C.muted : isCorrect ? C.success : C.danger,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      flexShrink: 0,
                      marginTop: '0.1rem',
                    }}>
                      {isUnanswered ? '?' : isCorrect ? '✓' : '✗'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.75rem', color: C.muted, fontWeight: '600', marginBottom: '0.2rem' }}>
                        Q{qNum} · {q.domain} {isFlagged ? '🚩' : ''}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: C.text, lineHeight: '1.45', fontWeight: '500' }}>
                        {q.question_text.length > 120 ? q.question_text.slice(0, 120) + '…' : q.question_text}
                      </div>
                    </div>
                    <span style={{ color: C.muted, fontSize: '0.85rem', flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ borderTop: `1px solid ${C.border}`, padding: '1rem 1.1rem', background: '#fafbfc' }}>
                      <p style={{ fontSize: '0.95rem', color: C.text, lineHeight: '1.6', marginBottom: '1rem', fontWeight: '500' }}>{q.question_text}</p>
                      <div>
                        {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, idx) => {
                          const isCorrectOpt = idx === correct;
                          const isSelectedOpt = idx === selected;
                          let borderColor = C.border, bg = C.card, textColor = C.text;
                          if (isCorrectOpt) { borderColor = C.success; bg = '#f0fdf4'; textColor = C.success; }
                          else if (isSelectedOpt && !isCorrect) { borderColor = C.danger; bg = '#fef2f2'; textColor = C.danger; }
                          return (
                            <div key={idx} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', padding: '0.6rem 0.75rem', border: `1.5px solid ${borderColor}`, borderRadius: '0.6rem', marginBottom: '0.45rem', background: bg }}>
                              <span style={{ fontWeight: '700', color: textColor, flexShrink: 0, width: '1.1rem' }}>{OPTION_LABELS[idx]}.</span>
                              <span style={{ fontSize: '0.875rem', color: textColor, lineHeight: '1.4' }}>{opt}</span>
                              {isCorrectOpt && <span style={{ marginLeft: 'auto', color: C.success, fontWeight: '700', flexShrink: 0 }}>✓ Correct</span>}
                              {isSelectedOpt && !isCorrectOpt && <span style={{ marginLeft: 'auto', color: C.danger, fontWeight: '700', flexShrink: 0 }}>Your answer</span>}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ marginTop: '1rem', padding: '0.85rem', background: '#eff6ff', border: `1px solid #bfdbfe`, borderRadius: '0.6rem', fontSize: '0.875rem', color: C.text, lineHeight: '1.55' }}>
                        <span style={{ fontWeight: '700', color: C.primary }}>Rationale: </span>{q.rationale}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
