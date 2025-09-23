"use client"

import { useAuth } from "@clerk/nextjs"
import { ReactNode } from "react"

interface AuthWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  const { isLoaded } = useAuth()
  
  if (!isLoaded) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}
