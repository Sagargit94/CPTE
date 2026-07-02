import React, { useState, useEffect, useRef } from 'react';
import { saveAnswer, submitAttempt } from '../lib/api.js';
import { Flag, ChevronLeft, ChevronRight, Send, X, AlertTriangle, BookOpen, Clock } from 'lucide-react';

const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const C = {
  primary: '#2563eb', primaryDark: '#1d4ed8', primaryLight: '#eff6ff',
  dark: '#0f172a', bg: '#f0f4f8', card: '#fff',
  border: '#e2e8f0', borderLight: '#f8fafc',
  text: '#0f172a', textMid: '#334155', muted: '#64748b',
  success: '#16a34a', danger: '#dc2626', warning: '#d97706',
};
const OPTIONS = ['A', 'B', 'C', 'D'];
const OPTION_KEYS = ['option_a', 'option_b', 'option_c', 'option_d'];

function fmt(s) {
  if (s < 0) s = 0;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function ConfirmModal({ title, message, confirmLabel, confirmColor = C.danger, onConfirm, onCancel, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '420px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} color={C.danger} />
          </div>
          <div style={{ fontWeight: '800', fontSize: '1.1rem', color: C.text }}>{title}</div>
        </div>
        <div style={{ color: C.muted, lineHeight: 1.65, fontSize: '0.9rem', marginBottom: '1.5rem' }}>{message}</div>
        {children}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '0.7rem', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: '10px', fontWeight: '700', cursor: 'pointer', color: C.textMid, fontSize: '0.9rem', fontFamily: font }}>
            Go Back
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '0.7rem', background: confirmColor, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', fontFamily: font }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExamScreen({ attempt, onFinish, onCancel }) {
  const { attempt: att, questions } = attempt;
  const isMock = att.mode === 'mock';
  const isPractice = att.mode === 'practice';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState(new Set());
  const [feedback, setFeedback] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null); // 'submit' | 'cancel'
  const submittedRef = useRef(false);

  useEffect(() => {
    if (isMock && att.server_expires_at) {
      const rem = Math.floor((new Date(att.server_expires_at) - Date.now()) / 1000);
      setTimeLeft(Math.max(0, rem));
    }
  }, []);

  useEffect(() => {
    if (!isMock || timeLeft === null) return;
    if (timeLeft <= 0) { if (!submittedRef.current) doSubmit(); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, isMock]);

  async function doSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    setModal(null);
    try {
      const result = await submitAttempt(att.id);
      onFinish(result);
    } catch (err) {
      submittedRef.current = false;
      setSubmitting(false);
      alert('Submit error: ' + err.message);
    }
  }

  const q = questions[currentIdx];
  const selIdx = answers[q?.id];
  const isAnswered = selIdx !== undefined;
  const fb = feedback[q?.id];
  const isFlagged = flags.has(q?.id);
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flags.size;

  async function handleSelect(optIdx) {
    if (submitting || !q) return;
    if (isPractice && isAnswered) return;
    setAnswers(p => ({ ...p, [q.id]: optIdx }));
    setSaving(true);
    try {
      const res = await saveAnswer(att.id, q.id, optIdx, flags.has(q.id));
      if (isPractice) setFeedback(p => ({ ...p, [q.id]: res }));
    } catch (err) {
      if (err.message.includes('expired')) { await doSubmit(); }
      else alert('Save error: ' + err.message);
    } finally { setSaving(false); }
  }

  async function handleFlag() {
    if (!q) return;
    const nf = new Set(flags);
    const nowFlagged = !nf.has(q.id);
    if (nowFlagged) nf.add(q.id); else nf.delete(q.id);
    setFlags(nf);
    try { await saveAnswer(att.id, q.id, answers[q.id] ?? null, nowFlagged); } catch {}
  }

  function navStyle(i) {
    const qId = questions[i].id;
    const cur = i === currentIdx;
    const ans = answers[qId] !== undefined;
    const flg = flags.has(qId);
    let bg = '#f1f5f9', color = '#64748b', border = 'transparent';
    if (cur) { bg = C.primary; color = '#fff'; border = C.primary; }
    else if (flg) { bg = '#fef3c7'; color = C.warning; border = '#fcd34d'; }
    else if (ans) { bg = '#dbeafe'; color = C.primary; border = '#bfdbfe'; }
    return { width: '34px', height: '34px', borderRadius: '7px', border: `1.5px solid ${border}`, background: bg, color, fontWeight: cur ? '800' : '600', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font };
  }

  function optStyle(idx) {
    const base = { width: '100%', textAlign: 'left', padding: '0.9rem 1rem', borderRadius: '10px', border: '2px solid', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '0.55rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: '#fff', fontFamily: font, transition: 'all 0.12s' };
    if (isPractice && fb) {
      if (idx === fb.correctOptionIndex) return { ...base, borderColor: C.success, background: '#f0fdf4', color: C.success };
      if (idx === selIdx && !fb.isCorrect) return { ...base, borderColor: C.danger, background: '#fef2f2', color: C.danger };
      return { ...base, borderColor: C.border, color: '#94a3b8' };
    }
    if (idx === selIdx) return { ...base, borderColor: C.primary, background: '#eff6ff', color: C.primary };
    return { ...base, borderColor: C.border, color: C.text };
  }

  const timerColor = timeLeft !== null && timeLeft < 300 ? C.danger : timeLeft < 600 ? C.warning : C.text;

  if (submitting) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: C.bg, flexDirection: 'column', gap: '1rem', fontFamily: font }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', boxShadow: '0 8px 24px rgba(37,99,235,0.3)' }}>
        <Send size={24} color="#fff" />
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: C.text }}>Submitting your exam…</div>
      <div style={{ color: C.muted, fontSize: '0.9rem' }}>Calculating your score, please wait.</div>
    </div>
  );

  if (!q) return null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: font }}>

      {/* ── Top bar ── */}
      <div style={{ background: C.dark, padding: '0 1.5rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontWeight: '800', color: '#fff', fontSize: '0.95rem', letterSpacing: '-0.01em' }}>CPTE Prep</span>
          <span style={{ padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', background: isMock ? 'rgba(245,158,11,0.2)' : 'rgba(37,99,235,0.2)', color: isMock ? '#fcd34d' : '#93c5fd', letterSpacing: '0.05em' }}>
            {isMock ? '⏱ MOCK EXAM' : '📖 PRACTICE'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isMock && timeLeft !== null && (
            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: timerColor, fontVariantNumeric: 'tabular-nums', background: timeLeft < 300 ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '8px', border: `1px solid ${timeLeft < 300 ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
              {fmt(timeLeft)}
            </div>
          )}
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600' }}>
            {answeredCount}/{questions.length} answered
          </span>
          <button onClick={() => setModal('cancel')} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '7px', cursor: 'pointer', color: '#fca5a5', fontSize: '0.78rem', fontWeight: '700', fontFamily: font }}>
            <X size={12} /> Cancel
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', position: 'sticky', top: '56px', zIndex: 99 }}>
        <div style={{ height: '100%', width: `${(answeredCount / questions.length) * 100}%`, background: 'linear-gradient(90deg, #2563eb, #60a5fa)', transition: 'width 0.3s ease' }} />
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '1.5rem 1rem', gap: '1.25rem', alignItems: 'flex-start' }}>

        {/* Main column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Question card */}
          <div style={{ background: C.card, borderRadius: '14px', border: `1px solid ${C.border}`, padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: C.muted }}>Q{currentIdx + 1} of {questions.length}</span>
              <span style={{ padding: '0.2rem 0.6rem', background: '#eff6ff', color: C.primary, borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.03em' }}>{q.domain}</span>
              {saving && <span style={{ fontSize: '0.72rem', color: C.muted, marginLeft: 'auto' }}>Saving…</span>}
              <button onClick={handleFlag} style={{ marginLeft: saving ? '0' : 'auto', padding: '0.25rem 0.7rem', background: isFlagged ? '#fef3c7' : '#f8fafc', border: `1.5px solid ${isFlagged ? '#fcd34d' : C.border}`, borderRadius: '7px', color: isFlagged ? C.warning : C.muted, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: font }}>
                <Flag size={11} fill={isFlagged ? C.warning : 'none'} /> {isFlagged ? 'Flagged' : 'Flag'}
              </button>
            </div>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: C.text, fontWeight: '500', margin: 0 }}>{q.question_text}</p>
          </div>

          {/* Options */}
          <div style={{ background: C.card, borderRadius: '14px', border: `1px solid ${C.border}`, padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {OPTIONS.map((letter, idx) => (
              <button key={idx} onClick={() => handleSelect(idx)} disabled={isPractice && isAnswered} style={optStyle(idx)}>
                <span style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(100,116,139,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', flexShrink: 0 }}>{letter}</span>
                <span style={{ lineHeight: 1.5 }}>{q[OPTION_KEYS[idx]]}</span>
              </button>
            ))}
          </div>

          {/* Practice feedback */}
          {isPractice && fb && (
            <div style={{ background: fb.isCorrect ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${fb.isCorrect ? '#86efac' : '#fca5a5'}`, borderRadius: '12px', padding: '1.25rem 1.35rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: '800', color: fb.isCorrect ? C.success : C.danger, marginBottom: '0.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {fb.isCorrect ? '✓ Correct!' : `✗ Incorrect — Correct answer: ${OPTIONS[fb.correctOptionIndex]}`}
              </div>
              <div style={{ color: C.textMid, lineHeight: 1.65, fontSize: '0.875rem' }}>
                <span style={{ fontWeight: '700', color: C.primary }}>Rationale: </span>{fb.rationale}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: '230px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Navigator */}
          <div style={{ background: C.card, borderRadius: '14px', border: `1px solid ${C.border}`, padding: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: '700', color: C.text, marginBottom: '0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={13} color={C.muted} /> Question Map
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '0.9rem' }}>
              {questions.map((_, i) => (
                <button key={i} style={navStyle(i)} onClick={() => setCurrentIdx(i)}>{i + 1}</button>
              ))}
            </div>
            <div style={{ fontSize: '0.7rem', color: C.muted, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {[['#dbeafe', C.primary, `Answered (${answeredCount})`], ['#fef3c7', C.warning, `Flagged (${flaggedCount})`], ['#f1f5f9', '#64748b', `Unanswered (${questions.length - answeredCount})`]].map(([bg, color, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '10px', height: '10px', background: bg, borderRadius: '2px', display: 'inline-block', border: `1px solid ${color}30`, flexShrink: 0 }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button onClick={() => setModal('submit')} disabled={submitting}
            style={{ width: '100%', padding: '0.8rem', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: font }}>
            <Send size={14} /> Submit Exam
          </button>

          {/* Cancel */}
          <button onClick={() => setModal('cancel')}
            style={{ width: '100%', padding: '0.65rem', background: '#fff', border: `1.5px solid ${C.border}`, color: C.muted, borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontFamily: font }}>
            <X size={13} /> Cancel & Exit
          </button>
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <div style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', bottom: 0 }}>
        <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: '9px', fontWeight: '700', cursor: currentIdx === 0 ? 'not-allowed' : 'pointer', color: currentIdx === 0 ? C.muted : C.textMid, fontSize: '0.875rem', fontFamily: font, opacity: currentIdx === 0 ? 0.5 : 1 }}>
          <ChevronLeft size={15} /> Previous
        </button>
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          {[Math.max(0, currentIdx - 1), currentIdx, Math.min(questions.length - 1, currentIdx + 1)].filter((v, i, a) => a.indexOf(v) === i).map(i => (
            <button key={i} onClick={() => setCurrentIdx(i)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: i === currentIdx ? `2px solid ${C.primary}` : 'none', background: i === currentIdx ? C.primaryLight : 'transparent', color: i === currentIdx ? C.primary : C.muted, fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer', fontFamily: font }}>{i + 1}</button>
          ))}
        </div>
        <button onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', background: currentIdx === questions.length - 1 ? '#fff' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: currentIdx === questions.length - 1 ? `1.5px solid ${C.border}` : 'none', borderRadius: '9px', fontWeight: '700', cursor: currentIdx === questions.length - 1 ? 'not-allowed' : 'pointer', color: currentIdx === questions.length - 1 ? C.muted : '#fff', fontSize: '0.875rem', fontFamily: font, opacity: currentIdx === questions.length - 1 ? 0.5 : 1, boxShadow: currentIdx === questions.length - 1 ? 'none' : '0 2px 8px rgba(37,99,235,0.3)' }}>
          Next <ChevronRight size={15} />
        </button>
      </div>

      {/* ── Submit modal ── */}
      {modal === 'submit' && (
        <ConfirmModal
          title="Submit Exam?"
          message={<>You've answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.{questions.length - answeredCount > 0 && <> <strong style={{ color: C.danger }}>{questions.length - answeredCount} unanswered</strong> will count as incorrect.</>} This cannot be undone.</>}
          confirmLabel="Submit Now"
          confirmColor="linear-gradient(135deg, #dc2626, #b91c1c)"
          onConfirm={doSubmit}
          onCancel={() => setModal(null)}
        />
      )}

      {/* ── Cancel modal ── */}
      {modal === 'cancel' && (
        <ConfirmModal
          title="Cancel Exam?"
          message="Your progress will be lost and this attempt will be discarded. Are you sure you want to exit?"
          confirmLabel="Yes, Cancel"
          confirmColor="linear-gradient(135deg, #64748b, #475569)"
          onConfirm={() => { setModal(null); onCancel(); }}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
