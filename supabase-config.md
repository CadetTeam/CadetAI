# Supabase Configuration for CadetAI

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://veesigfsdjjqeszuhgrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZXNpZ2ZzZGpqcWVzenVoZ3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NjYyOTEsImV4cCI6MjA3NDI0MjI5MX0.4Zm0YYJ7Hg5ewsC__hb-LQwF-EKSgu_11sWAPQDdctA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZXNpZ2ZzZGpqcWVzenVoZ3JuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODY2NjI5MSwiZXhwIjoyMDc0MjQyMjkxfQ.iWfyRQb0m9QO7RCZe_0r0-DlILGGJ2VU0JHGVKo-0OI

# Clerk Authentication (add these from your Clerk dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Project Details

- **Project ID**: veesigfsdjjqeszuhgrn
- **Project Name**: Cadet AI
- **Region**: us-east-2
- **Database**: PostgreSQL with comprehensive schema
- **Storage**: 3 buckets configured with RLS policies

## Storage Buckets

1. **apd-attachments** - Document attachments (10MB limit)
2. **user-avatars** - User profile pictures (5MB limit, public)
3. **organization-assets** - Organization files (20MB limit)

## Database Schema

✅ Complete schema with:
- User profiles and authentication
- Organizations and teams
- APD documents and templates
- Collaboration and sharing
- Workflows and approvals
- Audit logs and compliance
- File attachments and notifications

✅ RLS policies implemented for security
✅ Performance indexes created
✅ Storage bucket policies configured

## Next Steps

1. Add Clerk authentication keys to `.env.local`
2. Test the Supabase integration
3. Deploy to Vercel with environment variables
