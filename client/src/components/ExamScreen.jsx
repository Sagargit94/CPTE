import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAnswer, submitAttempt } from '../lib/api.js';
import { Flag, ChevronLeft, ChevronRight, Send, X, AlertTriangle, BookOpen, Clock } from 'lucide-react';

const OPTIONS = ['A', 'B', 'C', 'D'];
const OPTION_KEYS = ['option_a', 'option_b', 'option_c', 'option_d'];

function fmt(s) {
  if (s < 0) s = 0;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function ConfirmModal({ title, message, confirmLabel, confirmDanger, onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
        style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '2rem', maxWidth: '420px', width: '100%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} color="var(--danger)" />
          </div>
          <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text)', fontFamily: 'var(--font-head)' }}>{title}</div>
        </div>
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.65, fontSize: '0.9rem', marginBottom: '1.5rem' }}>{message}</div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="btn-ghost"
            style={{ flex: 1, padding: '0.7rem', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
            Go Back
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            style={{ flex: 1, padding: '0.7rem', background: confirmDanger ? 'var(--danger)' : 'var(--text-muted)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
            {confirmLabel}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ExamScreen({ attempt, onFinish, onCancel }) {
  const { attempt: att, questions } = attempt;
  const isMock = att.mode === 'mock';
  const isPractice = att.mode === 'practice';

  // Pre-populate saved answers when resuming an in-progress attempt
  const initialAnswers = {};
  const initialFlags = new Set();
  (attempt.answers || []).forEach(a => {
    if (a.selected_option_index != null) initialAnswers[a.question_id] = a.selected_option_index;
    if (a.is_flagged) initialFlags.add(a.question_id);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [flags, setFlags] = useState(initialFlags);
  const [feedback, setFeedback] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
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

  function navBtnStyle(i) {
    const qId = questions[i].id;
    const cur = i === currentIdx;
    const ans = answers[qId] !== undefined;
    const flg = flags.has(qId);
    let bg = 'var(--bg-subtle)', color = 'var(--text-muted)', border = 'transparent';
    if (cur) { bg = 'var(--primary)'; color = '#fff'; border = 'var(--primary)'; }
    else if (flg) { bg = 'var(--accent-light)'; color = 'var(--accent)'; border = 'var(--accent)'; }
    else if (ans) { bg = 'var(--primary-light)'; color = 'var(--primary)'; border = 'var(--primary-mid)'; }
    return { width: '34px', height: '34px', borderRadius: '7px', border: `1.5px solid ${border}`, background: bg, color, fontWeight: cur ? '800' : '600', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' };
  }

  function optStyle(idx) {
    const base = { width: '100%', textAlign: 'left', padding: '0.9rem 1rem', borderRadius: '10px', border: '2px solid', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '0.55rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'var(--bg-card)', fontFamily: 'var(--font-body)', transition: 'all 0.12s' };
    if (isPractice && fb) {
      if (idx === fb.correctOptionIndex) return { ...base, borderColor: 'var(--success)', background: 'var(--success-light)', color: 'var(--success)' };
      if (idx === selIdx && !fb.isCorrect) return { ...base, borderColor: 'var(--danger)', background: 'var(--danger-light)', color: 'var(--danger)' };
      return { ...base, borderColor: 'var(--border)', color: 'var(--text-subtle)' };
    }
    if (idx === selIdx) return { ...base, borderColor: 'var(--primary)', background: 'var(--primary-light)', color: 'var(--primary)' };
    return { ...base, borderColor: 'var(--border)', color: 'var(--text)' };
  }

  const timerUrgent = timeLeft !== null && timeLeft < 300;
  const timerWarn   = timeLeft !== null && timeLeft < 600 && !timerUrgent;

  if (submitting) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', flexDirection: 'column', gap: '1rem', fontFamily: 'var(--font-body)' }}>
      <motion.div animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
        style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', boxShadow: '0 8px 24px rgba(13,92,115,0.3)' }}>
        <Send size={24} color="#fff" />
      </motion.div>
      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', fontFamily: 'var(--font-head)' }}>Submitting your exam…</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Calculating your score, please wait.</div>
    </div>
  );

  if (!q) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' }}>

      {/* ── Top bar ── */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontWeight: '800', color: 'var(--text)', fontSize: '0.95rem', letterSpacing: '-0.01em', fontFamily: 'var(--font-head)' }}>CPTE Prep</span>
          <span style={{ padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', background: isMock ? 'var(--accent-light)' : 'var(--primary-light)', color: isMock ? 'var(--accent)' : 'var(--primary)', letterSpacing: '0.05em' }}>
            {isMock ? '⏱ MOCK EXAM' : '📖 PRACTICE'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isMock && timeLeft !== null && (
            <motion.div animate={timerUrgent ? { scale: [1, 1.04, 1] } : {}} transition={{ duration: 0.8, repeat: Infinity }}
              style={{ fontWeight: '800', fontSize: '1.1rem', color: timerUrgent ? 'var(--danger)' : timerWarn ? 'var(--warning)' : 'var(--text)', fontVariantNumeric: 'tabular-nums', background: timerUrgent ? 'var(--danger-light)' : 'var(--bg-subtle)', padding: '0.25rem 0.75rem', borderRadius: '8px', border: `1px solid ${timerUrgent ? 'var(--danger)' : 'var(--border)'}` }}>
              {fmt(timeLeft)}
            </motion.div>
          )}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {answeredCount}/{questions.length} answered
          </span>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setModal('cancel')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', borderRadius: '7px', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.78rem', fontWeight: '700', fontFamily: 'var(--font-body)' }}>
            <X size={12} /> Cancel
          </motion.button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ height: '3px', background: 'var(--bg-subtle)' }}>
        <motion.div
          animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          style={{ height: '100%', background: 'var(--primary)', borderRadius: '0 2px 2px 0' }} />
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '1.5rem 1rem', gap: '1.25rem', alignItems: 'flex-start' }}>

        {/* Main column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div key={currentIdx} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Q{currentIdx + 1} of {questions.length}</span>
                  <span style={{ padding: '0.2rem 0.6rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.03em' }}>{q.domain}</span>
                  {saving && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Saving…</span>}
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleFlag}
                    style={{ marginLeft: saving ? '0' : 'auto', padding: '0.25rem 0.7rem', background: isFlagged ? 'var(--accent-light)' : 'var(--bg-subtle)', border: `1.5px solid ${isFlagged ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '7px', color: isFlagged ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)' }}>
                    <Flag size={11} fill={isFlagged ? 'var(--accent)' : 'none'} /> {isFlagged ? 'Flagged' : 'Flag'}
                  </motion.button>
                </div>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text)', fontWeight: '500', margin: 0 }}>{q.question_text}</p>
              </div>

              {/* Options */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                {OPTIONS.map((letter, idx) => (
                  <motion.button key={idx} whileHover={!(isPractice && isAnswered) ? { scale: 1.01 } : {}}
                    onClick={() => handleSelect(idx)}
                    disabled={isPractice && isAnswered}
                    style={optStyle(idx)}>
                    <span style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', flexShrink: 0 }}>{letter}</span>
                    <span style={{ lineHeight: 1.5 }}>{q[OPTION_KEYS[idx]]}</span>
                  </motion.button>
                ))}
              </div>

              {/* Practice feedback */}
              {isPractice && fb && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: fb.isCorrect ? 'var(--success-light)' : 'var(--danger-light)', border: `1.5px solid ${fb.isCorrect ? 'var(--success)' : 'var(--danger)'}`, borderRadius: '12px', padding: '1.25rem 1.35rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '800', color: fb.isCorrect ? 'var(--success)' : 'var(--danger)', marginBottom: '0.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {fb.isCorrect ? '✓ Correct!' : `✗ Incorrect — Correct answer: ${OPTIONS[fb.correctOptionIndex]}`}
                  </div>
                  <div style={{ color: 'var(--text-mid)', lineHeight: 1.65, fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Rationale: </span>{fb.rationale}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div style={{ width: '230px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.1rem' }}>
            <div style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={13} color="var(--text-muted)" /> Question Map
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '0.9rem' }}>
              {questions.map((_, i) => (
                <button key={i} style={navBtnStyle(i)} onClick={() => setCurrentIdx(i)}>{i + 1}</button>
              ))}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {[
                ['var(--primary-light)', 'var(--primary)', `Answered (${answeredCount})`],
                ['var(--accent-light)', 'var(--accent)', `Flagged (${flaggedCount})`],
                ['var(--bg-subtle)', 'var(--text-subtle)', `Unanswered (${questions.length - answeredCount})`],
              ].map(([bg, color, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '10px', height: '10px', background: bg, borderRadius: '2px', display: 'inline-block', border: `1px solid ${color}`, flexShrink: 0 }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setModal('submit')} disabled={submitting}
            style={{ width: '100%', padding: '0.8rem', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(225,29,72,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)' }}>
            <Send size={14} /> Submit Exam
          </motion.button>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setModal('cancel')}
            className="btn-ghost"
            style={{ width: '100%', padding: '0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <X size={13} /> Cancel & Exit
          </motion.button>
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', bottom: 0 }}>
        <motion.button whileHover={currentIdx > 0 ? { scale: 1.03 } : {}} whileTap={currentIdx > 0 ? { scale: 0.97 } : {}}
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
          className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', fontSize: '0.875rem', opacity: currentIdx === 0 ? 0.4 : 1, cursor: currentIdx === 0 ? 'not-allowed' : 'pointer' }}>
          <ChevronLeft size={15} /> Previous
        </motion.button>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{currentIdx + 1} / {questions.length}</span>
        <motion.button whileHover={currentIdx < questions.length - 1 ? { scale: 1.03 } : {}} whileTap={currentIdx < questions.length - 1 ? { scale: 0.97 } : {}}
          onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', fontSize: '0.875rem', opacity: currentIdx === questions.length - 1 ? 0.4 : 1, cursor: currentIdx === questions.length - 1 ? 'not-allowed' : 'pointer' }}>
          Next <ChevronRight size={15} />
        </motion.button>
      </div>

      <AnimatePresence>
        {modal === 'submit' && (
          <ConfirmModal
            title="Submit Exam?"
            message={<>You've answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.{questions.length - answeredCount > 0 && <> <strong style={{ color: 'var(--danger)' }}>{questions.length - answeredCount} unanswered</strong> will count as incorrect.</>} This cannot be undone.</>}
            confirmLabel="Submit Now"
            confirmDanger
            onConfirm={doSubmit}
            onCancel={() => setModal(null)}
          />
        )}
        {modal === 'cancel' && (
          <ConfirmModal
            title="Cancel Exam?"
            message="Your progress will be lost and this attempt will be discarded. Are you sure you want to exit?"
            confirmLabel="Yes, Cancel"
            confirmDanger={false}
            onConfirm={() => { setModal(null); onCancel(); }}
            onCancel={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
