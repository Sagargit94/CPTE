import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient.js';
import { startAttempt } from './lib/api.js';
import AuthScreen from './components/AuthScreen.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import ExamScreen from './components/ExamScreen.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleStartExam(templateId, mode) {
    try {
      const result = await startAttempt(templateId, mode);
      setCurrentAttempt(result);
      setCurrentScreen('exam');
    } catch (err) {
      alert('Failed to start exam: ' + err.message);
    }
  }

  function handleExamFinish(attempt) {
    setCurrentAttempt(attempt);
    setCurrentScreen('results');
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (currentScreen === 'exam' && currentAttempt) {
    return <ExamScreen attempt={currentAttempt} onFinish={handleExamFinish} />;
  }

  if (currentScreen === 'results' && currentAttempt) {
    return <ResultsScreen attempt={currentAttempt} onHome={() => setCurrentScreen('home')} />;
  }

  return <HomeScreen user={user} onStartExam={handleStartExam} />;
}
