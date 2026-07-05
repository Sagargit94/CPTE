-- Add vignette support to questions table
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS vignette_id INTEGER,
  ADD COLUMN IF NOT EXISTS vignette_text TEXT;

-- Allow 'real' as a valid exam mode
ALTER TABLE public.exam_attempts
  DROP CONSTRAINT IF EXISTS exam_attempts_mode_check;

ALTER TABLE public.exam_attempts
  ADD CONSTRAINT exam_attempts_mode_check
  CHECK (mode IN ('practice', 'mock', 'real'));

-- New exam template for Real Exam walkthrough (id will be 2)
INSERT INTO public.exam_templates (name, description, question_count, time_limit_seconds)
VALUES ('CPTE Real Exam Walkthrough', 'Simulates the real CAPR CPTE exam interface with shared vignettes and standalone questions. 100 questions, 150 minutes.', 100, 9000)
ON CONFLICT DO NOTHING;
