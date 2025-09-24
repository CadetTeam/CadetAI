import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create Supabase client with service role key for webhook operations
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

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.text()

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    
    console.log(`New user created: ${id}`)
    
    try {
      // Create user profile in Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          clerk_user_id: id,
          email: email_addresses[0]?.email_address || '',
          first_name: first_name || '',
          last_name: last_name || '',
          avatar_url: image_url || null,
          role: 'viewer', // Default role
          is_active: true
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }

      console.log('User profile created successfully:', data)
    } catch (err) {
      console.error('Error in user.created webhook:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    
    console.log(`User updated: ${id}`)
    
    try {
      // Update user profile in Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          email: email_addresses[0]?.email_address || '',
          first_name: first_name || '',
          last_name: last_name || '',
          avatar_url: image_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_user_id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating user profile:', error)
        return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 })
      }

      console.log('User profile updated successfully:', data)
    } catch (err) {
      console.error('Error in user.updated webhook:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    
    console.log(`User deleted: ${id}`)
    
    try {
      // Delete user profile from Supabase
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('clerk_user_id', id)

      if (error) {
        console.error('Error deleting user profile:', error)
        return NextResponse.json({ error: 'Failed to delete user profile' }, { status: 500 })
      }

      console.log('User profile deleted successfully')
    } catch (err) {
      console.error('Error in user.deleted webhook:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  return NextResponse.json({ message: 'Webhook received' })
}
