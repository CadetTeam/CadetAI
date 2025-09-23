"use client"

import { useAuth } from "@clerk/nextjs"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { RightSidebar } from "./right-sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isSignedIn } = useAuth()

  // Show marketing page for unauthenticated users
  if (!isSignedIn) {
    return <>{children}</>
  }

  // Show app layout for authenticated users
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <AppSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AppHeader />
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
          
          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
