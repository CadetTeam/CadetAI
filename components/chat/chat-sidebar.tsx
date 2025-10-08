"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ChatBubbleIcon,
  UploadIcon,
  ClockIcon,
  TrashIcon
} from "@radix-ui/react-icons"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatThread {
  id: string
  title: string
  preview: string
  timestamp: Date
  messageCount: number
}

interface ChatSidebarProps {
  currentView: 'ask' | 'uploads' | 'history'
  onViewChange: (view: 'ask' | 'uploads' | 'history') => void
}

// Mock chat threads data
const mockChatThreads: ChatThread[] = [
  {
    id: "1",
    title: "APD Document Analysis",
    preview: "Can you help me analyze this compliance document?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    messageCount: 12
  },
  {
    id: "2", 
    title: "Security Best Practices",
    preview: "What are the latest security protocols for...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messageCount: 8
  },
  {
    id: "3",
    title: "Team Collaboration Setup",
    preview: "How should I structure the team permissions?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messageCount: 15
  },
  {
    id: "4",
    title: "Code Review Process",
    preview: "Can you review this React component for...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    messageCount: 6
  },
  {
    id: "5",
    title: "Database Schema Design",
    preview: "I need help designing a scalable database...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    messageCount: 22
  }
]

export function ChatSidebar({ currentView, onViewChange }: ChatSidebarProps) {
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTabletOrBelow, setIsTabletOrBelow] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setChatThreads(mockChatThreads)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Check if tablet or below (matching app-layout breakpoint)
  useEffect(() => {
    const checkTabletOrBelow = () => {
      setIsTabletOrBelow(window.innerWidth < 1200) // Match app-layout breakpoint
    }
    
    checkTabletOrBelow()
    window.addEventListener('resize', checkTabletOrBelow)
    return () => window.removeEventListener('resize', checkTabletOrBelow)
  }, [])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }


  const handleDeleteChat = (chatId: string) => {
    setChatThreads(prev => prev.filter(chat => chat.id !== chatId))
  }

  const navItems = [
    {
      id: 'ask' as const,
      icon: ChatBubbleIcon,
      label: 'Ask',
      description: 'Chat with Cadet'
    },
    {
      id: 'uploads' as const,
      icon: UploadIcon,
      label: 'Uploads',
      description: 'Your files'
    },
    {
      id: 'history' as const,
      icon: ClockIcon,
      label: 'History',
      description: 'Chat history'
    }
  ]

  return (
    <>
      {/* Mobile drag tab */}
      {isTabletOrBelow && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-20 w-6 bg-background border border-border rounded-r-lg shadow-lg hover:bg-accent transition-all duration-200 ease-in-out"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      )}

      {/* Mobile backdrop */}
      {isTabletOrBelow && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0 duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex flex-col h-full bg-background border-r border-border z-30 transition-all duration-300 ease-in-out",
        isTabletOrBelow ? (
          isOpen ? "fixed left-0 top-16 bottom-0 w-64" : "fixed -left-64 top-16 bottom-0 w-64"
        ) : "fixed left-0 top-16 bottom-0 w-64"
      )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <span className="font-semibold text-foreground">Cadet</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start px-3",
              currentView === item.id && "bg-accent text-accent-foreground"
            )}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="h-4 w-4" />
            <div className="ml-3 text-left">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          </Button>
        ))}
      </div>


      {/* Chat History */}
      {currentView === 'history' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Title with fade overlay */}
          <div className="relative z-10">
            <div className="px-4 py-3 bg-background">
              <h3 className="text-sm font-semibold text-foreground">Recent Chats</h3>
            </div>
            {/* Fade overlay - starts 10px below title */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-2">
            {isLoading ? (
              // Loading State
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-3 rounded-lg border border-border">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-4/5 mb-2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : chatThreads.length === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">No chat history yet</p>
                <p className="text-xs text-muted-foreground">
                  Your conversations will appear here
                </p>
              </div>
            ) : (
              // Chat List
              <div className="space-y-2 pb-2">
                {chatThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className="group p-3 rounded-lg border border-border hover:bg-muted/70 dark:hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{thread.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {thread.preview}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(thread.timestamp)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {thread.messageCount} messages
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteChat(thread.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border bg-background p-3">
            <div className="flex items-center justify-center space-x-4">
              {/* Placeholder for future icons */}
              <div className="h-8 flex items-center justify-center text-xs text-muted-foreground">
                {/* Icons will be added here */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uploads View */}
      {currentView === 'uploads' && (
        <div className="flex-1 overflow-hidden">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Your Files</h3>
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="text-center py-8">
              <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">No files uploaded yet</p>
              <p className="text-xs text-muted-foreground">
                Upload documents, images, and files to chat with Cadet
              </p>
            </div>
          </ScrollArea>
        </div>
      )}
      </div>
    </>
  )
}
