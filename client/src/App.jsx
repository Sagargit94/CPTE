import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from './lib/supabaseClient.js';
import { startAttempt, resumeAttempt } from './lib/api.js';
import { ThemeProvider } from './lib/theme.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import ExamScreen from './components/ExamScreen.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import DashboardScreen from './components/DashboardScreen.jsx';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
};

function Page({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ minHeight: '100vh' }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setUser(session?.user ?? null); setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session); setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleStartExam(templateId, mode) {
    const result = await startAttempt(templateId, mode);
    setCurrentAttempt(result);
    setCurrentScreen('exam');
  }

  function handleExamFinish(attempt) {
    setCurrentAttempt(attempt);
    setCurrentScreen('results');
  }

  async function handleResumeExam(attemptId) {
    const result = await resumeAttempt(attemptId);
    setCurrentAttempt(result);
    setCurrentScreen('exam');
  }

  function handleCancel() {
    setCurrentAttempt(null);
    setCurrentScreen('home');
  }

  if (loading) return (
    <ThemeProvider>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}
        >
          Loading…
        </motion.div>
      </div>
    </ThemeProvider>
  );

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        {!user && <Page key="auth"><AuthScreen /></Page>}
        {user && currentScreen === 'exam' && currentAttempt && (
          <Page key="exam">
            <ExamScreen attempt={currentAttempt} onFinish={handleExamFinish} onCancel={handleCancel} />
          </Page>
        )}
        {user && currentScreen === 'results' && currentAttempt && (
          <Page key="results">
            <ResultsScreen attempt={currentAttempt} onHome={() => { setCurrentAttempt(null); setCurrentScreen('home'); }} />
          </Page>
        )}
        {user && currentScreen === 'dashboard' && (
          <Page key="dashboard">
            <DashboardScreen onHome={() => setCurrentScreen('home')} />
          </Page>
        )}
        {user && currentScreen === 'home' && (
          <Page key="home">
            <HomeScreen user={user} onStartExam={handleStartExam} onResumeExam={handleResumeExam} onDashboard={() => setCurrentScreen('dashboard')} />
          </Page>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}
