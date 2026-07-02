const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../lib/supabase');

// GET /api/templates
router.get('/', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('exam_templates')
    .select('*')
    .order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
