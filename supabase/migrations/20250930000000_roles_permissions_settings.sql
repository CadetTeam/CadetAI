-- Roles, Permissions, and Settings Schema
-- Links Clerk users to Supabase profiles and enforces RLS

-- Types
DO $$ BEGIN
  CREATE TYPE permission_scope AS ENUM ('org', 'team', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Core tables
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  scope permission_scope NOT NULL,
  description TEXT,
  UNIQUE(action, scope),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Role assignments: maps users to roles optionally scoped to org/team
CREATE TABLE IF NOT EXISTS public.role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  organization_id UUID NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  team_id UUID NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization and user settings
CREATE TABLE IF NOT EXISTS public.organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID UNIQUE NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}',
  updated_by UUID NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID UNIQUE NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed base roles and permissions (idempotent)
INSERT INTO public.roles (name, description)
VALUES ('admin', 'Full access'), ('manager', 'Manage teams and content'), ('analyst', 'Work on documents'), ('viewer', 'Read-only')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.permissions (action, scope, description) VALUES
  ('manage_org', 'org', 'Manage organization settings'),
  ('manage_team', 'team', 'Manage teams and members'),
  ('manage_users', 'org', 'Invite and manage users'),
  ('view', 'org', 'View organization content'),
  ('edit', 'org', 'Edit organization content')
ON CONFLICT (action, scope) DO NOTHING;

-- Map base role permissions (safe upserts)
WITH perm AS (
  SELECT p.id, p.action, p.scope FROM public.permissions p
), r AS (
  SELECT id, name FROM public.roles
)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM r
JOIN perm p ON (
  (r.name = 'admin') OR
  (r.name = 'manager' AND p.action IN ('manage_team','manage_users','view','edit')) OR
  (r.name = 'analyst' AND p.action IN ('view','edit')) OR
  (r.name = 'viewer' AND p.action IN ('view'))
)
ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE public.role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Helpers: get current Clerk user id from JWT
CREATE OR REPLACE FUNCTION public.current_clerk_user_id() RETURNS TEXT AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')
$$ LANGUAGE SQL STABLE;

-- Policies
-- Role assignments: users can view their own assignments; admins can view all in org
CREATE POLICY "View own role assignments" ON public.role_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = role_assignments.user_profile_id
        AND up.clerk_user_id = public.current_clerk_user_id()
    )
  );

-- Organization settings: members with manage_org or admin can select/update; others can select
CREATE POLICY "Select org settings if member" ON public.organization_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      JOIN public.team_members tm ON tm.organization_id = o.id
      JOIN public.user_profiles up ON up.id = tm.user_id
      WHERE o.id = organization_settings.organization_id
        AND up.clerk_user_id = public.current_clerk_user_id()
    )
  );

CREATE POLICY "Update org settings with permission" ON public.organization_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM public.user_profiles up
      JOIN public.role_assignments ra ON ra.user_profile_id = up.id
      JOIN public.role_permissions rp ON rp.role_id = ra.role_id
      JOIN public.permissions p ON p.id = rp.permission_id AND p.action = 'manage_org'
      WHERE up.clerk_user_id = public.current_clerk_user_id()
        AND ra.organization_id = organization_settings.organization_id
    )
  );

-- User settings: user can select/update own
CREATE POLICY "Select own user settings" ON public.user_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = user_settings.user_profile_id
        AND up.clerk_user_id = public.current_clerk_user_id()
    )
  );

CREATE POLICY "Update own user settings" ON public.user_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = user_settings.user_profile_id
        AND up.clerk_user_id = public.current_clerk_user_id()
    )
  );

-- Triggers to maintain updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_org_settings_updated_at ON public.organization_settings;
CREATE TRIGGER trg_org_settings_updated_at
BEFORE UPDATE ON public.organization_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER trg_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


