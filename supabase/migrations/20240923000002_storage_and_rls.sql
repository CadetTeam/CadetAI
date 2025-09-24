-- Storage buckets and RLS policies for CadetAI Platform
-- This migration sets up storage buckets and comprehensive RLS policies

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('apd-attachments', 'apd-attachments', false, 10485760, '{"image/*","application/pdf","text/*","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"}'),
  ('user-avatars', 'user-avatars', true, 5242880, '{"image/jpeg","image/png","image/gif","image/webp"}'),
  ('organization-assets', 'organization-assets', false, 20971520, '{"image/*","application/pdf","text/*"}')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apd_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- User profiles table policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = clerk_user_id);

-- Organizations table policies
CREATE POLICY "Organization members can view organization" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      JOIN public.teams t ON t.id = tm.team_id
      WHERE t.organization_id = organizations.id
      AND tm.user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
    )
  );

CREATE POLICY "Organization admins can update organization" ON public.organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      JOIN public.teams t ON t.id = tm.team_id
      WHERE t.organization_id = organizations.id
      AND tm.user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
      AND tm.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create organizations" ON public.organizations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Teams table policies
CREATE POLICY "Team members can view team" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = teams.id
      AND tm.user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.team_members tm
      JOIN public.teams t ON t.id = tm.team_id
      WHERE t.organization_id = teams.organization_id
      AND tm.user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
      AND tm.role = 'admin'
    )
  );

CREATE POLICY "Organization admins can manage teams" ON public.teams
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      JOIN public.teams t ON t.id = tm.team_id
      WHERE t.organization_id = teams.organization_id
      AND tm.user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
      AND tm.role = 'admin'
    )
  );

-- Team members table policies
CREATE POLICY "Team members can view team membership" ON public.team_members
  FOR SELECT USING (
    user_id = (
      SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM public.team_members tm2
      WHERE tm2.team_id = team_members.team_id
      AND tm2.user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
      AND tm2.role = 'admin'
    )
  );

CREATE POLICY "Team admins can manage memberships" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
      AND tm.role = 'admin'
    )
  );

-- APD Documents table policies
CREATE POLICY "Document creators can view their documents" ON public.apd_documents
  FOR SELECT USING (
    created_by = (
      SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM public.document_shares ds
      WHERE ds.document_id = apd_documents.id
      AND ds.shared_with_user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
      AND ds.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.document_shares ds
      WHERE ds.document_id = apd_documents.id
      AND ds.shared_with_team_id IN (
        SELECT tm.team_id FROM public.team_members tm
        WHERE tm.user_id = (
          SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
        )
      )
      AND ds.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.team_members tm
      JOIN public.teams t ON t.id = tm.team_id
      WHERE t.organization_id = apd_documents.organization_id
      AND tm.user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
      AND tm.role = 'admin'
    )
  );

CREATE POLICY "Document editors can update documents" ON public.apd_documents
  FOR UPDATE USING (
    created_by = (
      SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM public.document_shares ds
      WHERE ds.document_id = apd_documents.id
      AND ds.shared_with_user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
      AND ds.permission_level IN ('edit', 'admin')
      AND ds.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.document_shares ds
      WHERE ds.document_id = apd_documents.id
      AND ds.shared_with_team_id IN (
        SELECT tm.team_id FROM public.team_members tm
        WHERE tm.user_id = (
          SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
        )
      )
      AND ds.permission_level IN ('edit', 'admin')
      AND ds.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.team_members tm
      JOIN public.teams t ON t.id = tm.team_id
      WHERE t.organization_id = apd_documents.organization_id
      AND tm.user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
      AND tm.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create documents" ON public.apd_documents
  FOR INSERT WITH CHECK (
    created_by = (
      SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
    )
  );

CREATE POLICY "Document creators and admins can delete documents" ON public.apd_documents
  FOR DELETE USING (
    created_by = (
      SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM public.team_members tm
      JOIN public.teams t ON t.id = tm.team_id
      WHERE t.organization_id = apd_documents.organization_id
      AND tm.user_id = (
        SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.uid()::text
      )
      AND tm.role = 'admin'
    )
  );

-- Document collaborators table policies
CREATE POLICY "Document collaborators can view collaboration info" ON public.document_collaborators
  FOR SELECT USING (
    user_id = (
      SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM public.apd_documents ad
      WHERE ad.id = document_collaborators.document_id
      AND ad.owner_id = (
        SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.apd_documents ad
      JOIN public.user_organizations uo ON uo.organization_id = ad.organization_id
      WHERE ad.id = document_collaborators.document_id
      AND uo.user_id = (
        SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
      )
      AND uo.role = 'admin'
    )
  );

CREATE POLICY "Document owners can manage collaborators" ON public.document_collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.apd_documents ad
      WHERE ad.id = document_collaborators.document_id
      AND ad.owner_id = (
        SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.apd_documents ad
      JOIN public.user_organizations uo ON uo.organization_id = ad.organization_id
      WHERE ad.id = document_collaborators.document_id
      AND uo.user_id = (
        SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
      )
      AND uo.role = 'admin'
    )
  );

-- Document comments table policies
CREATE POLICY "Document participants can view comments" ON public.document_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.apd_documents ad
      WHERE ad.id = document_comments.document_id
      AND (
        ad.owner_id = (
          SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
        )
        OR EXISTS (
          SELECT 1 FROM public.document_collaborators dc
          WHERE dc.document_id = ad.id
          AND dc.user_id = (
            SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
          )
        )
        OR EXISTS (
          SELECT 1 FROM public.user_organizations uo
          WHERE uo.organization_id = ad.organization_id
          AND uo.user_id = (
            SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
          )
        )
      )
    )
  );

CREATE POLICY "Document participants can create comments" ON public.document_comments
  FOR INSERT WITH CHECK (
    user_id = (
      SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
    )
    AND EXISTS (
      SELECT 1 FROM public.apd_documents ad
      WHERE ad.id = document_comments.document_id
      AND (
        ad.owner_id = (
          SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
        )
        OR EXISTS (
          SELECT 1 FROM public.document_collaborators dc
          WHERE dc.document_id = ad.id
          AND dc.user_id = (
            SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
          )
        )
        OR EXISTS (
          SELECT 1 FROM public.user_organizations uo
          WHERE uo.organization_id = ad.organization_id
          AND uo.user_id = (
            SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
          )
        )
      )
    )
  );

CREATE POLICY "Comment authors can update their comments" ON public.document_comments
  FOR UPDATE USING (
    user_id = (
      SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
    )
  );

CREATE POLICY "Comment authors can delete their comments" ON public.document_comments
  FOR DELETE USING (
    user_id = (
      SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM public.apd_documents ad
      WHERE ad.id = document_comments.document_id
      AND ad.owner_id = (
        SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.apd_documents ad
      JOIN public.user_organizations uo ON uo.organization_id = ad.organization_id
      WHERE ad.id = document_comments.document_id
      AND uo.user_id = (
        SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
      )
      AND uo.role = 'admin'
    )
  );

-- Storage bucket policies
-- APD attachments bucket
CREATE POLICY "APD attachments access" ON storage.objects
  FOR ALL USING (
    bucket_id = 'apd-attachments'
    AND (
      -- Document owners can access their attachments
      EXISTS (
        SELECT 1 FROM public.apd_documents ad
        WHERE ad.id::text = (storage.foldername(name))[1]
        AND ad.owner_id = (
          SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
        )
      )
      -- Document collaborators can access attachments
      OR EXISTS (
        SELECT 1 FROM public.apd_documents ad
        JOIN public.document_collaborators dc ON dc.document_id = ad.id
        WHERE ad.id::text = (storage.foldername(name))[1]
        AND dc.user_id = (
          SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
        )
      )
      -- Organization admins can access attachments
      OR EXISTS (
        SELECT 1 FROM public.apd_documents ad
        JOIN public.user_organizations uo ON uo.organization_id = ad.organization_id
        WHERE ad.id::text = (storage.foldername(name))[1]
        AND uo.user_id = (
          SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
        )
        AND uo.role = 'admin'
      )
    )
  );

-- User avatars bucket (public read, user can upload/update their own)
CREATE POLICY "User avatars are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Organization assets bucket
CREATE POLICY "Organization assets access" ON storage.objects
  FOR ALL USING (
    bucket_id = 'organization-assets'
    AND EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.organization_id::text = (storage.foldername(name))[1]
      AND uo.user_id = (
        SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
      )
      AND (
        uo.role = 'admin'
        OR EXISTS (
          SELECT 1 FROM public.apd_documents ad
          WHERE ad.organization_id = uo.organization_id
          AND ad.id::text = (storage.foldername(name))[2]
          AND (
            ad.owner_id = (
              SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
            )
            OR EXISTS (
              SELECT 1 FROM public.document_collaborators dc
              WHERE dc.document_id = ad.id
              AND dc.user_id = (
                SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
            )
          )
        )
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_user_id ON public.user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_org_id ON public.user_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_apd_documents_owner_id ON public.apd_documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_apd_documents_org_id ON public.apd_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_document_collaborators_doc_id ON public.document_collaborators(document_id);
CREATE INDEX IF NOT EXISTS idx_document_collaborators_user_id ON public.document_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_document_comments_doc_id ON public.document_comments(document_id);
CREATE INDEX IF NOT EXISTS idx_document_comments_user_id ON public.document_comments(user_id);
