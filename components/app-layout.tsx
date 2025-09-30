"use client"

import { useAuth } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { RightSidebar } from "./right-sidebar"
import { FloatingChat } from "./floating-chat"
import { AppMenu } from "./app-menu"
import { MobileAppMenu } from "./mobile-app-menu"
import { useState, useEffect } from "react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isSignedIn } = useAuth()
  const pathname = usePathname()
  const [currentApp, setCurrentApp] = useState("apdgpt")
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show marketing page for unauthenticated users, auth pages, or landing page
  if (!isSignedIn || pathname.startsWith('/auth') || pathname === '/') {
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
      {/* Mobile App Menu - Only show on mobile */}
      {isMobile && (
        <MobileAppMenu currentApp={currentApp} onAppChange={handleAppChange} />
      )}

      {/* Desktop App Menu - Only show on desktop and home page */}
      {!isMobile && isHomePage && (
        <div className="z-30">
          <AppMenu currentApp={currentApp} onAppChange={handleAppChange} />
        </div>
      )}
      
      {/* Desktop Left Sidebar - Only show for APDGPT app pages on desktop */}
      {!isMobile && isAPDGPTApp && (
        <div className="z-30">
          <AppSidebar />
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden z-20">
        {/* Header */}
        <div className="z-30">
          <AppHeader />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto">
            {children}
          </main>
          
          {/* Desktop Right Sidebar - Only show for APDGPT app pages on desktop */}
          {!isMobile && isAPDGPTApp && (
            <div className="z-30">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
      
      {/* Floating Chat */}
      <FloatingChat />
    </div>
  )
}
