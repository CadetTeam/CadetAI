import { NextRequest, NextResponse } from 'next/server'
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({
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
    })

    console.log('User created successfully:', user.id)
    return NextResponse.json({ message: 'User created successfully', userId: user.id })
  } catch (error: unknown) {
    console.error('Error creating user via admin API:', error)
    const errorMessage = error instanceof Error && 'errors' in error 
      ? (error as { errors?: Array<{ message: string }> }).errors?.[0]?.message 
      : 'Failed to create user'
    return NextResponse.json({ 
      error: errorMessage
    }, { status: 500 })
  }
}


