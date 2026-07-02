-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (mirrors Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exam templates table
CREATE TABLE IF NOT EXISTS public.exam_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  question_count INTEGER NOT NULL DEFAULT 100,
  time_limit_seconds INTEGER NOT NULL DEFAULT 6000
);

-- Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES public.exam_templates(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option_index INTEGER NOT NULL CHECK (correct_option_index BETWEEN 0 AND 3),
  rationale TEXT NOT NULL
);

-- Exam attempts table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  template_id INTEGER NOT NULL REFERENCES public.exam_templates(id),
  mode TEXT NOT NULL CHECK (mode IN ('practice', 'mock')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'expired')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  score NUMERIC(5,2),
  server_expires_at TIMESTAMPTZ
);

-- Attempt answers table
CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES public.questions(id),
  selected_option_index INTEGER CHECK (selected_option_index BETWEEN 0 AND 3),
  is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- Insert default exam template
INSERT INTO public.exam_templates (name, description, question_count, time_limit_seconds)
VALUES ('NPTE-Style Full Exam', 'A 100-question exam covering all PT domains, modeled after the NPTE format.', 100, 6000)
ON CONFLICT DO NOTHING;
