require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { QUESTIONS } = require("./questions.js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log("Fetching template ID...");
  const { data: templates, error: tErr } = await supabase
    .from("exam_templates")
    .select("id")
    .limit(1);

  if (tErr || !templates?.length) {
    console.error("No exam template found. Run the SQL schema files first.");
    process.exit(1);
  }

  const templateId = templates[0].id;
  console.log(`Using template ID: ${templateId}`);

  // Clear existing questions for this template
  await supabase.from("questions").delete().eq("template_id", templateId);

  const rows = QUESTIONS.map((q) => ({
    template_id: templateId,
    domain: q.domain,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    correct_option_index: q.correct_option_index,
    rationale: q.rationale,
  }));

  const { error: qErr } = await supabase.from("questions").insert(rows);

  if (qErr) {
    console.error("Error seeding questions:", qErr.message);
    process.exit(1);
  }

  console.log(`✓ Seeded ${rows.length} questions successfully.`);
}

seed();
