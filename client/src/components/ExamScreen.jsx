import React, { useState, useEffect, useRef, useCallback } from 'react';
import { saveAnswer, submitAttempt } from '../lib/api.js';

const COLORS = {
  primary: '#2563eb',
  bg: '#f8fafc',
  card: '#fff',
  text: '#1e293b',
  muted: '#64748b',
  border: '#e2e8f0',
  correct: '#16a34a',
  wrong: '#dc2626',
  flag: '#d97706',
  answered: '#2563eb',
  unanswered: '#e2e8f0'
};

function formatTime(secs) {
  if (secs < 0) secs = 0;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ExamScreen({ attempt, onFinish }) {
  const { attempt: att, questions } = attempt;
  const isMock = att.mode === 'mock';
  const isPractice = att.mode === 'practice';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> selectedOptionIndex
  const [flags, setFlags] = useState(new Set());
  const [feedback, setFeedback] = useState({}); // questionId -> { isCorrect, correctOptionIndex, rationale }
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const submittedRef = useRef(false);

  // Initialize timeLeft for mock mode
  useEffect(() => {
    if (isMock && att.server_expires_at) {
      const remaining = Math.floor((new Date(att.server_expires_at) - Date.now()) / 1000);
      setTimeLeft(Math.max(0, remaining));
    }
  }, [isMock, att.server_expires_at]);

  // Countdown timer
  useEffect(() => {
    if (!isMock || timeLeft === null) return;
    if (timeLeft <= 0) {
      if (!submittedRef.current) handleAutoSubmit();
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, isMock]);

  async function handleAutoSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    try {
      const result = await submitAttempt(att.id);
      onFinish(result);
    } catch (err) {
      alert('Auto-submit error: ' + err.message);
    }
  }

  const currentQuestion = questions[currentIdx];
  const OPTIONS = ['A', 'B', 'C', 'D'];
  const optionKeys = ['option_a', 'option_b', 'option_c', 'option_d'];

  async function handleSelectOption(optionIdx) {
    if (submitting) return;
    const qId = currentQuestion.id;

    // In practice mode, don't re-answer if already answered
    if (isPractice && answers[qId] !== undefined) return;

    const isFlagged = flags.has(qId);
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    setSaving(true);

    try {
      const res = await saveAnswer(att.id, qId, optionIdx, isFlagged);
      if (isPractice) {
        setFeedback(prev => ({ ...prev, [qId]: res }));
      }
    } catch (err) {
      if (err.message.includes('expired')) {
        alert('Time expired! Submitting exam...');
        await handleAutoSubmit();
      } else {
        alert('Save error: ' + err.message);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleFlag() {
    const qId = currentQuestion.id;
    const newFlags = new Set(flags);
    const isFlagged = !newFlags.has(qId);
    if (isFlagged) newFlags.add(qId); else newFlags.delete(qId);
    setFlags(newFlags);

    const selIdx = answers[qId] ?? null;
    try {
      await saveAnswer(att.id, qId, selIdx, isFlagged);
    } catch {}
  }

  async function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    setShowConfirm(false);
    try {
      const result = await submitAttempt(att.id);
      onFinish(result);
    } catch (err) {
      submittedRef.current = false;
      setSubmitting(false);
      alert('Submit error: ' + err.message);
    }
  }

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flags.size;
  const unansweredCount = questions.length - answeredCount;

  const fb = feedback[currentQuestion?.id];
  const selIdx = answers[currentQuestion?.id];
  const isAnswered = selIdx !== undefined;

  function getNavButtonStyle(i) {
    const q = questions[i];
    const qId = q.id;
    const isCurrent = i === currentIdx;
    const isAns = answers[qId] !== undefined;
    const isFlag = flags.has(qId);

    let bg = COLORS.unanswered;
    let color = '#475569';
    if (isCurrent) { bg = COLORS.primary; color = '#fff'; }
    else if (isFlag) { bg = '#fef3c7'; color = COLORS.flag; }
    else if (isAns) { bg = '#dbeafe'; color = COLORS.primary; }

    return {
      width: '36px', height: '36px', borderRadius: '0.35rem', border: isCurrent ? `2px solid ${COLORS.primary}` : '1.5px solid transparent',
      background: bg, color, fontWeight: isCurrent ? '800' : '600', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
    };
  }

  function getOptionStyle(idx) {
    const base = {
      width: '100%', textAlign: 'left', padding: '0.85rem 1rem', borderRadius: '0.6rem',
      border: '2px solid', fontSize: '0.95rem', cursor: 'pointer', marginBottom: '0.6rem',
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem', transition: 'all 0.15s', background: '#fff'
    };

    if (!fb && !isAnswered) {
      return { ...base, borderColor: COLORS.border, color: COLORS.text };
    }

    if (isPractice && fb) {
      if (idx === fb.correctOptionIndex) return { ...base, borderColor: COLORS.correct, background: '#f0fdf4', color: COLORS.correct };
      if (idx === selIdx && !fb.isCorrect) return { ...base, borderColor: COLORS.wrong, background: '#fef2f2', color: COLORS.wrong };
      return { ...base, borderColor: COLORS.border, color: '#9ca3af' };
    }

    if (idx === selIdx) return { ...base, borderColor: COLORS.primary, background: '#eff6ff', color: COLORS.primary };
    return { ...base, borderColor: COLORS.border, color: COLORS.text };
  }

  if (submitting) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: COLORS.bg, flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '1.5rem', color: COLORS.primary, fontWeight: '700' }}>Submitting Exam...</div>
        <div style={{ color: COLORS.muted }}>Please wait while we calculate your score.</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`, padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontWeight: '800', color: COLORS.primary, fontSize: '1.1rem' }}>CPTE Exam Prep</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: isMock ? '#fef3c7' : '#dbeafe', color: isMock ? COLORS.flag : COLORS.primary, borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700' }}>
            {isMock ? 'Mock Exam' : 'Practice Mode'}
          </span>
          {isMock && timeLeft !== null && (
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: timeLeft < 300 ? COLORS.wrong : COLORS.text, fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Main question area */}
        <div style={{ flex: 1 }}>
          {/* Question header */}
          <div style={{ background: COLORS.card, borderRadius: '1rem', padding: '1.5rem', marginBottom: '1rem', border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: COLORS.muted, fontWeight: '600' }}>Question {currentIdx + 1} of {questions.length}</span>
              <span style={{ padding: '0.2rem 0.6rem', background: '#eff6ff', color: COLORS.primary, borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                {currentQuestion.domain}
              </span>
              <button
                onClick={handleToggleFlag}
                style={{ marginLeft: 'auto', padding: '0.3rem 0.75rem', background: flags.has(currentQuestion.id) ? '#fef3c7' : '#fff', border: `1.5px solid ${flags.has(currentQuestion.id) ? COLORS.flag : COLORS.border}`, borderRadius: '0.5rem', color: flags.has(currentQuestion.id) ? COLORS.flag : COLORS.muted, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                {flags.has(currentQuestion.id) ? '⚑ Flagged' : '⚐ Flag'}
              </button>
            </div>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.65', color: COLORS.text, fontWeight: '500' }}>{currentQuestion.question_text}</p>
          </div>

          {/* Options */}
          <div style={{ background: COLORS.card, borderRadius: '1rem', padding: '1.5rem', border: `1px solid ${COLORS.border}`, marginBottom: '1rem' }}>
            {OPTIONS.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isPractice && isAnswered}
                style={getOptionStyle(idx)}
              >
                <span style={{ fontWeight: '800', minWidth: '1.5rem', fontSize: '0.95rem' }}>{letter}.</span>
                <span>{currentQuestion[optionKeys[idx]]}</span>
              </button>
            ))}
          </div>

          {/* Practice feedback */}
          {isPractice && fb && (
            <div style={{ background: fb.isCorrect ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${fb.isCorrect ? '#86efac' : '#fca5a5'}`, borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: '700', color: fb.isCorrect ? COLORS.correct : COLORS.wrong, marginBottom: '0.5rem', fontSize: '1rem' }}>
                {fb.isCorrect ? '✓ Correct!' : `✗ Incorrect — Correct answer: ${OPTIONS[fb.correctOptionIndex]}`}
              </div>
              <div style={{ color: COLORS.text, lineHeight: '1.6', fontSize: '0.95rem' }}>
                <strong>Rationale:</strong> {fb.rationale}
              </div>
            </div>
          )}

          {saving && <div style={{ color: COLORS.muted, fontSize: '0.85rem', textAlign: 'center' }}>Saving...</div>}
        </div>

        {/* Sidebar */}
        <div style={{ width: '240px', flexShrink: 0 }}>
          <div style={{ background: COLORS.card, borderRadius: '1rem', padding: '1.25rem', border: `1px solid ${COLORS.border}`, marginBottom: '1rem' }}>
            <div style={{ fontWeight: '700', color: COLORS.text, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Question Navigator</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '1rem' }}>
              {questions.map((_, i) => (
                <button key={i} style={getNavButtonStyle(i)} onClick={() => setCurrentIdx(i)}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: COLORS.muted, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ width: 12, height: 12, background: '#dbeafe', borderRadius: '2px', display: 'inline-block' }}></span> Answered ({answeredCount})
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ width: 12, height: 12, background: '#fef3c7', borderRadius: '2px', display: 'inline-block' }}></span> Flagged ({flaggedCount})
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ width: 12, height: 12, background: COLORS.unanswered, borderRadius: '2px', display: 'inline-block' }}></span> Unanswered ({unansweredCount})
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            style={{ width: '100%', padding: '0.75rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '0.6rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ background: COLORS.card, borderTop: `1px solid ${COLORS.border}`, padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', bottom: 0 }}>
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          style={{ padding: '0.6rem 1.5rem', background: COLORS.card, border: `1.5px solid ${COLORS.border}`, borderRadius: '0.5rem', fontWeight: '600', cursor: currentIdx === 0 ? 'not-allowed' : 'pointer', color: currentIdx === 0 ? COLORS.muted : COLORS.text, fontSize: '0.9rem' }}
        >
          ← Previous
        </button>
        <span style={{ color: COLORS.muted, fontSize: '0.9rem' }}>{currentIdx + 1} / {questions.length}</span>
        <button
          onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
          disabled={currentIdx === questions.length - 1}
          style={{ padding: '0.6rem 1.5rem', background: COLORS.primary, border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: currentIdx === questions.length - 1 ? 'not-allowed' : 'pointer', color: '#fff', opacity: currentIdx === questions.length - 1 ? 0.5 : 1, fontSize: '0.9rem' }}
        >
          Next →
        </button>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', maxWidth: '420px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontWeight: '800', fontSize: '1.2rem', color: COLORS.text, marginBottom: '0.75rem' }}>Submit Exam?</div>
            <div style={{ color: COLORS.muted, marginBottom: '1.25rem', lineHeight: '1.6' }}>
              You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
              {unansweredCount > 0 && <> <strong style={{ color: COLORS.wrong }}>{unansweredCount} unanswered</strong> questions will be marked incorrect.</>}
              {' '}This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '0.65rem', background: '#fff', border: `1.5px solid ${COLORS.border}`, borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', color: COLORS.text }}>
                Cancel
              </button>
              <button onClick={handleSubmit} style={{ flex: 1, padding: '0.65rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' }}>
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
