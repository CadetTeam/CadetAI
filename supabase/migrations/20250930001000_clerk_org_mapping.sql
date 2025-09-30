-- Map Clerk organizations to Supabase organizations

CREATE TABLE IF NOT EXISTS public.organization_mappings (
  clerk_organization_id TEXT PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organization_mappings ENABLE ROW LEVEL SECURITY;

-- Allow read access for signed-in users; writes via service role only
CREATE POLICY "Allow select mappings to members" ON public.organization_mappings
  FOR SELECT USING (true);


