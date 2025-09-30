"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ChatSidebar } from "@/components/chat/chat-sidebar"

export default function HistoryPage() {
  const [currentView, setCurrentView] = useState<'ask' | 'uploads' | 'history'>('history')

  return (
    <div className="flex h-screen bg-background">
      {/* Chat Sidebar - Fixed positioned to touch header, footer, and left global menu */}
      <ChatSidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Chat Area - Full height, with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        <ChatInterface 
          currentView={currentView}
          sidebarCollapsed={false}
        />
      </div>
    </div>
  )
}
