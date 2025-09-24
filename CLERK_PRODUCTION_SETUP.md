# 🔐 Clerk Production Setup Guide

## 🚀 **Current Status: Ready for Production**

### ✅ **Branding Removal Complete**
- All Clerk logos and branding hidden
- Custom styling applied to match CadetAI theme
- Demo credentials removed
- Production-ready appearance configuration

### 🔑 **Environment Variables to Update**

#### Current (Test Keys):
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Z2l2aW5nLWnob3ctMzQuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_C1Ip07TPUKB18vpCkN3v829VXbv5v0wQZ9dfxEd8Py
```

#### Required (Production Keys):
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_[YOUR_PRODUCTION_KEY]
CLERK_SECRET_KEY=sk_live_[YOUR_PRODUCTION_SECRET]
```

### 📋 **Steps to Complete Production Setup**

#### 1. **Get Production Keys from Clerk Dashboard**
1. Login to: https://dashboard.clerk.com
2. Navigate to: Your Application → Settings → API Keys
3. Switch to **Production** environment
4. Copy the production keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_`)

#### 2. **Update Vercel Environment Variables**
```bash
# Update production keys
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# Enter: pk_live_[YOUR_PRODUCTION_KEY]

vercel env add CLERK_SECRET_KEY  
# Enter: sk_live_[YOUR_PRODUCTION_SECRET]
```

#### 3. **Configure Production Domains in Clerk**
1. In Clerk Dashboard → Settings → Domains
2. Add allowed origins:
   - `https://demo.cadetai.com`
   - `https://my.cadetai.com`
   - `http://localhost:3000` (for development)

#### 4. **Update Webhook Configuration**
1. In Clerk Dashboard → Webhooks
2. Update webhook URL to: `https://my.cadetai.com/api/webhooks/clerk`
3. Copy the webhook secret and update:
```bash
vercel env add WEBHOOK_SECRET
# Enter: whsec_[YOUR_WEBHOOK_SECRET]
```

### 🎨 **Branding Configuration Applied**

#### ✅ **Hidden Elements:**
- Clerk logo and branding
- Header titles and subtitles
- Footer actions and links
- All Clerk-specific UI elements

#### ✅ **Custom Styling:**
- Monochrome color scheme (gray-700 primary)
- Transparent backgrounds
- Custom border radius (0.5rem)
- Consistent with CadetAI design system

#### ✅ **Production Features:**
- Real OTP authentication
- Custom sign-in/sign-up pages
- No demo credentials
- Professional appearance

### 🔧 **Current Configuration**

#### ClerkProvider Settings:
```typescript
appearance={{
  baseTheme: undefined, // Remove default theme
  elements: {
    logoBox: "hidden",
    logoImage: "hidden", 
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    footer: "hidden",
    // ... custom styling
  },
  variables: {
    colorPrimary: "#374151", // gray-700
    colorBackground: "transparent",
    borderRadius: "0.5rem"
  }
}}
```

### 🧪 **Testing Checklist**

#### Before Production:
- [ ] Production keys obtained from Clerk Dashboard
- [ ] Environment variables updated in Vercel
- [ ] Domains configured in Clerk Dashboard
- [ ] Webhook secret updated
- [ ] Test authentication on both domains
- [ ] Verify no Clerk branding appears
- [ ] Confirm OTP functionality works

#### After Production:
- [ ] Test sign-in on `demo.cadetai.com`
- [ ] Test sign-in on `my.cadetai.com`
- [ ] Test sign-up flow
- [ ] Test password reset
- [ ] Test OTP verification
- [ ] Verify webhook integration

### 🚨 **Important Notes**

1. **Test Keys vs Production Keys:**
   - Test keys start with `pk_test_` and `sk_test_`
   - Production keys start with `pk_live_` and `sk_live_`
   - Production keys have different rate limits and features

2. **Domain Configuration:**
   - Both `demo.cadetai.com` and `my.cadetai.com` must be added to Clerk
   - Local development (`localhost:3000`) should remain for testing

3. **Webhook Security:**
   - Production webhook secret is different from test
   - Update both Vercel environment variable and Clerk dashboard

4. **Branding Compliance:**
   - All Clerk branding is now hidden
   - Custom styling matches CadetAI theme
   - Professional appearance maintained

### 🎯 **Next Steps**

1. **Get Production Keys** from Clerk Dashboard
2. **Update Environment Variables** in Vercel
3. **Configure Domains** in Clerk Dashboard
4. **Update Webhook Secret** for production
5. **Deploy and Test** both environments
6. **Verify No Branding** appears anywhere

---

## ✅ **Ready for Production!**

The application is now configured to remove all Clerk branding and is ready for production keys. Once you update the environment variables with production keys, the authentication system will be fully production-ready with no Clerk branding visible to users.
