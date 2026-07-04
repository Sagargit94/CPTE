-- ── Run this in the Supabase SQL editor ──

-- 1. Add is_activated flag to users (defaults false = free tier)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_activated BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Update timer to 150 minutes (9000 seconds)
UPDATE public.exam_templates SET time_limit_seconds = 9000;
ALTER TABLE public.exam_templates ALTER COLUMN time_limit_seconds SET DEFAULT 9000;

-- ── To activate a specific user ──
-- UPDATE public.users SET is_activated = TRUE WHERE email = 'user@example.com';

-- ── To deactivate ──
-- UPDATE public.users SET is_activated = FALSE WHERE email = 'user@example.com';

-- ── To see all users and their activation status ──
-- SELECT id, email, is_activated, created_at FROM public.users ORDER BY created_at DESC;
