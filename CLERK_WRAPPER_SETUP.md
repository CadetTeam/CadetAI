# Clerk Wrapper Extension Setup Guide

## Overview
The Clerk wrapper extension enables direct SQL access to Clerk's user data from Supabase, providing real-time synchronization and eliminating the need for complex webhook handling.

## Benefits
- **Real-time user data**: Query Clerk users directly from SQL
- **Automatic synchronization**: No need for webhook complexity
- **Better reliability**: Direct API access vs webhook dependencies
- **Simplified auth flow**: Reduce race conditions and state mismatches

## Setup Instructions

### Step 1: Enable Extension in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Database** → **Extensions**
3. Search for "wrappers" and enable it
4. Search for "Clerk" wrapper and enable it

### Step 2: Run SQL Setup
Copy and paste the contents of `clerk_wrapper_setup_manual.sql` into your Supabase SQL Editor and execute it.

### Step 3: Verify Setup
Run this query to test the connection:
```sql
SELECT * FROM clerk.users LIMIT 5;
```

### Step 4: Test User Sync
After a user signs up, you can manually sync their data:
```sql
SELECT sync_user_from_clerk('user_2abc123def456');
```

## New Capabilities

### 1. Real-time User Queries
```sql
-- Get all users with their latest Clerk data
SELECT * FROM public.user_profiles_with_clerk;

-- Get specific user with live Clerk data
SELECT * FROM public.user_profiles_with_clerk 
WHERE clerk_user_id = 'user_2abc123def456';
```

### 2. Automatic Sync Function
```sql
-- Sync a user's data from Clerk
SELECT sync_user_from_clerk('user_2abc123def456');
```

### 3. Check User Verification Status
```sql
-- Check if a user is verified in Clerk
SELECT 
  clerk_user_id,
  email,
  clerk_last_sign_in,
  clerk_updated_at,
  CASE 
    WHEN clerk_last_sign_in IS NOT NULL THEN 'verified'
    ELSE 'pending'
  END as verification_status
FROM public.user_profiles_with_clerk
WHERE clerk_user_id = 'user_2abc123def456';
```

## Integration with Auth Flow

The wrapper extension can help resolve OTP verification issues by:

1. **Real-time verification checks**: Query Clerk directly to check if a user is verified
2. **Automatic sync**: Keep user profiles in sync without webhook delays
3. **Better error handling**: Get immediate feedback on user status

## Next Steps

1. **Test the setup**: Create a test user and verify the wrapper works
2. **Update auth logic**: Modify the OTP verification to use direct Clerk queries
3. **Reduce webhook dependency**: Use the wrapper as primary sync method
4. **Monitor performance**: The wrapper makes direct API calls, monitor usage

## Troubleshooting

### Common Issues
- **Extension not found**: Ensure wrappers extension is enabled first
- **API key errors**: Verify your Clerk secret key is correct
- **Permission errors**: Check that the functions have proper grants

### Testing Commands
```sql
-- Check if wrapper is installed
SELECT * FROM pg_extension WHERE extname = 'wrappers';

-- Check if Clerk server exists
SELECT * FROM pg_foreign_server WHERE srvname = 'clerk_server';

-- Test Clerk connection
SELECT * FROM clerk.users LIMIT 1;
```

## Migration Strategy

1. **Phase 1**: Set up wrapper alongside existing webhooks
2. **Phase 2**: Test wrapper reliability
3. **Phase 3**: Gradually migrate to wrapper-first approach
4. **Phase 4**: Keep webhooks as backup only

This wrapper extension should significantly improve the reliability of user synchronization and help resolve the OTP verification issues you've been experiencing.
