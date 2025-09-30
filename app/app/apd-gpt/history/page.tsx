"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { cn } from "@/lib/utils"

export default function HistoryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState<'ask' | 'uploads' | 'history'>('history')

  return (
    <div className="flex h-screen bg-background">
      {/* Chat Sidebar - Fixed positioned to touch header, footer, and left global menu */}
      <ChatSidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Chat Area - Full height, with left margin to account for fixed sidebar */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <ChatInterface 
          currentView={currentView}
          sidebarCollapsed={sidebarCollapsed}
        />
      </div>
    </div>
  )
}
