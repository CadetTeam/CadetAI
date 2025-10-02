"use client"

import React, { useState, useEffect } from "react"
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
        <div className="h-full flex flex-col items-center justify-center p-4">
          {/* Compact Floating Chat Bar */}
          <div className="w-full max-w-2xl">
            <div className="relative flex items-end bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-3">
              {/* Attachment Button */}
              <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              
              {/* Growing Textarea */}
              <textarea
                placeholder="Ask Cadet anything..."
                className="flex-1 min-h-[20px] max-h-[120px] bg-transparent resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm leading-5"
                style={{ 
                  height: 'auto',
                  overflow: 'hidden'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              
              {/* Send Button */}
              <button className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg flex items-center justify-center transition-colors ml-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}