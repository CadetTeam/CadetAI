"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleIcon,
  UploadIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

interface ChatThread {
  id: string
  title: string
  preview: string
  timestamp: Date
  messageCount: number
}

interface ChatSidebarProps {
  collapsed: boolean
  onToggle: () => void
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

export function ChatSidebar({ collapsed, onToggle, currentView, onViewChange }: ChatSidebarProps) {
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(mockChatThreads)

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

  const handleNewChat = () => {
    const newChat: ChatThread = {
      id: Date.now().toString(),
      title: "New Chat",
      preview: "Start a new conversation with Cadet...",
      timestamp: new Date(),
      messageCount: 0
    }
    setChatThreads(prev => [newChat, ...prev])
    onViewChange('ask')
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className="font-semibold text-foreground">Cadet</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 w-6 p-0"
          >
            {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              collapsed ? "px-2" : "px-3",
              currentView === item.id && "bg-accent text-accent-foreground"
            )}
            onClick={() => onViewChange(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-4 w-4" />
            {!collapsed && (
              <div className="ml-3 text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            )}
          </Button>
        ))}
      </div>

      <Separator />

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          className={cn(
            "w-full",
            collapsed ? "px-2" : "px-3"
          )}
          title={collapsed ? "New Chat" : undefined}
        >
          <PlusIcon className="h-4 w-4" />
          {!collapsed && <span className="ml-2">New Chat</span>}
        </Button>
      </div>

      <Separator />

      {/* Chat History */}
      {currentView === 'history' && (
        <div className="flex-1 overflow-hidden">
          <div className="p-4">
            {!collapsed && (
              <h3 className="text-sm font-semibold text-foreground mb-3">Recent Chats</h3>
            )}
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2">
              {chatThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={cn(
                    "group p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                    collapsed && "p-2"
                  )}
                  title={collapsed ? thread.title : undefined}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {!collapsed && (
                        <>
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
                        </>
                      )}
                      {collapsed && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    {!collapsed && (
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Uploads View */}
      {currentView === 'uploads' && (
        <div className="flex-1 overflow-hidden">
          <div className="p-4">
            {!collapsed && (
              <h3 className="text-sm font-semibold text-foreground mb-3">Your Files</h3>
            )}
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="text-center py-8">
              <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              {!collapsed && (
                <>
                  <p className="text-sm text-muted-foreground mb-2">No files uploaded yet</p>
                  <p className="text-xs text-muted-foreground">
                    Upload documents, images, and files to chat with Cadet
                  </p>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
