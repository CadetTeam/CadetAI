"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ChatBubbleIcon, 
  Cross2Icon, 
  PaperPlaneIcon,
  UpdateIcon,
  PersonIcon,
  PlusIcon
} from "@radix-ui/react-icons"

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement chat functionality
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
      {!isOpen ? (
        // Floating Chat Button
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg border border-gray-300 dark:border-gray-600"
          size="lg"
        >
          <ChatBubbleIcon className="h-6 w-6 text-white" />
        </Button>
      ) : (
        // Chat Interface
        <Card className="w-96 shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Chat with Cadet
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Cross2Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Chat Messages Area */}
            <div className="h-64 overflow-y-auto space-y-3 pr-2">
              {/* Welcome Message */}
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 max-w-[80%]">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    Hey there! I&apos;m Cadet, your AI assistant. How can I help you today?
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="space-y-3">
              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Voice input"
                  >
                    <UpdateIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Attach file"
                  >
                    <PersonIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="New conversation"
                  >
                    <PlusIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                >
                  <PaperPlaneIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
