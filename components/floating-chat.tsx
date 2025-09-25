"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChatBubbleIcon
} from "@radix-ui/react-icons"

export function FloatingChat() {
  const router = useRouter()

  const handleOpenChat = () => {
    // Navigate to the full chat page
    router.push('/app/chat')
  }

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <Button
        className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 transition-all duration-200 group"
        onClick={handleOpenChat}
        title="Chat with Cadet"
      >
        <ChatBubbleIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </Button>
      
      {/* Chat Status Indicator */}
      <div className="absolute -top-2 -right-2">
        <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
          Cadet
        </Badge>
      </div>
    </div>
  )
}