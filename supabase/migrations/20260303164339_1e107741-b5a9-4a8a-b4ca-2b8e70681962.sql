-- Table for premium interest emails
CREATE TABLE public.premium_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.premium_interests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no auth required)
CREATE POLICY "Anyone can submit interest"
  ON public.premium_interests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);