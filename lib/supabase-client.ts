import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid issues with environment variables
let supabaseClient: SupabaseClient | null = null
let supabaseAdminClient: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    throw new Error('Missing Supabase environment variables')
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

export const getSupabaseAdminClient = (): SupabaseClient => {
  if (supabaseAdminClient) {
    return supabaseAdminClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase admin environment variables')
    throw new Error('Missing Supabase admin environment variables')
  }

  supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  return supabaseAdminClient
}

// Legacy exports for backward compatibility - these will be initialized when first used
export const supabase = {
  get auth() { return getSupabaseClient().auth },
  from: (table: string) => getSupabaseClient().from(table),
  get storage() { return getSupabaseClient().storage },
  get channel() { return getSupabaseClient().channel },
  get removeChannel() { return getSupabaseClient().removeChannel },
  get getChannels() { return getSupabaseClient().getChannels },
  get realtime() { return getSupabaseClient().realtime },
  get schema() { return getSupabaseClient().schema },
  get rpc() { return getSupabaseClient().rpc },
  get functions() { return getSupabaseClient().functions }
} as SupabaseClient

export const supabaseAdmin = {
  get auth() { return getSupabaseAdminClient().auth },
  from: (table: string) => getSupabaseAdminClient().from(table),
  get storage() { return getSupabaseAdminClient().storage },
  get channel() { return getSupabaseAdminClient().channel },
  get removeChannel() { return getSupabaseAdminClient().removeChannel },
  get getChannels() { return getSupabaseAdminClient().getChannels },
  get realtime() { return getSupabaseAdminClient().realtime },
  get schema() { return getSupabaseAdminClient().schema },
  get rpc() { return getSupabaseAdminClient().rpc },
  get functions() { return getSupabaseAdminClient().functions }
} as SupabaseClient
