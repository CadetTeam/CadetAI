-- CadetAI Platform Database Schema
-- Comprehensive schema for government APD management platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'analyst', 'viewer');
CREATE TYPE apd_status AS ENUM ('draft', 'in_review', 'approved', 'rejected', 'archived');
CREATE TYPE collaboration_status AS ENUM ('pending', 'accepted', 'declined', 'revoked');
CREATE TYPE audit_action AS ENUM ('create', 'read', 'update', 'delete', 'share', 'approve', 'reject');

-- ============================================================================
-- USER MANAGEMENT TABLES
-- ============================================================================

-- User profiles (extends Clerk auth)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role DEFAULT 'viewer',
    organization TEXT,
    department TEXT,
    clearance_level TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions for audit trail
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ORGANIZATION & TEAM MANAGEMENT
-- ============================================================================

-- Organizations
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    compliance_level TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams within organizations
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    team_lead_id UUID REFERENCES public.user_profiles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team memberships
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role user_role DEFAULT 'viewer',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- ============================================================================
-- APD DOCUMENT MANAGEMENT
-- ============================================================================

-- APD Templates
CREATE TABLE public.apd_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL,
    content JSONB NOT NULL,
    metadata JSONB,
    version TEXT DEFAULT '1.0.0',
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id),
    organization_id UUID REFERENCES public.organizations(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- APD Documents
CREATE TABLE public.apd_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    template_id UUID REFERENCES public.apd_templates(id),
    content JSONB NOT NULL,
    status apd_status DEFAULT 'draft',
    version TEXT DEFAULT '1.0.0',
    metadata JSONB,
    tags TEXT[],
    organization_id UUID REFERENCES public.organizations(id),
    team_id UUID REFERENCES public.teams(id),
    created_by UUID REFERENCES public.user_profiles(id) NOT NULL,
    assigned_to UUID REFERENCES public.user_profiles(id),
    due_date DATE,
    approved_by UUID REFERENCES public.user_profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- APD Document versions (for version control)
CREATE TABLE public.apd_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.apd_documents(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    content JSONB NOT NULL,
    change_summary TEXT,
    created_by UUID REFERENCES public.user_profiles(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(document_id, version_number)
);

-- ============================================================================
-- COLLABORATION & SHARING
-- ============================================================================

-- Document sharing
CREATE TABLE public.document_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.apd_documents(id) ON DELETE CASCADE,
    shared_with_user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    shared_with_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES public.user_profiles(id) NOT NULL,
    permission_level TEXT CHECK (permission_level IN ('read', 'comment', 'edit', 'admin')) DEFAULT 'read',
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments on documents
CREATE TABLE public.document_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.apd_documents(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.document_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.user_profiles(id) NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collaboration requests
CREATE TABLE public.collaboration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.apd_documents(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES public.user_profiles(id) NOT NULL,
    requested_user_id UUID REFERENCES public.user_profiles(id),
    requested_team_id UUID REFERENCES public.teams(id),
    permission_level TEXT CHECK (permission_level IN ('read', 'comment', 'edit', 'admin')) NOT NULL,
    message TEXT,
    status collaboration_status DEFAULT 'pending',
    responded_by UUID REFERENCES public.user_profiles(id),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WORKFLOW & APPROVAL MANAGEMENT
-- ============================================================================

-- Workflow definitions
CREATE TABLE public.workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    steps JSONB NOT NULL,
    organization_id UUID REFERENCES public.organizations(id),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow instances
CREATE TABLE public.workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES public.workflows(id) NOT NULL,
    document_id UUID REFERENCES public.apd_documents(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'completed', 'cancelled', 'paused')) DEFAULT 'active',
    started_by UUID REFERENCES public.user_profiles(id) NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow step executions
CREATE TABLE public.workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID REFERENCES public.workflow_instances(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    assigned_to UUID REFERENCES public.user_profiles(id),
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')) DEFAULT 'pending',
    comments TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUDIT & COMPLIANCE
-- ============================================================================

-- Audit log for compliance tracking
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action audit_action NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID REFERENCES public.user_sessions(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance requirements
CREATE TABLE public.compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    regulation_type TEXT NOT NULL,
    requirements JSONB NOT NULL,
    organization_id UUID REFERENCES public.organizations(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document compliance tracking
CREATE TABLE public.document_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.apd_documents(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES public.compliance_requirements(id),
    is_compliant BOOLEAN DEFAULT false,
    checked_by UUID REFERENCES public.user_profiles(id),
    checked_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FILE STORAGE & ATTACHMENTS
-- ============================================================================

-- File attachments
CREATE TABLE public.document_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.apd_documents(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.user_profiles(id) NOT NULL,
    is_encrypted BOOLEAN DEFAULT false,
    checksum TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS & COMMUNICATIONS
-- ============================================================================

-- Notification templates
CREATE TABLE public.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User notifications
CREATE TABLE public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_document_id UUID REFERENCES public.apd_documents(id),
    related_entity_id UUID,
    entity_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SYSTEM CONFIGURATION
-- ============================================================================

-- System settings
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES public.user_profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API keys for integrations
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    permissions JSONB NOT NULL,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.user_profiles(id) NOT NULL,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_clerk_id ON public.user_profiles(clerk_user_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_organization ON public.user_profiles(organization);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

-- APD documents indexes
CREATE INDEX idx_apd_documents_status ON public.apd_documents(status);
CREATE INDEX idx_apd_documents_organization ON public.apd_documents(organization_id);
CREATE INDEX idx_apd_documents_team ON public.apd_documents(team_id);
CREATE INDEX idx_apd_documents_created_by ON public.apd_documents(created_by);
CREATE INDEX idx_apd_documents_due_date ON public.apd_documents(due_date);
CREATE INDEX idx_apd_documents_tags ON public.apd_documents USING GIN(tags);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Document shares indexes
CREATE INDEX idx_document_shares_document ON public.document_shares(document_id);
CREATE INDEX idx_document_shares_user ON public.document_shares(shared_with_user_id);
CREATE INDEX idx_document_shares_team ON public.document_shares(shared_with_team_id);

-- Notifications indexes
CREATE INDEX idx_user_notifications_user_read ON public.user_notifications(user_id, is_read);
CREATE INDEX idx_user_notifications_created_at ON public.user_notifications(created_at);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_apd_templates_updated_at BEFORE UPDATE ON public.apd_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_apd_documents_updated_at BEFORE UPDATE ON public.apd_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_comments_updated_at BEFORE UPDATE ON public.document_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_requirements_updated_at BEFORE UPDATE ON public.compliance_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_compliance_updated_at BEFORE UPDATE ON public.document_compliance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA SEEDING
-- ============================================================================

-- Insert default notification templates
INSERT INTO public.notification_templates (name, subject, body, type) VALUES
('document_shared', 'Document Shared: {{document_title}}', '{{shared_by}} has shared the document "{{document_title}}" with you.', 'document'),
('collaboration_request', 'Collaboration Request: {{document_title}}', '{{requester}} has requested {{permission_level}} access to "{{document_title}}".', 'collaboration'),
('document_approved', 'Document Approved: {{document_title}}', 'The document "{{document_title}}" has been approved by {{approver}}.', 'approval'),
('document_rejected', 'Document Rejected: {{document_title}}', 'The document "{{document_title}}" has been rejected by {{rejector}}. Reason: {{reason}}', 'rejection'),
('due_date_reminder', 'Due Date Reminder: {{document_title}}', 'The document "{{document_title}}" is due on {{due_date}}.', 'reminder');

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
('app_name', '"CadetAI Platform"', 'Application name'),
('max_file_size', '104857600', 'Maximum file upload size in bytes (100MB)'),
('session_timeout', '3600', 'Session timeout in seconds (1 hour)'),
('password_policy', '{"min_length": 8, "require_uppercase": true, "require_lowercase": true, "require_numbers": true, "require_special": true}', 'Password policy requirements'),
('audit_retention_days', '2555', 'Audit log retention period in days (7 years)'),
('enable_2fa', 'true', 'Enable two-factor authentication'),
('default_organization', '"Government"', 'Default organization name');
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
