"use client"

import React, { useState, useEffect } from "react"
import { EnhancedChatInterface } from "@/components/chat/enhanced-chat-interface"
import { cn } from "@/lib/utils"
import { MobileRightMenu } from "@/components/mobile-right-menu"

export function FloatingChat() {
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

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      {/* Mobile Right Menu Button - Only show on mobile, positioned above chat */}
      {isMobile && (
        <MobileRightMenu 
          anchorClassName="fixed z-50" 
          chatContainerClassName={cn(
            "bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-white/10",
            isMobile ? "w-[90vw] max-w-[400px]" : "w-[600px] max-w-[90vw]"
          )}
        />
      )}

      {/* Glassmorphic Floating Chat Interface */}
      <div 
        id="chat-container"
        className={cn(
          "bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-white/10",
          isMobile ? "w-[90vw] max-w-[400px] h-[500px]" : "w-[600px] max-w-[90vw] h-[600px]"
        )}
      >
        <EnhancedChatInterface 
          isFloating={true}
          showSidebar={false}
          className="h-full"
        />
      </div>
    </div>
  )
}