"use client"

import { useAuth } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { RightSidebar } from "./right-sidebar"
import { FloatingChat } from "./floating-chat"
import { AppMenu } from "./app-menu"
import { useState } from "react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isSignedIn } = useAuth()
  const pathname = usePathname()
  const [currentApp, setCurrentApp] = useState("apdgpt")

  // Show marketing page for unauthenticated users
  if (!isSignedIn) {
    return <>{children}</>
  }

  // Determine if we're in an APDGPT app page
  const isAPDGPTApp = pathname.startsWith('/app') && 
    !pathname.startsWith('/app/security') && 
    !pathname.startsWith('/app/files') && 
    !pathname.startsWith('/app/keys') &&
    !pathname.startsWith('/app/chat')

  // Determine if we're on the home page
  const isHomePage = pathname === '/app'

  const handleAppChange = (appId: string) => {
    setCurrentApp(appId)
  }

  // Show app layout for authenticated users
  return (
    <div className="flex h-screen bg-background">
      {/* App Menu - Show on home page and non-APDGPT app pages */}
      {(isHomePage || !isAPDGPTApp) && (
        <AppMenu currentApp={currentApp} onAppChange={handleAppChange} />
      )}
      
      {/* Left Sidebar - Only show for APDGPT app pages */}
      {isAPDGPTApp && <AppSidebar />}
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden ${(isHomePage || !isAPDGPTApp) ? 'ml-12' : ''}`}>
        {/* Header */}
        <AppHeader />
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
          
          {/* Right Sidebar - Only show for APDGPT app pages */}
          {isAPDGPTApp && <RightSidebar />}
        </div>
      </div>
      
      {/* Floating Chat */}
      <FloatingChat />
    </div>
  )
}
