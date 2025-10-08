"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  FileTextIcon,
  ClockIcon,
  MagnifyingGlassIcon
} from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Mock conversation data
const mockConversations = [
  {
    id: "1",
    title: "APD Document Analysis",
    lastMessage: "I've analyzed the APD document and identified key sections...",
    timestamp: new Date("2025-01-01T10:30:00"),
    messageCount: 12,
    isActive: false
  },
  {
    id: "2", 
    title: "RFP Requirements Review",
    lastMessage: "Based on the requirements, here are my recommendations...",
    timestamp: new Date("2025-01-01T09:15:00"),
    messageCount: 8,
    isActive: true
  },
  {
    id: "3",
    title: "Technical Architecture Discussion", 
    lastMessage: "The proposed architecture meets all security requirements...",
    timestamp: new Date("2025-01-01T08:45:00"),
    messageCount: 15,
    isActive: false
  }
]

export default function HistoryPage() {
  const [currentView, setCurrentView] = useState<'ask' | 'uploads' | 'history'>('history')
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile/tablet to adjust layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Chat Sidebar - Fixed positioned to touch header, footer, and left global menu */}
      <ChatSidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main History Area - Full height, with responsive left margin */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        isMobile ? "ml-0" : "ml-64"
      )}>
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Chat History</h1>
              <p className="text-muted-foreground">Review your previous conversations</p>
            </div>
            <Badge variant="outline" className="flex items-center space-x-1">
              <ClockIcon className="w-3 h-3" />
              <span>Last 30 days</span>
            </Badge>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {mockConversations.map((conversation) => (
              <Card key={conversation.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                        <FileTextIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{conversation.title}</h3>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {conversation.messageCount} messages
                          </Badge>
                          <span>{conversation.timestamp.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
