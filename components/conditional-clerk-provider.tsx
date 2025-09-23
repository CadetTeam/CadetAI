"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { ReactNode } from "react"

interface ConditionalClerkProviderProps {
  children: ReactNode
}

export function ConditionalClerkProvider({ children }: ConditionalClerkProviderProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // If no Clerk key is provided, render children without Clerk
  if (!publishableKey || publishableKey.includes('placeholder')) {
    return <>{children}</>
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  )
}
