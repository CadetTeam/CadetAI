# Clerk Webhook Setup Guide

## Overview
This application uses custom Clerk authentication components instead of hosted pages, with webhook integration for user management.

## Webhook Configuration

### 1. Clerk Dashboard Setup
1. Go to your Clerk Dashboard
2. Navigate to **Webhooks** section
3. Click **Add Endpoint**
4. Set the endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
5. Select the following events:
   - `user.created`
   - `user.updated` 
   - `user.deleted`

### 2. Environment Variables
Add the webhook secret to your environment variables:

```bash
# In .env.local
WEBHOOK_SECRET=whsec_your_webhook_secret_here

# In Vercel
vercel env add WEBHOOK_SECRET production
```

### 3. Webhook Handler
The webhook handler is located at `app/api/webhooks/clerk/route.ts` and includes:

- **user.created**: Logs new user creation (ready for Supabase integration)
- **user.updated**: Logs user updates (ready for Supabase integration)  
- **user.deleted**: Logs user deletion (ready for Supabase integration)

### 4. Custom Authentication
- **Sign-in**: `/sign-in` - Custom styled Clerk SignIn component
- **Sign-up**: `/sign-up` - Custom styled Clerk SignUp component
- **Redirect**: Both redirect to `/app` after successful authentication

### 5. Supabase Integration Ready
The webhook handler is prepared for Supabase integration. You can add user profile creation logic in the `user.created` event handler:

```typescript
// Example Supabase integration
if (eventType === 'user.created') {
  const { id, email_addresses, first_name, last_name } = evt.data
  
  // Create user profile in Supabase
  await supabase
    .from('user_profiles')
    .insert({
      clerk_user_id: id,
      email: email_addresses[0].email_address,
      first_name,
      last_name
    })
}
```

## Testing
- Local development: `http://localhost:3000/sign-in`
- Production: `https://your-domain.com/sign-in`

The custom authentication components maintain the monochrome design theme and integrate seamlessly with the CadetAI platform.
