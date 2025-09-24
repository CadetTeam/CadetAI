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
