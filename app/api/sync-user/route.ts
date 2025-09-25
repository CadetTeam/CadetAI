import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { clerkUserId } = await req.json()

    if (!clerkUserId) {
      return NextResponse.json({ error: 'clerkUserId is required' }, { status: 400 })
    }

    // Create Supabase client with service role key for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get user data from Clerk API
    const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!clerkResponse.ok) {
      throw new Error(`Clerk API error: ${clerkResponse.status}`)
    }

    const clerkUser = await clerkResponse.json()

    // Sync user data to Supabase
    const userData = {
      clerk_user_id: clerkUserId,
      email: clerkUser.email_addresses?.[0]?.email_address || '',
      first_name: clerkUser.first_name || '',
      last_name: clerkUser.last_name || '',
      avatar_url: clerkUser.image_url || null,
      role: 'viewer',
      is_active: true,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(userData, { 
        onConflict: 'clerk_user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (error) {
      console.error('Error syncing user to Supabase:', error)
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
    }

    console.log('User synced to Supabase:', data)
    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Error in sync-user API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
