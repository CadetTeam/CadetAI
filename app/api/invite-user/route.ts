import { NextRequest, NextResponse } from 'next/server'
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { emailAddress, role, organizationId } = await req.json()
    
    if (!emailAddress || !organizationId) {
      return NextResponse.json({ error: 'Email address and organization ID are required' }, { status: 400 })
    }

    console.log('Creating invitation:', { emailAddress, role, organizationId })

    // Create invitation via Clerk
    const invitation = await clerk.organizations.createOrganizationInvitation({
      organizationId,
      emailAddress,
      role: role || 'basic_member'
    })

    console.log('Invitation created successfully:', invitation.id)
    
    return NextResponse.json({ 
      message: 'Invitation sent successfully', 
      invitationId: invitation.id,
      status: invitation.status
    })
  } catch (error: unknown) {
    console.error('Error creating invitation:', error)
    
    const errorMessage = error instanceof Error && 'errors' in error 
      ? (error as { errors?: Array<{ message: string }> }).errors?.[0]?.message 
      : 'Failed to send invitation'
    
    return NextResponse.json({ 
      error: errorMessage
    }, { status: 500 })
  }
}
