"use client"

import React, { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MobileRightMenu } from "@/components/mobile-right-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  UploadIcon,
  FileTextIcon,
  PaperPlaneIcon,
  GlobeIcon,
  CopyIcon,
  ReloadIcon
} from "@radix-ui/react-icons"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface RecentFile {
  id: string
  name: string
  type: string
  size: string
  thumbnail?: string
  lastAccessed: Date
}

export function FloatingChat() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [showAttachmentPopover, setShowAttachmentPopover] = useState(false)
  const [showRecentPopover, setShowRecentPopover] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [browsingLinks, setBrowsingLinks] = useState<string[]>([])
  
  // Check if we're on the history page
  const isHistoryPage = pathname === '/app/history'
  const [recentFiles] = useState<RecentFile[]>([
    {
      id: "1",
      name: "Screenshot 2025-09-23 at 1.50...",
      type: "image",
      size: "2.3 MB",
      lastAccessed: new Date("2025-09-23T01:50:00")
    },
    {
      id: "2", 
      name: "Screenshot 2025-09-23 at 1.49...",
      type: "image",
      size: "1.8 MB",
      lastAccessed: new Date("2025-09-23T01:49:00")
    },
    {
      id: "3",
      name: "PitchGEN 1.png",
      type: "image",
      size: "3.1 MB",
      lastAccessed: new Date("2025-09-22T15:30:00")
    },
    {
      id: "4",
      name: "PitchGEN 2.png", 
      type: "image",
      size: "2.9 MB",
      lastAccessed: new Date("2025-09-22T15:25:00")
    },
    {
      id: "5",
      name: "PitchGEN 3.png",
      type: "image", 
      size: "3.2 MB",
      lastAccessed: new Date("2025-09-22T15:20:00")
    }
  ])

  const popoverRef = useRef<HTMLDivElement>(null)
  const attachmentRef = useRef<HTMLButtonElement>(null)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        attachmentRef.current &&
        !attachmentRef.current.contains(event.target as Node)
      ) {
        setShowAttachmentPopover(false)
        setShowRecentPopover(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [messages, setMessages] = useState<Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    isTyping?: boolean
    browsingLinks?: string[]
    formattedContent?: boolean
  }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate browsing links like Grok
    const browsingLinks = [
      "https://it.nc.gov/resources/statewide-it-procurement/it-procurement-forms-templates",
      "https://www.dau.edu/sites/default/files/Migrated/CopDocuments/Sample-RFP-Sections-L-M"
    ]

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: '',
      timestamp: new Date(),
      browsingLinks: browsingLinks,
      isTyping: true
    }

    setMessages(prev => [...prev, assistantMessage])

    try {
      // Simulate API call with Perplexity
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update with response
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? {
              ...msg,
              content: `# Architecture Planning Document for Government RFP Development

This document provides a comprehensive template for an Architecture Planning Document tailored for government use, specifically to inform the development of a Request for Proposal (RFP).

## 1. About This Document

### 1.1 Purpose
Define the role of this Architecture Planning Document in enabling government business plans through systematic IT architecture assessment and planning.

### 1.2 Scope
This document covers the complete architecture planning lifecycle for government RFP development, including:
- Current state assessment
- Future state definition  
- Gap analysis
- Technology roadmap
- Compliance requirements`,
              browsingLinks: undefined,
              isTyping: false,
              formattedContent: true
            }
          : msg
      ))
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? {
              ...msg,
              content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
              browsingLinks: undefined,
              isTyping: false
            }
          : msg
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileTextIcon className="w-4 h-4" />
      default:
        return <FileTextIcon className="w-4 h-4" />
    }
  }

  const getFileThumbnail = (file: RecentFile) => {
    if (file.thumbnail) {
      return <img src={file.thumbnail} alt={file.name} className="w-8 h-8 rounded object-cover" />
    }
    return (
      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
        {getFileIcon(file.type)}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Mobile Right Menu Button - Only show on mobile */}
      {isMobile && (
        <MobileRightMenu 
          anchorClassName="fixed z-50 pointer-events-auto" 
          chatContainerClassName={cn(
            "bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-white/10",
            isMobile ? "w-[90vw] max-w-[400px]" : "w-[600px] max-w-[90vw]"
          )}
        />
      )}

      {/* Messages Waterfall */}
      {messages.length > 0 && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none max-w-4xl w-full mx-4">
          <ScrollArea className="max-h-96">
            <div className="space-y-4 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 pointer-events-auto",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xs font-bold">
                        C
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={cn(
                    "max-w-[80%] space-y-2",
                    message.role === 'user' ? "flex flex-col items-end" : ""
                  )}>
                    {/* Browsing Links Display */}
                    {message.browsingLinks && message.browsingLinks.length > 0 && (
                      <Card className="bg-white/5 dark:bg-black/5 backdrop-blur-md border border-white/10 dark:border-white/10">
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-semibold">Planning document creation</span>
                            </div>
                            {message.browsingLinks.map((link, index) => (
                              <div key={index} className="flex items-center space-x-3 p-2 bg-white/5 dark:bg-black/5 rounded-lg">
                                <GlobeIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-xs text-muted-foreground truncate">
                                  Browsing <code className="bg-white/10 dark:bg-black/10 px-1 rounded">{link}</code>
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card className={cn(
                      "p-3 text-sm",
                      message.role === 'user'
                        ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white"
                        : "bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10"
                    )}>
                      <CardContent className="p-0">
                        {message.isTyping ? (
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span>Cadet is thinking...</span>
                          </div>
                        ) : message.formattedContent ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                      </CardContent>
                    </Card>

                    {message.role === 'assistant' && !message.isTyping && (
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 pointer-events-auto"
                          onClick={() => navigator.clipboard.writeText(message.content)}
                        >
                          <CopyIcon className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 pointer-events-auto">
                          <ReloadIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        U
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Enhanced Compact Floating Chat Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className={cn(
          "relative flex items-center bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-3 mx-4 h-14",
          isHistoryPage ? "max-w-4xl w-full" : "max-w-2xl w-full"
        )}>
          {/* Attachment Button with Popover */}
          <div className="relative">
            <Button
              ref={attachmentRef}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 flex-shrink-0 mr-3 pointer-events-auto text-gray-600 dark:text-white hover:bg-white/10 dark:hover:bg-white/10"
              onClick={() => setShowAttachmentPopover(!showAttachmentPopover)}
            >
              <UploadIcon className="h-4 w-4 text-gray-600 dark:text-white" />
            </Button>

            {/* Attachment Menu Popover */}
            {showAttachmentPopover && (
              <Card 
                ref={popoverRef}
                className="absolute bottom-full left-0 mb-2 w-56 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-2xl pointer-events-auto"
              >
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {/* Upload File */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg text-white"
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <UploadIcon className="h-4 w-4 text-white" />
                        <span className="text-sm font-medium">Upload any file</span>
                      </div>
                    </Button>

                    {/* Import File */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg text-white"
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <FileTextIcon className="h-4 w-4 text-white" />
                        <span className="text-sm font-medium">Import any file</span>
                      </div>
                    </Button>

                    {/* View Recent - with hover submenu */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-auto p-3 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg text-white"
                        onMouseEnter={() => setShowRecentPopover(true)}
                        onMouseLeave={() => setShowRecentPopover(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <FileTextIcon className="h-4 w-4 text-white" />
                          <span className="text-sm font-medium">View Recent</span>
                        </div>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>

                      {/* Recent Files Hover Submenu */}
                      {showRecentPopover && (
                        <Card className="absolute left-full top-0 ml-1 w-72 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-2xl">
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold text-white mb-3">Recent Files</h3>
                              <ScrollArea className="h-64">
                                <div className="space-y-2">
                                  {recentFiles.map((file) => (
                                    <Button
                                      key={file.id}
                                      variant="ghost"
                                      className="w-full justify-start h-auto p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg text-white"
                                    >
                                      <div className="flex items-center space-x-3 w-full">
                                        {getFileThumbnail(file)}
                                        <div className="flex-1 min-w-0 text-left">
                                          <p className="text-sm font-medium truncate">{file.name}</p>
                                          <p className="text-xs text-gray-400">{file.size}</p>
                                        </div>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Growing Textarea */}
          <textarea
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              // Calculate 60% of viewport height
              const maxHeight = window.innerHeight * 0.6;
              const newHeight = Math.min(target.scrollHeight, maxHeight);
              target.style.height = newHeight + 'px';
              
              // Show scrollbar if content exceeds max height
              if (target.scrollHeight > maxHeight) {
                target.style.overflowY = 'auto';
              } else {
                target.style.overflowY = 'hidden';
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="How can Cadet help?"
            className="flex-1 min-h-[32px] bg-transparent resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-base leading-6 px-3 py-2 transition-all duration-200 ease-in-out"
            style={{ 
              height: '32px',
              overflowY: 'hidden'
            }}
          />
          
          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="h-8 w-8 p-0 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 flex-shrink-0 ml-3 pointer-events-auto"
          >
            <PaperPlaneIcon className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

    </div>
  )
}