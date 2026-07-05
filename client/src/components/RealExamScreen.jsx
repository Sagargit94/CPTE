import React, { useState, useEffect, useRef, useCallback } from 'react';
import { saveAnswer, submitAttempt } from '../lib/api.js';

const DARK = '#1a2e2e';
const TEAL = '#1d6b5e';
const TEAL_HOVER = '#155248';
const TEAL_SELECTED = '#1d6b5e';
const RED_X = '#c0392b';
const BORDER = '#d0d7d5';
const BG_PANEL = '#f5f7f6';
const WHITE = '#ffffff';

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export default function RealExamScreen({ attempt, questions, answers: initialAnswers, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const map = {};
    (initialAnswers || []).forEach(a => {
      map[a.question_id] = {
        selected: a.selected_option_index,
        flagged: a.is_flagged || false,
        eliminated: [],
      };
    });
    return map;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    if (attempt.server_expires_at) {
      const ms = new Date(attempt.server_expires_at) - new Date();
      return Math.max(0, Math.floor(ms / 1000));
    }
    return attempt.mode === 'real' ? 9000 : null;
  });
  const [saving, setSaving] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const navRef = useRef(null);

  const q = questions[currentIdx];
  const qAnswer = answers[q?.id] || { selected: null, flagged: false, eliminated: [] };

  // Timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  // Scroll nav to current question
  useEffect(() => {
    if (navRef.current) {
      const el = navRef.current.querySelector(`[data-idx="${currentIdx}"]`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [currentIdx]);

  const saveToServer = useCallback(async (qid, selected, flagged) => {
    setSaving(true);
    try {
      await saveAnswer(attempt.id, qid, selected, flagged);
    } catch (e) {
      console.error('Save failed', e);
    } finally {
      setSaving(false);
    }
  }, [attempt.id]);

  function selectAnswer(optIdx) {
    const prev = answers[q.id] || { selected: null, flagged: false, eliminated: [] };
    const next = { ...prev, selected: optIdx };
    setAnswers(a => ({ ...a, [q.id]: next }));
    saveToServer(q.id, optIdx, next.flagged);
  }

  function toggleEliminate(optIdx) {
    const prev = answers[q.id] || { selected: null, flagged: false, eliminated: [] };
    const elim = prev.eliminated.includes(optIdx)
      ? prev.eliminated.filter(i => i !== optIdx)
      : [...prev.eliminated, optIdx];
    setAnswers(a => ({ ...a, [q.id]: { ...prev, eliminated: elim } }));
  }

  function toggleFlag() {
    const prev = answers[q.id] || { selected: null, flagged: false, eliminated: [] };
    const next = { ...prev, flagged: !prev.flagged };
    setAnswers(a => ({ ...a, [q.id]: next }));
    saveToServer(q.id, next.selected, next.flagged);
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await submitAttempt(attempt.id);
      onFinish(result);
    } catch (e) {
      console.error('Submit failed', e);
      setSubmitting(false);
    }
  }

  function getNavStatus(idx) {
    const q2 = questions[idx];
    const a = answers[q2?.id];
    if (!a) return 'unanswered';
    if (a.flagged) return 'flagged';
    if (a.selected !== null && a.selected !== undefined) return 'answered';
    return 'unanswered';
  }

  const answeredCount = questions.filter(q2 => {
    const a = answers[q2.id];
    return a && a.selected !== null && a.selected !== undefined;
  }).length;

  const flaggedCount = questions.filter(q2 => answers[q2.id]?.flagged).length;

  const OPTIONS = [
    { key: 'option_a', label: 'A', idx: 0 },
    { key: 'option_b', label: 'B', idx: 1 },
    { key: 'option_c', label: 'C', idx: 2 },
    { key: 'option_d', label: 'D', idx: 3 },
  ];

  // Find vignette for current question
  const vignetteText = q?.vignette_text || null;
  // Find if previous questions shared same vignette
  const sharedVignette = !vignetteText && q?.vignette_id
    ? questions.slice(0, currentIdx).reverse().find(qq => qq.vignette_id === q.vignette_id)?.vignette_text
    : null;
  const displayVignette = vignetteText || sharedVignette;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif', background: DARK, overflow: 'hidden' }}>

      {/* TOP TOOLBAR */}
      <div style={{ display: 'flex', alignItems: 'center', background: DARK, color: WHITE, height: '52px', padding: '0 12px', gap: '4px', borderBottom: '1px solid #2d4a4a', flexShrink: 0 }}>
        {/* Overview */}
        <ToolbarBtn icon="≡" label="OVERVIEW" onClick={() => {}} />
        <ToolbarBtn icon="EN" label="English" onClick={() => {}} text />
        <ToolbarBtn icon="⏎" label="FINISH" onClick={() => setShowFinishModal(true)} accent />
        <ToolbarBtn icon="◉" label="COLOUR" onClick={() => {}} />

        {/* Timer */}
        <div style={{ marginLeft: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 14px', border: '1px solid #3d6060', borderRadius: '4px' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'monospace', color: timeLeft !== null && timeLeft < 600 ? '#ff6b6b' : '#7af0d4', letterSpacing: '1px' }}>
            {timeLeft !== null ? formatTime(timeLeft) : '--:--:--'}
          </span>
          <span style={{ fontSize: '0.55rem', color: '#7a9a9a', letterSpacing: '0.5px' }}>TIME REMAINING</span>
        </div>

        <ToolbarBtn icon="📝" label="NOTES" onClick={() => {}} />
        <ToolbarBtn icon="✏" label={highlightMode ? 'UNHIGHLIGHT' : 'HIGHLIGHT'} onClick={() => setHighlightMode(h => !h)} active={highlightMode} />

        <div style={{ flex: 1 }} />

        {/* Status */}
        <div style={{ fontSize: '0.65rem', color: '#7a9a9a', textAlign: 'center', marginRight: '12px' }}>
          <div style={{ color: '#7af0d4', fontWeight: '700' }}>{answeredCount}/{questions.length} answered</div>
          {flaggedCount > 0 && <div style={{ color: '#f0c06b' }}>{flaggedCount} flagged</div>}
        </div>

        {saving && <span style={{ fontSize: '0.6rem', color: '#7a9a9a', marginRight: '8px' }}>Saving…</span>}

        {/* Prev / Next */}
        <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
          style={{ background: 'none', border: 'none', color: currentIdx === 0 ? '#3d5a5a' : WHITE, cursor: currentIdx === 0 ? 'default' : 'pointer', padding: '6px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ← PREVIOUS
        </button>
        <button onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1}
          style={{ background: 'none', border: 'none', color: currentIdx === questions.length - 1 ? '#3d5a5a' : WHITE, cursor: currentIdx === questions.length - 1 ? 'default' : 'pointer', padding: '6px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          NEXT →
        </button>
      </div>

      {/* MAIN BODY */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT SIDEBAR — Question Navigator */}
        <div ref={navRef} style={{ width: '72px', background: '#152525', overflowY: 'auto', flexShrink: 0, borderRight: '1px solid #2d4a4a' }}>
          {questions.map((_, idx) => {
            const status = getNavStatus(idx);
            const isCurrent = idx === currentIdx;
            return (
              <div key={idx} data-idx={idx} onClick={() => setCurrentIdx(idx)}
                style={{
                  padding: '10px 0',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: isCurrent ? '700' : '400',
                  color: isCurrent ? WHITE : status === 'answered' ? '#7af0d4' : status === 'flagged' ? '#f0c06b' : '#7a9a9a',
                  background: isCurrent ? TEAL : 'transparent',
                  borderLeft: isCurrent ? '3px solid #7af0d4' : '3px solid transparent',
                  transition: 'background 0.15s',
                  userSelect: 'none',
                }}>
                {idx + 1}
                {status === 'flagged' && <div style={{ fontSize: '0.45rem', color: '#f0c06b' }}>⚑</div>}
                {status === 'answered' && !isCurrent && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7af0d4', margin: '2px auto 0' }} />}
              </div>
            );
          })}
        </div>

        {/* CENTER PANEL — Vignette / Question number */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: BG_PANEL, overflow: 'hidden' }}>
          {/* Question number header */}
          <div style={{ background: DARK, color: WHITE, padding: '10px 20px', fontSize: '0.85rem', fontWeight: '700', borderBottom: '2px solid #2d4a4a', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.1rem' }}>{currentIdx + 1}</span>
            <span style={{ color: '#7a9a9a', fontSize: '0.7rem', fontWeight: '400' }}>
              {q?.domain}
            </span>
            {q?.vignette_id && (
              <span style={{ background: '#1d5a4e', color: '#7af0d4', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '9999px', fontWeight: '600' }}>
                CASE {q.vignette_id}
              </span>
            )}
          </div>

          {/* Vignette / empty center */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
            {displayVignette ? (
              <div>
                <p style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1a3a3a', marginBottom: '16px', fontStyle: 'italic' }}>
                  {vignetteText ? vignetteText.split('\n\n')[0] : `The following vignette is associated with multiple questions:`}
                </p>
                <div style={{ fontSize: '0.88rem', lineHeight: '1.7', color: '#2a3a3a', background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  {(vignetteText ? vignetteText.split('\n\n').slice(1).join('\n\n') : displayVignette.split('\n\n').slice(1).join('\n\n') || displayVignette)
                    .split('\n').map((line, i) => <p key={i} style={{ margin: '0 0 10px' }}>{line}</p>)}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8aacaa', fontSize: '0.8rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.3 }}>📋</div>
                  <div>Standalone question</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Answer */}
        <div style={{ width: '440px', flexShrink: 0, display: 'flex', flexDirection: 'column', background: WHITE, borderLeft: `2px solid ${BORDER}`, overflow: 'hidden' }}>
          {/* Answer header */}
          <div style={{ background: DARK, color: WHITE, padding: '10px 16px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span>Answer</span>
            <button onClick={toggleFlag}
              style={{ background: qAnswer.flagged ? '#c07820' : 'transparent', border: `1px solid ${qAnswer.flagged ? '#f0c06b' : '#3d6060'}`, borderRadius: '4px', color: qAnswer.flagged ? '#f0c06b' : '#7a9a9a', cursor: 'pointer', padding: '3px 8px', fontSize: '0.75rem' }}>
              {qAnswer.flagged ? '⚑ Flagged' : '⚐ Flag'}
            </button>
          </div>

          {/* Question stem */}
          <div style={{ padding: '16px', borderBottom: `1px solid ${BORDER}`, overflowY: 'auto', maxHeight: '200px', flexShrink: 0 }}>
            <p style={{ margin: 0, fontSize: '0.87rem', lineHeight: '1.65', color: '#1a2e2e', fontWeight: '500' }}>
              {q?.question_text}
            </p>
          </div>

          {/* Answer options */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {OPTIONS.map(({ key, label, idx }) => {
              const isSelected = qAnswer.selected === idx;
              const isEliminated = qAnswer.eliminated?.includes(idx);
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'stretch', marginBottom: '8px', borderRadius: '4px', overflow: 'hidden', border: isSelected ? `2px solid ${TEAL_SELECTED}` : `1px solid ${BORDER}`, opacity: isEliminated ? 0.45 : 1 }}>
                  {/* Option text */}
                  <button onClick={() => !isEliminated && selectAnswer(idx)}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      textAlign: 'left',
                      background: isSelected ? TEAL_SELECTED : WHITE,
                      color: isSelected ? WHITE : '#1a2e2e',
                      border: 'none',
                      cursor: isEliminated ? 'default' : 'pointer',
                      fontSize: '0.84rem',
                      lineHeight: '1.5',
                      textDecoration: isEliminated ? 'line-through' : 'none',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}>
                    <span style={{ fontWeight: '700', flexShrink: 0, opacity: 0.7 }}>{label}.</span>
                    <span>{q?.[key]}</span>
                  </button>
                  {/* X / Eliminate button */}
                  <button onClick={() => toggleEliminate(idx)}
                    style={{
                      width: '36px',
                      flexShrink: 0,
                      background: isSelected ? TEAL_HOVER : isEliminated ? '#fee' : '#fff8f8',
                      border: 'none',
                      borderLeft: `1px solid ${isSelected ? TEAL_HOVER : BORDER}`,
                      cursor: 'pointer',
                      color: isSelected ? 'rgba(255,255,255,0.5)' : isEliminated ? RED_X : '#e0a0a0',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title={isEliminated ? 'Restore option' : 'Eliminate option'}>
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom nav */}
          <div style={{ padding: '10px 12px', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', flexShrink: 0, background: '#f9fafa' }}>
            <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
              style={{ padding: '7px 16px', background: currentIdx === 0 ? '#eee' : DARK, color: currentIdx === 0 ? '#aaa' : WHITE, border: 'none', borderRadius: '4px', cursor: currentIdx === 0 ? 'default' : 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>
              ← Previous
            </button>
            <span style={{ fontSize: '0.72rem', color: '#7a9a9a', alignSelf: 'center' }}>{currentIdx + 1} / {questions.length}</span>
            {currentIdx < questions.length - 1 ? (
              <button onClick={() => setCurrentIdx(i => i + 1)}
                style={{ padding: '7px 16px', background: TEAL, color: WHITE, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>
                Next →
              </button>
            ) : (
              <button onClick={() => setShowFinishModal(true)}
                style={{ padding: '7px 16px', background: '#c0392b', color: WHITE, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>
                Finish Exam
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FINISH CONFIRMATION MODAL */}
      {showFinishModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: WHITE, borderRadius: '8px', padding: '32px', maxWidth: '420px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <h2 style={{ margin: '0 0 12px', color: DARK, fontSize: '1.1rem' }}>Finish Exam?</h2>
            <div style={{ fontSize: '0.85rem', color: '#4a6060', marginBottom: '20px', lineHeight: '1.6' }}>
              <div><strong>{answeredCount}</strong> of {questions.length} questions answered</div>
              <div><strong>{questions.length - answeredCount}</strong> unanswered</div>
              {flaggedCount > 0 && <div style={{ color: '#b07820' }}><strong>{flaggedCount}</strong> flagged for review</div>}
            </div>
            {questions.length - answeredCount > 0 && (
              <p style={{ fontSize: '0.78rem', color: '#c0392b', marginBottom: '16px' }}>
                ⚠ You have unanswered questions. Once submitted, you cannot return to this exam.
              </p>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowFinishModal(false)}
                style={{ padding: '8px 18px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: '600' }}>
                Continue Exam
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                style={{ padding: '8px 18px', background: '#c0392b', color: WHITE, border: 'none', borderRadius: '4px', cursor: submitting ? 'wait' : 'pointer', fontSize: '0.83rem', fontWeight: '600' }}>
                {submitting ? 'Submitting…' : 'Submit Exam'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({ icon, label, onClick, accent, text, active }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: active ? TEAL : accent ? '#c0392b' : 'transparent',
      border: 'none', color: WHITE, cursor: 'pointer', padding: '4px 10px', borderRadius: '3px',
      minWidth: '48px', gap: '2px',
    }}>
      <span style={{ fontSize: text ? '0.8rem' : '1rem', fontWeight: text ? '700' : '400' }}>{icon}</span>
      <span style={{ fontSize: '0.48rem', letterSpacing: '0.4px', opacity: 0.7 }}>{label}</span>
    </button>
  );
}
