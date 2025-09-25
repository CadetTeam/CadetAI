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
      {/* Chat Sidebar - Full height, no gaps */}
      <div className={cn(
        "border-r border-border bg-sidebar transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <ChatSidebar 
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>

      {/* Main Chat Area - Full height, no gaps */}
      <div className="flex-1 flex flex-col">
        <ChatInterface 
          currentView={currentView}
          sidebarCollapsed={sidebarCollapsed}
        />
      </div>
    </div>
  )
}
