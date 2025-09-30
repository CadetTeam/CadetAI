import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = auth()
    if (!userId || !orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(req.url)
    const organizationId = url.searchParams.get('organizationId') || orgId

    const memberships = await clerk.organizations.getOrganizationMembershipList({ organizationId, limit: 200 })
    const data = memberships.data.map((m) => ({
      id: m.id,
      role: m.role,
      userId: m.publicUserData?.userId,
      email: m.publicUserData?.identifier,
      name: m.publicUserData?.firstName && m.publicUserData?.lastName ? `${m.publicUserData.firstName} ${m.publicUserData.lastName}` : m.publicUserData?.firstName || m.publicUserData?.identifier,
      imageUrl: m.publicUserData?.imageUrl,
    }))
    return NextResponse.json({ members: data, currentUserId: userId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to list members' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, orgId } = auth()
    if (!userId || !orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { membershipId, role, organizationId } = await req.json()
    if (!membershipId || !role) return NextResponse.json({ error: 'membershipId and role required' }, { status: 400 })

    await clerk.organizations.updateOrganizationMembership(
      organizationId || orgId,
      membershipId,
      { role }
    )
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update member role' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, orgId } = auth()
    if (!userId || !orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { membershipId, organizationId, targetUserId } = await req.json()
    const org = organizationId || orgId
    if (!membershipId && !targetUserId) return NextResponse.json({ error: 'membershipId or targetUserId required' }, { status: 400 })

    if (targetUserId && targetUserId === userId) {
      // Leave organization
      await clerk.organizations.deleteOrganizationMembership({ organizationId: org, userId: targetUserId })
    } else if (membershipId) {
      // Remove another member by membership id
      await clerk.organizations.deleteOrganizationMembership({ organizationId: org, organizationMembershipId: membershipId })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
  }
}


