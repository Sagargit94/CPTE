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

const HIGHLIGHT_COLORS = [
  { label: 'Yellow',  bg: '#fff176', text: '#333' },
  { label: 'Green',   bg: '#b9f6ca', text: '#1a3a1a' },
  { label: 'Cyan',    bg: '#b3e5fc', text: '#0d2a3a' },
  { label: 'Pink',    bg: '#f8bbd0', text: '#3a0d1a' },
  { label: 'Orange',  bg: '#ffe0b2', text: '#3a1a00' },
];

const PEN_COLORS = [
  '#1a2e2e', '#c0392b', '#1d6b5e', '#1565c0', '#6a1b9a', '#e65100',
];

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// Apply highlight marks to plain text, returns array of {text, highlight} segments
// Handles overlaps by clipping each highlight to the uncovered region
function applyHighlights(text, highlights) {
  if (!highlights || highlights.length === 0) return [{ text, highlight: null }];
  // Build a per-character color map (last writer wins for overlaps)
  const colors = new Array(text.length).fill(null);
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  for (const h of sorted) {
    const s = Math.max(0, h.start);
    const e = Math.min(text.length, h.end);
    for (let i = s; i < e; i++) colors[i] = h.color;
  }
  // Collapse into segments
  const segments = [];
  let i = 0;
  while (i < text.length) {
    const color = colors[i];
    let j = i + 1;
    while (j < text.length && colors[j] === color) j++;
    segments.push({ text: text.slice(i, j), highlight: color });
    i = j;
  }
  return segments;
}

function HighlightableText({ text, highlights, onHighlight, highlightColor, highlightMode }) {
  const ref = useRef(null);

  function handleMouseUp() {
    if (!highlightMode) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !ref.current) return;
    const range = sel.getRangeAt(0);
    const pre = document.createRange();
    pre.setStart(ref.current, 0);
    pre.setEnd(range.startContainer, range.startOffset);
    const start = pre.toString().length;
    const selected = sel.toString();
    if (selected.trim().length === 0 || start === start + selected.length) return;
    // Ignore double-click word selections that are already highlighted (same range)
    onHighlight({ start, end: start + selected.length, color: highlightColor });
    sel.removeAllRanges();
  }

  const segments = applyHighlights(text, highlights);

  return (
    <span ref={ref} onMouseUp={handleMouseUp}
      style={{ cursor: highlightMode ? 'text' : 'default', userSelect: highlightMode ? 'text' : 'auto' }}>
      {segments.map((seg, i) =>
        seg.highlight
          ? <mark key={i} style={{ background: seg.highlight.bg, color: seg.highlight.text, borderRadius: '2px', padding: '0 1px' }}>{seg.text}</mark>
          : <span key={i}>{seg.text}</span>
      )}
    </span>
  );
}

export default function RealExamScreen({ attempt, questions, answers: initialAnswers, onFinish, onCancel }) {
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
  const [showExitModal, setShowExitModal] = useState(false);

  // Notes: { [question_id]: string }
  const [notes, setNotes] = useState({});
  const [showNotes, setShowNotes] = useState(false);

  // Highlight state
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0]);
  // highlights: { [question_id]: [{start, end, color}] }
  const [highlights, setHighlights] = useState({});

  // Color picker panel
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [penColor, setPenColor] = useState(PEN_COLORS[0]);
  // activeColorTab: 'highlight' | 'pen'
  const [activeColorTab, setActiveColorTab] = useState('highlight');

  const navRef = useRef(null);
  const colorPanelRef = useRef(null);

  const q = questions[currentIdx];
  const qAnswer = answers[q?.id] || { selected: null, flagged: false, eliminated: [] };
  const qNote = notes[q?.id] || '';
  const qHighlights = highlights[q?.id] || [];

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

  // Close color panel on outside click
  useEffect(() => {
    if (!showColorPanel) return;
    function handle(e) {
      if (colorPanelRef.current && !colorPanelRef.current.contains(e.target)) {
        setShowColorPanel(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showColorPanel]);

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

  function addHighlight(range) {
    setHighlights(h => ({
      ...h,
      [q.id]: [...(h[q.id] || []), range],
    }));
  }

  function clearHighlights() {
    setHighlights(h => ({ ...h, [q.id]: [] }));
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
  const hasNote = !!qNote.trim();

  const OPTIONS = [
    { key: 'option_a', label: 'A', idx: 0 },
    { key: 'option_b', label: 'B', idx: 1 },
    { key: 'option_c', label: 'C', idx: 2 },
    { key: 'option_d', label: 'D', idx: 3 },
  ];

  const vignetteText = q?.vignette_text || null;
  const sharedVignette = !vignetteText && q?.vignette_id
    ? questions.slice(0, currentIdx).reverse().find(qq => qq.vignette_id === q.vignette_id)?.vignette_text
    : null;
  const displayVignette = vignetteText || sharedVignette;

  const vignetteBody = displayVignette
    ? (vignetteText
        ? vignetteText.split('\n\n').slice(1).join('\n\n')
        : displayVignette.split('\n\n').slice(1).join('\n\n') || displayVignette)
    : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif', background: DARK, overflow: 'hidden' }}>

      {/* TOP TOOLBAR */}
      <div style={{ display: 'flex', alignItems: 'center', background: DARK, color: WHITE, height: '52px', padding: '0 12px', gap: '4px', borderBottom: '1px solid #2d4a4a', flexShrink: 0 }}>
        <ToolbarBtn icon="≡" label="OVERVIEW" onClick={() => {}} />
        <ToolbarBtn icon="EN" label="English" onClick={() => {}} text />
        <ToolbarBtn icon="⏎" label="FINISH" onClick={() => setShowFinishModal(true)} accent />
        <ToolbarBtn icon="✕" label="EXIT" onClick={() => setShowExitModal(true)} />

        {/* COLOUR button with dropdown */}
        <div style={{ position: 'relative' }} ref={colorPanelRef}>
          <ToolbarBtn
            icon={<span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', background: activeColorTab === 'highlight' ? highlightColor.bg : penColor, border: '2px solid rgba(255,255,255,0.4)' }} />}
            label="COLOUR"
            onClick={() => setShowColorPanel(p => !p)}
            active={showColorPanel}
          />
          {showColorPanel && (
            <div style={{ position: 'absolute', top: '54px', left: 0, background: '#1e3a3a', border: '1px solid #3d6060', borderRadius: '6px', padding: '12px', zIndex: 200, minWidth: '220px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
              {/* Tabs */}
              <div style={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid #3d6060', paddingBottom: '8px', gap: '4px' }}>
                {['highlight', 'pen'].map(tab => (
                  <button key={tab} onClick={() => setActiveColorTab(tab)}
                    style={{ flex: 1, padding: '4px', background: activeColorTab === tab ? TEAL : 'transparent', color: WHITE, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {tab === 'highlight' ? '🖍 Highlight' : '✒ Text/Pen'}
                  </button>
                ))}
              </div>

              {activeColorTab === 'highlight' ? (
                <div>
                  <div style={{ fontSize: '0.62rem', color: '#7a9a9a', marginBottom: '6px', letterSpacing: '0.5px' }}>HIGHLIGHT COLOR</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {HIGHLIGHT_COLORS.map(c => (
                      <button key={c.label} title={c.label} onClick={() => { setHighlightColor(c); setHighlightMode(true); setShowColorPanel(false); }}
                        style={{ width: '28px', height: '28px', borderRadius: '4px', background: c.bg, border: highlightColor.label === c.label ? '2px solid #7af0d4' : '2px solid transparent', cursor: 'pointer' }} />
                    ))}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.62rem', color: '#7a9a9a' }}>
                    Select color then drag over text in the vignette or question to highlight it.
                  </div>
                  {qHighlights.length > 0 && (
                    <button onClick={() => { clearHighlights(); setShowColorPanel(false); }}
                      style={{ marginTop: '8px', width: '100%', padding: '5px', background: 'transparent', border: '1px solid #c0392b', color: '#ff8a80', borderRadius: '3px', cursor: 'pointer', fontSize: '0.68rem' }}>
                      Clear highlights on this question
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '0.62rem', color: '#7a9a9a', marginBottom: '6px', letterSpacing: '0.5px' }}>PEN / FONT COLOR</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {PEN_COLORS.map(c => (
                      <button key={c} title={c} onClick={() => { setPenColor(c); setShowColorPanel(false); }}
                        style={{ width: '28px', height: '28px', borderRadius: '4px', background: c, border: penColor === c ? '2px solid #7af0d4' : '2px solid rgba(255,255,255,0.15)', cursor: 'pointer' }} />
                    ))}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.62rem', color: '#7a9a9a' }}>
                    Selected color applies to notes text. Type in the Notes panel.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timer */}
        <div style={{ marginLeft: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 14px', border: '1px solid #3d6060', borderRadius: '4px' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'monospace', color: timeLeft !== null && timeLeft < 600 ? '#ff6b6b' : '#7af0d4', letterSpacing: '1px' }}>
            {timeLeft !== null ? formatTime(timeLeft) : '--:--:--'}
          </span>
          <span style={{ fontSize: '0.55rem', color: '#7a9a9a', letterSpacing: '0.5px' }}>TIME REMAINING</span>
        </div>

        {/* NOTES button */}
        <ToolbarBtn
          icon={<span style={{ position: 'relative', display: 'inline-block' }}>📝{hasNote && <span style={{ position: 'absolute', top: '-3px', right: '-4px', width: '6px', height: '6px', borderRadius: '50%', background: '#f0c06b' }} />}</span>}
          label="NOTES"
          onClick={() => setShowNotes(n => !n)}
          active={showNotes}
        />

        {/* HIGHLIGHT button */}
        <ToolbarBtn
          icon="✏"
          label={highlightMode ? 'STOP' : 'HIGHLIGHT'}
          onClick={() => setHighlightMode(h => !h)}
          active={highlightMode}
        />

        <div style={{ flex: 1 }} />

        <div style={{ fontSize: '0.65rem', color: '#7a9a9a', textAlign: 'center', marginRight: '12px' }}>
          <div style={{ color: '#7af0d4', fontWeight: '700' }}>{answeredCount}/{questions.length} answered</div>
          {flaggedCount > 0 && <div style={{ color: '#f0c06b' }}>{flaggedCount} flagged</div>}
        </div>

        {saving && <span style={{ fontSize: '0.6rem', color: '#7a9a9a', marginRight: '8px' }}>Saving…</span>}

        <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
          style={{ background: 'none', border: 'none', color: currentIdx === 0 ? '#3d5a5a' : WHITE, cursor: currentIdx === 0 ? 'default' : 'pointer', padding: '6px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ← PREVIOUS
        </button>
        <button onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1}
          style={{ background: 'none', border: 'none', color: currentIdx === questions.length - 1 ? '#3d5a5a' : WHITE, cursor: currentIdx === questions.length - 1 ? 'default' : 'pointer', padding: '6px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          NEXT →
        </button>
      </div>

      {/* Highlight mode banner */}
      {highlightMode && (
        <div style={{ background: highlightColor.bg, color: highlightColor.text, padding: '5px 16px', fontSize: '0.72rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span>✏ Highlight mode ON — select text in the vignette or question stem to highlight it</span>
          <span style={{ marginLeft: 'auto', background: 'rgba(0,0,0,0.12)', padding: '2px 10px', borderRadius: '99px', cursor: 'pointer' }} onClick={() => setHighlightMode(false)}>Done</span>
        </div>
      )}

      {/* MAIN BODY */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT SIDEBAR — Question Navigator */}
        <div ref={navRef} style={{ width: '72px', background: '#152525', overflowY: 'auto', flexShrink: 0, borderRight: '1px solid #2d4a4a' }}>
          {questions.map((_, idx) => {
            const status = getNavStatus(idx);
            const isCurrent = idx === currentIdx;
            const hasNoteForQ = !!(notes[questions[idx]?.id]?.trim());
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
                {hasNoteForQ && <div style={{ fontSize: '0.45rem', color: '#f0c06b' }}>📝</div>}
              </div>
            );
          })}
        </div>

        {/* CENTER PANEL — Vignette */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: BG_PANEL, overflow: 'hidden' }}>
          <div style={{ background: DARK, color: WHITE, padding: '10px 20px', fontSize: '0.85rem', fontWeight: '700', borderBottom: '2px solid #2d4a4a', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.1rem' }}>{currentIdx + 1}</span>
            <span style={{ color: '#7a9a9a', fontSize: '0.7rem', fontWeight: '400' }}>{q?.domain}</span>
            {q?.vignette_id && (
              <span style={{ background: '#1d5a4e', color: '#7af0d4', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '9999px', fontWeight: '600' }}>
                CASE {q.vignette_id}
              </span>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
            {displayVignette ? (
              <div>
                <p style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1a3a3a', marginBottom: '16px', fontStyle: 'italic' }}>
                  {vignetteText ? vignetteText.split('\n\n')[0] : `The following vignette is associated with multiple questions:`}
                </p>
                <div style={{ fontSize: '0.88rem', lineHeight: '1.7', color: '#2a3a3a', background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  {vignetteBody.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: '0 0 10px' }}>
                      <HighlightableText
                        text={line}
                        highlights={qHighlights.filter(h => h.target === `vignette-${i}`).map(h => ({ ...h }))}
                        onHighlight={range => addHighlight({ ...range, target: `vignette-${i}` })}
                        highlightColor={highlightColor}
                        highlightMode={highlightMode}
                      />
                    </p>
                  ))}
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
          <div style={{ background: DARK, color: WHITE, padding: '10px 16px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span>Answer</span>
            <button onClick={toggleFlag}
              style={{ background: qAnswer.flagged ? '#c07820' : 'transparent', border: `1px solid ${qAnswer.flagged ? '#f0c06b' : '#3d6060'}`, borderRadius: '4px', color: qAnswer.flagged ? '#f0c06b' : '#7a9a9a', cursor: 'pointer', padding: '3px 8px', fontSize: '0.75rem' }}>
              {qAnswer.flagged ? '⚑ Flagged' : '⚐ Flag'}
            </button>
          </div>

          {/* Question stem */}
          <div style={{ padding: '16px', borderBottom: `1px solid ${BORDER}`, overflowY: 'auto', maxHeight: '220px', flexShrink: 0 }}>
            <p style={{ margin: 0, fontSize: '0.87rem', lineHeight: '1.65', color: '#1a2e2e', fontWeight: '500' }}>
              <HighlightableText
                text={q?.question_text || ''}
                highlights={qHighlights.filter(h => h.target === 'stem')}
                onHighlight={range => addHighlight({ ...range, target: 'stem' })}
                highlightColor={highlightColor}
                highlightMode={highlightMode}
              />
            </p>
          </div>

          {/* Answer options */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {OPTIONS.map(({ key, label, idx }) => {
              const isSelected = qAnswer.selected === idx;
              const isEliminated = qAnswer.eliminated?.includes(idx);
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'stretch', marginBottom: '8px', borderRadius: '4px', overflow: 'hidden', border: isSelected ? `2px solid ${TEAL_SELECTED}` : `1px solid ${BORDER}`, opacity: isEliminated ? 0.45 : 1 }}>
                  <button onClick={() => !isEliminated && selectAnswer(idx)}
                    style={{ flex: 1, padding: '12px 14px', textAlign: 'left', background: isSelected ? TEAL_SELECTED : WHITE, color: isSelected ? WHITE : '#1a2e2e', border: 'none', cursor: isEliminated ? 'default' : 'pointer', fontSize: '0.84rem', lineHeight: '1.5', textDecoration: isEliminated ? 'line-through' : 'none', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontWeight: '700', flexShrink: 0, opacity: 0.7 }}>{label}.</span>
                    <span>{q?.[key]}</span>
                  </button>
                  <button onClick={() => toggleEliminate(idx)}
                    style={{ width: '36px', flexShrink: 0, background: isSelected ? TEAL_HOVER : isEliminated ? '#fee' : '#fff8f8', border: 'none', borderLeft: `1px solid ${isSelected ? TEAL_HOVER : BORDER}`, cursor: 'pointer', color: isSelected ? 'rgba(255,255,255,0.5)' : isEliminated ? RED_X : '#e0a0a0', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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

        {/* NOTES PANEL — slides in from right */}
        {showNotes && (
          <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#fffde7', borderLeft: '2px solid #f9a825', overflow: 'hidden' }}>
            <div style={{ background: '#f9a825', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <span style={{ fontWeight: '700', fontSize: '0.82rem', color: '#3a2a00' }}>📝 Notes — Q{currentIdx + 1}</span>
              <button onClick={() => setShowNotes(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#3a2a00', padding: '0 4px' }}>✕</button>
            </div>
            <textarea
              value={qNote}
              onChange={e => setNotes(n => ({ ...n, [q.id]: e.target.value }))}
              placeholder="Type your notes for this question here…"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                resize: 'none',
                padding: '14px',
                fontSize: '0.84rem',
                lineHeight: '1.6',
                background: '#fffde7',
                color: penColor,
                fontFamily: 'Arial, sans-serif',
              }}
            />
            <div style={{ padding: '8px 12px', borderTop: '1px solid #f9a825', display: 'flex', alignItems: 'center', gap: '6px', background: '#fff8e1', flexShrink: 0 }}>
              <span style={{ fontSize: '0.62rem', color: '#8a6a00' }}>Text color:</span>
              {PEN_COLORS.map(c => (
                <button key={c} onClick={() => setPenColor(c)}
                  style={{ width: '18px', height: '18px', borderRadius: '50%', background: c, border: penColor === c ? '2px solid #f9a825' : '2px solid transparent', cursor: 'pointer', flexShrink: 0 }} />
              ))}
              {qNote.trim() && (
                <button onClick={() => setNotes(n => ({ ...n, [q.id]: '' }))}
                  style={{ marginLeft: 'auto', fontSize: '0.62rem', color: '#c0392b', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* EXIT MODAL */}
      {showExitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: WHITE, borderRadius: '8px', padding: '32px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <h2 style={{ margin: '0 0 12px', color: DARK, fontSize: '1.1rem' }}>Exit Exam?</h2>
            <p style={{ fontSize: '0.85rem', color: '#4a6060', marginBottom: '20px', lineHeight: '1.6' }}>
              Your progress is saved. You can resume this exam from the home screen.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowExitModal(false)}
                style={{ padding: '8px 18px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: '600' }}>
                Stay in Exam
              </button>
              <button onClick={onCancel}
                style={{ padding: '8px 18px', background: DARK, color: WHITE, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: '600' }}>
                Exit to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINISH MODAL */}
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
