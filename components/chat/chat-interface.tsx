"use client"

import { EnhancedChatInterface } from "@/components/chat/enhanced-chat-interface"
import { UploadsView } from "@/components/chat/uploads-view"

interface ChatInterfaceProps {
  currentView: 'ask' | 'uploads' | 'history'
  sidebarCollapsed: boolean
}

export function ChatInterface({ currentView, sidebarCollapsed }: ChatInterfaceProps) {
  // Uploads view
  if (currentView === 'uploads') {
    return <UploadsView collapsed={sidebarCollapsed} />
  }

  // Use enhanced chat interface for ask and history views
  return (
    <EnhancedChatInterface 
      showSidebar={!sidebarCollapsed}
      className="flex-1"
    />
  )
}
