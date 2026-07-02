-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Exam templates - readable by all authenticated users
CREATE POLICY "Templates readable by authenticated users"
  ON public.exam_templates FOR SELECT
  TO authenticated
  USING (true);

-- Questions - readable by all authenticated users
CREATE POLICY "Questions readable by authenticated users"
  ON public.questions FOR SELECT
  TO authenticated
  USING (true);

-- Exam attempts - users can only see their own
CREATE POLICY "Users can view their own attempts"
  ON public.exam_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts"
  ON public.exam_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts"
  ON public.exam_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- Attempt answers - users can only see their own
CREATE POLICY "Users can view their own answers"
  ON public.attempt_answers FOR SELECT
  USING (
    attempt_id IN (
      SELECT id FROM public.exam_attempts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own answers"
  ON public.attempt_answers FOR INSERT
  WITH CHECK (
    attempt_id IN (
      SELECT id FROM public.exam_attempts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own answers"
  ON public.attempt_answers FOR UPDATE
  USING (
    attempt_id IN (
      SELECT id FROM public.exam_attempts WHERE user_id = auth.uid()
    )
  );

-- Function to auto-create a user profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: fire when a new user registers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
