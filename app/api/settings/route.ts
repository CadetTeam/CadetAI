import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET() {
  try {
    const { userId, orgId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .maybeSingle()

    const { data: userSettings } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_profile_id', profile?.id ?? '')
      .maybeSingle()

    let orgSettings: Record<string, unknown> | null = null
    if (orgId) {
      const { data: mapping } = await supabase
        .from('organization_mappings')
        .select('organization_id')
        .eq('clerk_organization_id', orgId)
        .maybeSingle()

      if (mapping?.organization_id) {
        const { data } = await supabase
          .from('organization_settings')
          .select('settings')
          .eq('organization_id', mapping.organization_id)
          .maybeSingle()
        orgSettings = (data?.settings as Record<string, unknown>) ?? null
      }
    }

    return NextResponse.json({ profile, userSettings: (userSettings?.settings as Record<string, unknown>) ?? {}, orgSettings: orgSettings ?? {} })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, orgId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()

    let isOrgAdmin = false
    if (orgId) {
      const client = await clerkClient()
      const membership = await client.organizations.getOrganizationMembershipList({ organizationId: orgId, limit: 200 })
      const me = membership.data.find(m => m.publicUserData?.userId === userId)
      isOrgAdmin = !!me && (me.role === 'admin' || me.role === 'org:admin' || me.role === 'owner')
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (body.userSettings && profile?.id) {
      await supabase
        .from('user_settings')
        .upsert({ user_profile_id: profile.id, settings: body.userSettings })
    }

    if (orgId && body.orgSettings) {
      if (!isOrgAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

      const { data: mapping } = await supabase
        .from('organization_mappings')
        .select('organization_id')
        .eq('clerk_organization_id', orgId)
        .maybeSingle()

      if (mapping?.organization_id && profile?.id) {
        await supabase
          .from('organization_settings')
          .upsert({ organization_id: mapping.organization_id, settings: body.orgSettings, updated_by: profile.id })
      }
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}


