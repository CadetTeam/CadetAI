# Clerk Dashboard Configuration Guide

## Required Clerk Dashboard Settings

To ensure proper integration with our frontend, configure the following settings in your Clerk Dashboard:

### 1. **Email Verification Settings**

1. Go to **User & Authentication** → **Email, Phone, Username**
2. **Enable Email Verification**:
   - Turn ON "Email address verification"
   - Set verification method to "Email code"
   - Code length: 6 digits
   - Code expiration: 5 minutes

### 2. **Sign-up Configuration**

1. Go to **User & Authentication** → **Email, Phone, Username**
2. **Sign-up settings**:
   - Enable "Allow sign-ups"
   - Require email verification: **ON**
   - Allow sign-ups from email addresses: **ON**

### 3. **Session Configuration**

1. Go to **User & Authentication** → **Sessions**
2. **Session settings**:
   - Session timeout: 7 days (default)
   - Enable session tokens: **ON**
   - Multi-session mode: **ON**

### 4. **Security Settings**

1. Go to **User & Authentication** → **Attack Protection**
2. **Bot Protection**:
   - Enable bot protection: **ON**
   - CAPTCHA provider: **hCaptcha** or **reCAPTCHA**
   - Apply to sign-ups: **ON**

### 5. **Domain Configuration**

1. Go to **Domains**
2. **Add your domains**:
   - `my.cadetai.com` (production)
   - `demo.cadetai.com` (development)
   - `localhost:3000` (local development)

### 6. **Webhook Configuration**

1. Go to **Webhooks**
2. **Create endpoint**:
   - Endpoint URL: `https://my.cadetai.com/api/webhooks/clerk`
   - Events to subscribe to:
     - `user.created`
     - `user.updated`
     - `user.deleted`
   - Copy the webhook signing secret to Vercel environment variables

### 7. **API Keys**

1. Go to **API Keys**
2. **Copy the keys**:
   - Publishable key: `pk_live_...` (for frontend)
   - Secret key: `sk_live_...` (for backend)
   - Add both to Vercel environment variables

### 8. **Customization Settings**

1. Go to **Branding**
2. **Remove Clerk branding**:
   - Hide Clerk logo: **ON**
   - Hide Clerk footer: **ON**
   - Use custom colors (already handled in code)

## Environment Variables Required

Ensure these are set in Vercel:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Testing Checklist

After configuration:

1. **Test Sign-up Flow**:
   - Create new account
   - Verify email is sent
   - Enter OTP code
   - Confirm redirect to app

2. **Test User Sync**:
   - Check Supabase `user_profiles` table
   - Verify user data is synced

3. **Test Webhooks**:
   - Check Clerk webhook logs
   - Verify successful deliveries

4. **Test Session Management**:
   - Verify user stays logged in
   - Test logout functionality

## Troubleshooting

### Common Issues:

1. **OTP not sending**: Check email verification settings
2. **User not syncing**: Verify webhook configuration
3. **Session issues**: Check domain configuration
4. **CAPTCHA errors**: Verify bot protection settings

### Debug Steps:

1. Check Clerk Dashboard logs
2. Check Vercel function logs
3. Check browser console for errors
4. Verify environment variables are set
