import { NextRequest, NextResponse } from 'next/server'
import { createClerkClient } from '@clerk/backend'
import { auth } from '@clerk/nextjs/server'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { name, slug } = await req.json()
    
    if (!name || !slug) {
      return NextResponse.json({ error: 'Organization name and slug are required' }, { status: 400 })
    }

    // Get the current user from the session
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    console.log('Creating organization:', { name, slug, userId })

    // Create organization using Clerk API
    const organization = await clerk.organizations.createOrganization({
      name: name,
      slug: slug,
      createdBy: userId
    })

    console.log('Organization created successfully:', organization.id)
    
    return NextResponse.json({ 
      success: true, 
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug
      }
    })
  } catch (error: unknown) {
    console.error('Error creating organization:', error)
    const errorMessage = error instanceof Error && 'errors' in error 
      ? (error as { errors?: Array<{ message: string }> }).errors?.[0]?.message 
      : error instanceof Error 
        ? error.message 
        : "Failed to create organization. Please try again."
    return NextResponse.json({ 
      error: errorMessage
    }, { status: 500 })
  }
}
