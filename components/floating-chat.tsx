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
        <div className="h-full flex flex-col">
          {/* Simple Chat Interface */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl mb-4 shadow-lg">
                <span className="text-white text-xl font-bold">C</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Cadet
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your AI assistant for APD documents
              </p>
            </div>
            
            {/* Simple Input */}
            <div className="w-full max-w-md">
              <div className="relative">
                <textarea
                  placeholder="Ask Cadet anything..."
                  className="w-full min-h-[50px] px-4 py-3 pr-12 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-white/20"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                />
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}