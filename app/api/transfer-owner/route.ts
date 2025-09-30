import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth()
    if (!userId || !orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { newOwnerUserId } = await req.json()
    if (!newOwnerUserId) return NextResponse.json({ error: 'newOwnerUserId required' }, { status: 400 })

    // Fallback: update member role to owner (Clerk SDK doesn't have transfer method in this version)
    await clerk.organizations.updateOrganizationMembership({
      organizationId: orgId,
      userId: newOwnerUserId,
      role: 'owner',
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to transfer ownership' }, { status: 500 })
  }
}


