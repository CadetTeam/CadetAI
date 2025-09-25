import { NextRequest, NextResponse } from 'next/server'
import { ClerkAPI } from '@clerk/backend'

const clerk = ClerkAPI({
  secretKey: process.env.CLERK_SECRET_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json()
    
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Creating user via admin API:', { email, firstName, lastName })

    const user = await clerk.users.createUser({
      emailAddress: [email],
      password: password,
      firstName: firstName,
      lastName: lastName,
      skipPasswordChecks: true,
      emailVerified: true, // Skip email verification for admin-created users
    })

    console.log('User created successfully:', user.id)
    return NextResponse.json({ message: 'User created successfully', userId: user.id })
  } catch (error: any) {
    console.error('Error creating user via admin API:', error)
    return NextResponse.json({ 
      error: error.errors?.[0]?.message || 'Failed to create user' 
    }, { status: 500 })
  }
}


