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
  GlobeIcon
} from "@radix-ui/react-icons"

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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Simulate browsing links like Grok
    const links = [
      "https://it.nc.gov/resources/statewide-it-procurement/it-procurement-forms-templates",
      "https://www.dau.edu/sites/default/files/Migrated/CopDocuments/Sample-RFP-Sections-L-M"
    ]
    
    setBrowsingLinks(links)
    
    // Simulate browsing time
    setTimeout(() => {
      setBrowsingLinks([])
    }, 3000)

    setInputValue("")
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

      {/* Browsing Links Display */}
      {browsingLinks.length > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-md pointer-events-auto">
          <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-2xl">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Planning document creation</span>
                </div>
                
                {browsingLinks.map((link, index) => (
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
        </div>
      )}
    </div>
  )
}