import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient.js';
import { getTemplates, getHistory, getLimits } from '../lib/api.js';
import { useTheme } from '../lib/theme.jsx';
import {
  Stethoscope, BookOpen, Clock, BarChart2, LogOut,
  CheckCircle, ChevronRight, Trophy, Zap, Target,
  TrendingUp, Activity, Sun, Moon, Play, Lock, Unlock
} from 'lucide-react';

const STAT_ITEMS = [
  { icon: Target,   value: '100',     label: 'Questions'  },
  { icon: BookOpen, value: '6',       label: 'Domains'    },
  { icon: Clock,    value: '150 min', label: 'Mock Timer' },
  { icon: Trophy,   value: 'CPTE',    label: 'Aligned'    },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
};

function StatusBadge({ score, status }) {
  if (status === 'in_progress') return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.2rem 0.7rem', borderRadius:'9999px', fontSize:'0.72rem', fontWeight:'700', background:'var(--primary-light)', color:'var(--primary)', border:'1px solid var(--primary-mid)' }}>
      <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'var(--primary)', display:'inline-block' }} /> IN PROGRESS
    </span>
  );
  if (score == null) return null;
  const pass = parseFloat(score) >= 70;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.2rem 0.7rem', borderRadius:'9999px', fontSize:'0.72rem', fontWeight:'700', background: pass ? 'var(--success-light)' : 'var(--danger-light)', color: pass ? 'var(--success)' : 'var(--danger)' }}>
      {pass ? '✓' : '✗'} {parseFloat(score).toFixed(1)}%
    </span>
  );
}

function LimitBar({ label, used, limit, color }) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const remaining = Math.max(0, limit - used);
  return (
    <div style={{ flex: 1, minWidth: '120px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.72rem', fontWeight:'700', color:'var(--text-muted)', marginBottom:'0.3rem' }}>
        <span>{label}</span>
        <span style={{ color: remaining === 0 ? 'var(--danger)' : 'var(--text-muted)' }}>{remaining} left</span>
      </div>
      <div style={{ height:'5px', background:'var(--bg-subtle)', borderRadius:'9999px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background: remaining === 0 ? 'var(--danger)' : color, borderRadius:'9999px', transition:'width 0.6s ease' }} />
      </div>
      <div style={{ fontSize:'0.68rem', color:'var(--text-subtle)', marginTop:'0.2rem' }}>{used}/{limit} used</div>
    </div>
  );
}

export default function HomeScreen({ user, onStartExam, onResumeExam, onDashboard }) {
  const { dark, toggle } = useTheme();
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [limits, setLimits] = useState(null);
  const [starting, setStarting] = useState(null);
  const [resuming, setResuming] = useState(null);

  useEffect(() => {
    getHistory()
      .then(d => setRecentAttempts((d || []).slice(0, 5)))
      .catch(() => setRecentAttempts([]))
      .finally(() => setHistoryLoading(false));
    getLimits()
      .then(d => setLimits(d))
      .catch(() => {});
  }, []);

  async function handleMode(mode) {
    setStarting(mode);
    try {
      const templates = await getTemplates();
      if (!templates.length) throw new Error('No exam templates found');
      // Real exam uses template 2; practice/mock use template 1
      const template = mode === 'real'
        ? (templates.find(t => t.name.includes('Real')) || templates[1] || templates[0])
        : templates[0];
      await onStartExam(template.id, mode);
    } catch (err) {
      if (err.message === 'Attempt limit reached') {
        // limits state will already reflect this — nothing extra needed
      } else {
        alert('Error: ' + err.message);
      }
    } finally {
      setStarting(null);
    }
  }

  async function handleResume(attemptId) {
    setResuming(attemptId);
    try {
      await onResumeExam(attemptId);
    } catch (err) {
      alert('Could not resume: ' + err.message);
    } finally {
      setResuming(null);
    }
  }

  function fmt(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const userName = user.email?.split('@')[0] || 'there';

  const practiceRemaining = limits ? limits.remaining.practice : null;
  const mockRemaining     = limits ? limits.remaining.mock     : null;
  const isActivated       = limits?.is_activated ?? false;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      {/* ── Navbar ── */}
      <nav style={{ background: dark ? 'var(--bg-card)' : '#0d1117', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.75rem', position: 'sticky', top: 0, zIndex: 200, borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stethoscope size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1rem', color: dark ? 'var(--text)' : '#fff', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)' }}>CPTE Prep</span>
          <span style={{ padding: '0.1rem 0.45rem', background: 'rgba(13,92,115,0.3)', border: '1px solid rgba(13,92,115,0.5)', borderRadius: '4px', fontSize: '0.6rem', color: dark ? 'var(--primary)' : 'var(--primary-mid)', fontWeight: '800', letterSpacing: '0.08em' }}>CAPR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={toggle}
            style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(128,128,128,0.1)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: dark ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)' }}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onDashboard}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', background: 'rgba(128,128,128,0.08)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: dark ? 'var(--text-muted)' : 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: '600', fontFamily: 'var(--font-body)' }}>
            <BarChart2 size={13} /> Analytics
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => supabase.auth.signOut()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: dark ? 'var(--text-subtle)' : 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '600', fontFamily: 'var(--font-body)' }}>
            <LogOut size={12} /> Sign Out
          </motion.button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ background: dark ? 'linear-gradient(160deg, var(--bg-card) 0%, var(--bg-subtle) 50%, var(--bg-card) 100%)' : 'linear-gradient(160deg, #0d1117 0%, #162035 35%, #0d3347 65%, #0d1117 100%)', padding: '3.5rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(13,92,115,0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(200,146,26,0.06) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(13,92,115,0.2)', border: '1px solid rgba(13,92,115,0.4)', borderRadius: '9999px', padding: '0.3rem 0.9rem', fontSize: '0.7rem', color: dark ? 'var(--primary)' : 'var(--primary-mid)', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            <Zap size={10} /> CPTE FOR CAPR · CANADA
          </motion.div>

          {/* Heading — no gradient clip; avoids blank-box bug on theme toggle */}
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
            style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1rem', fontFamily: 'var(--font-head)', color: dark ? 'var(--text)' : '#ffffff' }}>
            Hello, {userName}!<br />Ready to ace the CPTE?
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.16 }}
            style={{ color: dark ? 'var(--text-muted)' : 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto 2.5rem' }}>
            Practice questions aligned with the Canadian Physiotherapy Competency Examination blueprint by CAPR.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {STAT_ITEMS.map(({ icon: Icon, value, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 1.4rem', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', backdropFilter: 'blur(12px)', minWidth: '90px', gap: '0.3rem' }}>
                <Icon size={14} color="var(--primary)" strokeWidth={2} />
                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: dark ? 'var(--text)' : '#fff', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: 'var(--font-head)' }}>{value}</span>
                <span style={{ fontSize: '0.65rem', color: dark ? 'var(--text-muted)' : 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2.25rem 1.25rem' }}>

        {/* ── Subscription status ── */}
        {limits && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: '1rem 1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isActivated
                ? <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Unlock size={14} color="var(--success)" /></div>
                : <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={14} color="var(--warning)" /></div>
              }
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text)' }}>{isActivated ? 'Full Access' : 'Free Tier'}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{isActivated ? '20 practice + 10 mock attempts' : '2 practice + 1 mock — contact admin to upgrade'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <LimitBar label="Practice" used={limits.used.practice} limit={limits.limits.practice} color="var(--primary)" />
              <LimitBar label="Mock Exam" used={limits.used.mock} limit={limits.limits.mock} color="var(--accent)" />
            </div>
          </motion.div>
        )}

        {/* ── Section heading ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
          <span style={{ width: '3px', height: '18px', background: 'var(--primary)', borderRadius: '2px', display: 'block' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.01em', fontFamily: 'var(--font-head)' }}>Choose Your Study Mode</h2>
        </div>

        {/* ── Mode Cards ── */}
        <motion.div variants={{ show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.1rem', marginBottom: '2rem' }}>

          {/* Practice */}
          {(() => {
            const blocked = practiceRemaining === 0;
            return (
              <motion.div variants={cardVariants} className="card"
                style={{ borderColor: blocked ? 'var(--border)' : 'var(--primary)', borderWidth: '1.5px', padding: '1.6rem', position: 'relative', overflow: 'hidden', boxShadow: blocked ? 'none' : '0 4px 24px rgba(13,92,115,0.12)', opacity: blocked ? 0.75 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={20} color="var(--primary)" strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.05rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)' }}>Practice Mode</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem', fontWeight: '500' }}>Learn as you go · No time limit</div>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: '1.4rem' }}>
                  {['Instant answer feedback per question', 'Full rationale explanations', 'Randomized question order', 'Cancel anytime without penalty'].map(t => (
                    <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-mid)' }}>
                      <CheckCircle size={14} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} strokeWidth={2.5} />
                      {t}
                    </li>
                  ))}
                </ul>
                {blocked ? (
                  <div style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                    <Lock size={13} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Limit reached
                  </div>
                ) : (
                  <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleMode('practice')} disabled={!!starting}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.8rem', opacity: starting ? 0.7 : 1, fontSize: '0.9rem', borderRadius: 'var(--radius)' }}>
                    <BookOpen size={15} /> {starting === 'practice' ? 'Starting…' : 'Start Practice Session'}
                  </motion.button>
                )}
              </motion.div>
            );
          })()}

          {/* Mock */}
          {(() => {
            const blocked = mockRemaining === 0;
            return (
              <motion.div variants={cardVariants} className="card"
                style={{ borderColor: blocked ? 'var(--border)' : 'var(--accent)', borderWidth: '1.5px', padding: '1.6rem', position: 'relative', overflow: 'hidden', boxShadow: blocked ? 'none' : '0 4px 24px rgba(200,146,26,0.1)', opacity: blocked ? 0.75 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={20} color="var(--accent)" strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', color: 'var(--accent)', fontSize: '1.05rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)' }}>Mock Exam</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem', fontWeight: '500' }}>Simulate the real CPTE · 150 min</div>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: '1.4rem' }}>
                  {['100 questions, 150-minute timed exam', 'No answer feedback during exam', 'Full review revealed after submit', 'True CPTE exam simulation'].map(t => (
                    <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-mid)' }}>
                      <CheckCircle size={14} color="var(--accent)" style={{ marginTop: '2px', flexShrink: 0 }} strokeWidth={2.5} />
                      {t}
                    </li>
                  ))}
                </ul>
                {blocked ? (
                  <div style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                    <Lock size={13} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Limit reached
                  </div>
                ) : (
                  <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleMode('mock')} disabled={!!starting}
                    style={{ width: '100%', padding: '0.8rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: '700', fontSize: '0.9rem', cursor: starting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(200,146,26,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', opacity: starting ? 0.7 : 1 }}>
                    <Clock size={15} /> {starting === 'mock' ? 'Starting…' : 'Start Mock Exam'}
                  </motion.button>
                )}
              </motion.div>
            );
          })()}
          {/* Real Exam Walkthrough */}
          <motion.div variants={cardVariants} className="card"
            style={{ borderColor: '#1d6b5e', borderWidth: '1.5px', padding: '1.6rem', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 24px rgba(29,107,94,0.13)', gridColumn: 'span 2' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: '#1d6b5e', color: '#fff', fontSize: '0.6rem', fontWeight: '800', padding: '3px 10px', letterSpacing: '0.08em', borderBottomLeftRadius: '6px' }}>NEW</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem', flexWrap: 'wrap' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(29,107,94,0.12)', border: '1px solid rgba(29,107,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Target size={20} color="#1d6b5e" strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ fontWeight: '800', color: '#1d6b5e', fontSize: '1.05rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)' }}>Real Exam Walkthrough</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem', fontWeight: '500' }}>Authentic CAPR portal experience · Vignette-based cases</div>
                <ul style={{ listStyle: 'none', marginTop: '0.9rem', marginBottom: 0, display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.5rem' }}>
                  {['Exact replica of real CPTE interface', 'Shared patient vignettes (3-4 Qs per case)', 'Option elimination (cross out wrong answers)', 'Question navigator sidebar', 'Flag questions for review', '150 min timed exam'].map(t => (
                    <li key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-mid)' }}>
                      <CheckCircle size={13} color="#1d6b5e" strokeWidth={2.5} /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleMode('real')} disabled={!!starting}
                style={{ alignSelf: 'center', padding: '0.8rem 1.6rem', background: '#1d6b5e', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: '700', fontSize: '0.9rem', cursor: starting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(29,107,94,0.35)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', opacity: starting ? 0.7 : 1, whiteSpace: 'nowrap' }}>
                <Target size={15} /> {starting === 'real' ? 'Launching…' : 'Enter Real Exam'}
              </motion.button>
            </div>
          </motion.div>

        </motion.div>

        {/* ── Recent Attempts ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: '3px', height: '18px', background: 'var(--primary)', borderRadius: '2px', display: 'block' }} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.01em', fontFamily: 'var(--font-head)' }}>Recent Attempts</h2>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onDashboard}
            className="btn-primary"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Full Dashboard <ChevronRight size={13} />
          </motion.button>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          {historyLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <Activity size={20} color="var(--border)" style={{ marginBottom: '0.5rem' }} /> Loading…
            </div>
          ) : recentAttempts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--bg-subtle)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem' }}>
                <TrendingUp size={22} color="var(--text-subtle)" />
              </div>
              <div style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '0.3rem', fontSize: '0.95rem' }}>No attempts yet</div>
              <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Start a session above to track your progress.</div>
            </div>
          ) : recentAttempts.map((a, i) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.4rem', borderBottom: i < recentAttempts.length - 1 ? '1px solid var(--border)' : 'none', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flex: 1, minWidth: 0 }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: a.mode === 'mock' ? 'var(--accent-light)' : a.mode === 'real' ? 'rgba(29,107,94,0.1)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {a.mode === 'mock' ? <Clock size={16} color="var(--accent)" /> : a.mode === 'real' ? <Target size={16} color="#1d6b5e" /> : <BookOpen size={16} color="var(--primary)" />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text)' }}>{a.mode === 'mock' ? 'Mock Exam' : a.mode === 'real' ? 'Real Exam Walkthrough' : 'Practice Session'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{fmt(a.started_at)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                <StatusBadge score={a.score} status={a.status} />
                {a.status === 'in_progress' && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleResume(a.id)}
                    disabled={!!resuming}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.7rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '7px', cursor: resuming ? 'not-allowed' : 'pointer', fontSize: '0.75rem', fontWeight: '700', fontFamily: 'var(--font-body)', opacity: resuming === a.id ? 0.7 : 1 }}>
                    <Play size={10} /> {resuming === a.id ? 'Loading…' : 'Continue'}
                  </motion.button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
