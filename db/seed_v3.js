// seed_v3.js — Full 1500-question CPTE bank
// Run: node db/seed_v3.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const msk = require('./questions/msk');
const neuro = require('./questions/neuro');
const cardio = require('./questions/cardiopulmonary');
const integument = require('./questions/integumentary');
const other = require('./questions/other_systems');
const nonSystems = require('./questions/non_systems');

const allQuestions = [...msk, ...neuro, ...cardio, ...integument, ...other, ...nonSystems];

async function seed() {
  console.log(`Seeding ${allQuestions.length} questions...`);

  // Delete in correct order to avoid FK violations:
  // 1. attempt_answers → 2. exam_attempts → 3. questions

  const { error: aaErr } = await supabase
    .from('attempt_answers')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows
  if (aaErr) { console.error('Failed to delete attempt_answers:', aaErr); process.exit(1); }
  console.log('attempt_answers cleared.');

  const { error: attErr } = await supabase
    .from('exam_attempts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (attErr) { console.error('Failed to delete exam_attempts:', attErr); process.exit(1); }
  console.log('exam_attempts cleared.');

  const { error: delErr } = await supabase
    .from('questions')
    .delete()
    .eq('template_id', 1);
  if (delErr) { console.error('Delete failed:', delErr); process.exit(1); }
  console.log('Existing questions deleted.');

  // Insert in batches of 200
  const BATCH = 200;
  for (let i = 0; i < allQuestions.length; i += BATCH) {
    const batch = allQuestions.slice(i, i + BATCH);
    const { error } = await supabase.from('questions').insert(batch);
    if (error) { console.error(`Insert failed at batch ${i}:`, error); process.exit(1); }
    console.log(`Inserted ${Math.min(i + BATCH, allQuestions.length)} / ${allQuestions.length}`);
  }

  // Print domain summary
  const domains = {};
  allQuestions.forEach(q => { domains[q.domain] = (domains[q.domain] || 0) + 1; });
  console.log('\nDomain breakdown:');
  Object.entries(domains).forEach(([d, c]) => console.log(`  ${d}: ${c}`));
  console.log('\nSeeding complete!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
