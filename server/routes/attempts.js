const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../lib/supabase');

// POST / — create new attempt
router.post('/', async (req, res) => {
  try {
    const { template_id, mode } = req.body;
    if (!['practice', 'mock'].includes(mode)) {
      return res.status(400).json({ error: 'mode must be practice or mock' });
    }

    // Fetch template
    const { data: template, error: tmplErr } = await supabaseAdmin
      .from('exam_templates')
      .select('*')
      .eq('id', template_id)
      .single();
    if (tmplErr || !template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Fetch questions for template
    const { data: questions, error: qErr } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('template_id', template_id)
      .order('id');
    if (qErr) return res.status(500).json({ error: qErr.message });

    // Compute expiry for mock mode
    const server_expires_at = mode === 'mock'
      ? new Date(Date.now() + template.time_limit_seconds * 1000).toISOString()
      : null;

    // Create attempt
    const { data: attempt, error: aErr } = await supabaseAdmin
      .from('exam_attempts')
      .insert({
        user_id: req.user.id,
        template_id,
        mode,
        status: 'in_progress',
        server_expires_at
      })
      .select()
      .single();
    if (aErr) return res.status(500).json({ error: aErr.message });

    // Create answer rows
    const answerRows = questions.map(q => ({
      attempt_id: attempt.id,
      question_id: q.id,
      selected_option_index: null,
      is_flagged: false
    }));
    const { error: ansErr } = await supabaseAdmin
      .from('attempt_answers')
      .insert(answerRows);
    if (ansErr) return res.status(500).json({ error: ansErr.message });

    // Strip correct answers before returning
    const safeQuestions = questions.map(({ correct_option_index, rationale, ...q }) => q);

    res.json({ attempt, questions: safeQuestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Helper: auto-submit expired attempt
async function autoSubmitExpired(attemptId) {
  const { data: answers } = await supabaseAdmin
    .from('attempt_answers')
    .select('*, questions(correct_option_index)')
    .eq('attempt_id', attemptId);

  const total = answers.length;
  const correct = answers.filter(a =>
    a.selected_option_index !== null &&
    a.selected_option_index === a.questions.correct_option_index
  ).length;
  const score = total > 0 ? (correct / total) * 100 : 0;

  await supabaseAdmin
    .from('exam_attempts')
    .update({ status: 'expired', submitted_at: new Date().toISOString(), score })
    .eq('id', attemptId);

  return score;
}

// GET /:id — get attempt state
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: attempt, error: aErr } = await supabaseAdmin
      .from('exam_attempts')
      .select('*')
      .eq('id', id)
      .single();
    if (aErr || !attempt) return res.status(404).json({ error: 'Attempt not found' });
    if (attempt.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    // Check expiry for mock mode
    if (attempt.status === 'in_progress' && attempt.mode === 'mock' && attempt.server_expires_at) {
      if (new Date() > new Date(attempt.server_expires_at)) {
        await autoSubmitExpired(id);
        attempt.status = 'expired';
      }
    }

    const { data: answers, error: ansErr } = await supabaseAdmin
      .from('attempt_answers')
      .select('*')
      .eq('attempt_id', id);
    if (ansErr) return res.status(500).json({ error: ansErr.message });

    const { data: questions, error: qErr } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('template_id', attempt.template_id)
      .order('id');
    if (qErr) return res.status(500).json({ error: qErr.message });

    const safeQuestions = attempt.status === 'in_progress'
      ? questions.map(({ correct_option_index, rationale, ...q }) => q)
      : questions;

    res.json({ attempt, questions: safeQuestions, answers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /:id/answers — save answer
router.patch('/:id/answers', async (req, res) => {
  try {
    const { id } = req.params;
    const { question_id, selected_option_index, is_flagged } = req.body;

    const { data: attempt, error: aErr } = await supabaseAdmin
      .from('exam_attempts')
      .select('*')
      .eq('id', id)
      .single();
    if (aErr || !attempt) return res.status(404).json({ error: 'Attempt not found' });
    if (attempt.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    if (attempt.status !== 'in_progress') {
      return res.status(409).json({ error: 'Attempt is not in progress' });
    }

    // Check expiry for mock
    if (attempt.mode === 'mock' && attempt.server_expires_at) {
      if (new Date() > new Date(attempt.server_expires_at)) {
        await autoSubmitExpired(id);
        return res.status(409).json({ error: 'Time expired. Exam has been auto-submitted.' });
      }
    }

    // Upsert answer
    const { error: upsertErr } = await supabaseAdmin
      .from('attempt_answers')
      .upsert({
        attempt_id: id,
        question_id,
        selected_option_index: selected_option_index ?? null,
        is_flagged: is_flagged ?? false,
        answered_at: new Date().toISOString()
      }, { onConflict: 'attempt_id,question_id' });
    if (upsertErr) return res.status(500).json({ error: upsertErr.message });

    if (attempt.mode === 'practice') {
      const { data: question, error: qErr } = await supabaseAdmin
        .from('questions')
        .select('correct_option_index, rationale')
        .eq('id', question_id)
        .single();
      if (qErr) return res.status(500).json({ error: qErr.message });
      return res.json({
        isCorrect: selected_option_index === question.correct_option_index,
        correctOptionIndex: question.correct_option_index,
        rationale: question.rationale
      });
    }

    res.json({ saved: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /:id/submit — finalize attempt
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: attempt, error: aErr } = await supabaseAdmin
      .from('exam_attempts')
      .select('*')
      .eq('id', id)
      .single();
    if (aErr || !attempt) return res.status(404).json({ error: 'Attempt not found' });
    if (attempt.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    if (attempt.status !== 'in_progress') {
      return res.status(409).json({ error: 'Attempt already submitted or expired' });
    }

    const { data: answers, error: ansErr } = await supabaseAdmin
      .from('attempt_answers')
      .select('*, questions(correct_option_index, rationale, domain, question_text, option_a, option_b, option_c, option_d, id)')
      .eq('attempt_id', id);
    if (ansErr) return res.status(500).json({ error: ansErr.message });

    const total = answers.length;
    const correct = answers.filter(a =>
      a.selected_option_index !== null &&
      a.selected_option_index === a.questions.correct_option_index
    ).length;
    const score = total > 0 ? parseFloat(((correct / total) * 100).toFixed(2)) : 0;

    const { data: updatedAttempt, error: updErr } = await supabaseAdmin
      .from('exam_attempts')
      .update({ status: 'submitted', submitted_at: new Date().toISOString(), score })
      .eq('id', id)
      .select()
      .single();
    if (updErr) return res.status(500).json({ error: updErr.message });

    const { data: questions } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('template_id', attempt.template_id)
      .order('id');

    res.json({ attempt: updatedAttempt, questions, answers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
