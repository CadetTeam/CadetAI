# CadetAI Environment Setup Guide

## 🌐 Domain Configuration

### Vercel Domains
- **Development**: `demo.cadetai.com` ✅ (Already configured)
- **Production**: `my.cadetai.com` ✅ (Added, needs DNS configuration)

### DNS Configuration Required
For `my.cadetai.com`, add this A record to your DNS provider:
```
A my.cadetai.com 76.76.21.21
```

## 🔐 Clerk Configuration

### Required Steps:
1. **Login to Clerk Dashboard**: https://dashboard.clerk.com
2. **Navigate to**: Your Application → Settings → API Keys
3. **Add Allowed Origins**:
   - `https://demo.cadetai.com`
   - `https://my.cadetai.com`
   - `http://localhost:3000` (for local development)
4. **Update Redirect URLs**:
   - After Sign In: `https://my.cadetai.com/app`
   - After Sign Up: `https://my.cadetai.com/app`
   - Development: `https://demo.cadetai.com/app`

### Environment Variables Needed:
```bash
# Production (my.cadetai.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Z2l2aW5nLWnob3ctMzQuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_C1Ip07TPUKB18vpCkN3v829VXbv5v0wQZ9dfxEd8Py

# Development (demo.cadetai.com) - Same keys for now, separate later if needed
```

## 🗄️ Supabase Configuration

### Current Setup:
- **URL**: `https://veesigfsdjjqeszuhgrn.supabase.co`
- **Database**: PostgreSQL with full schema
- **Storage**: Buckets configured with RLS policies

### Environment Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://veesigfsdjjqeszuhgrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 GitHub Branch Strategy

### Recommended Setup:
- **main branch** → Production (`my.cadetai.com`)
- **dev branch** → Development (`demo.cadetai.com`)

### Commands to Set Up:
```bash
# Create dev branch
git checkout -b dev

# Push dev branch
git push -u origin dev

# Set up branch protection rules in GitHub
```

## ⚙️ Vercel Environment Configuration

### Production Environment (`my.cadetai.com`):
- Connect to `main` branch
- All environment variables set
- Custom domain: `my.cadetai.com`

### Development Environment (`demo.cadetai.com`):
- Connect to `dev` branch (or current setup)
- Same environment variables
- Custom domain: `demo.cadetai.com`

## 🔄 Deployment Strategy

### Development Workflow:
1. Work on `dev` branch
2. Push to `dev` branch
3. Auto-deploy to `demo.cadetai.com`

### Production Workflow:
1. Merge `dev` to `main` branch
2. Push to `main` branch
3. Auto-deploy to `my.cadetai.com`

## 🧪 Testing Checklist

### Development Environment (`demo.cadetai.com`):
- [ ] Custom sign-in/sign-up pages load
- [ ] OTP authentication works
- [ ] Mobile responsive sidebar
- [ ] Supabase connection
- [ ] Clerk webhooks

### Production Environment (`my.cadetai.com`):
- [ ] DNS configuration complete
- [ ] SSL certificate active
- [ ] All features working
- [ ] Performance optimized
- [ ] Security headers configured

## 🚨 Next Steps

1. **Configure DNS** for `my.cadetai.com`
2. **Update Clerk Dashboard** with new domains
3. **Set up GitHub branches** (main/dev)
4. **Configure Vercel** for both environments
5. **Test both environments** thoroughly
6. **Set up monitoring** and analytics

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test Clerk configuration
4. Check Supabase connection
5. Review DNS propagation (up to 24 hours)
