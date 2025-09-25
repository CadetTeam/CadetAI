"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  ChatBubbleIcon,
  PaperPlaneIcon,
  UploadIcon,
  StopIcon,
  CopyIcon,
  ReloadIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

export function FloatingChat() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isSending) return

    setIsSending(true)
    const newUserMessage: Message = {
      id: `msg-${messages.length + 1}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])
    setInputMessage("")

    // Simulate AI response
    const aiResponseContent = `Hello! You asked: "${inputMessage}". I'm Cadet, your AI assistant. How else can I help you today?`
    const aiTypingMessage: Message = {
      id: `msg-${messages.length + 2}`,
      role: 'assistant',
      content: '...',
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, aiTypingMessage])

    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay

    setMessages((prev) => 
      prev.map((msg) => 
        msg.id === aiTypingMessage.id ? { ...msg, content: aiResponseContent, isTyping: false } : msg
      )
    )
    setIsSending(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      {/* Expanded Chat Interface */}
      {isExpanded && (
        <div className="w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-border mb-4 max-h-[50vh] flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Chat with Cadet</h3>
                <p className="text-xs text-muted-foreground">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500 text-white text-xs">
                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                Online
              </Badge>
              <Button variant="ghost" size="sm" onClick={toggleExpanded} className="h-6 w-6 p-0">
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 min-h-0">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-lg font-bold">C</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Start a conversation with Cadet</p>
                </div>
              )}
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex items-start space-x-3",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">C</span>
                    </div>
                  )}
                  <div className={cn(
                    "rounded-lg px-3 py-2 max-w-[80%]",
                    message.role === 'user' 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-muted text-foreground rounded-bl-none"
                  )}>
                    {message.isTyping ? (
                      <div className="flex items-center space-x-1">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse delay-100">.</span>
                        <span className="animate-pulse delay-200">.</span>
                      </div>
                    ) : (
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                  
                  {message.role === 'assistant' && !message.isTyping && (
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <CopyIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                        <ReloadIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {message.role === 'user' && (
                    <Avatar className="flex-shrink-0 h-6 w-6">
                      <AvatarFallback className="text-xs">ME</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex items-end space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <UploadIcon className="h-4 w-4" />
              </Button>
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 min-h-[40px] max-h-32"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isSending}
                className="h-8 w-8 p-0 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white"
              >
                {isSending ? <StopIcon className="h-4 w-4 animate-pulse" /> : <PaperPlaneIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <Button
        className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 transition-all duration-200 group"
        onClick={toggleExpanded}
        title="Chat with Cadet"
      >
        <ChatBubbleIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        {isExpanded && <ChevronUpIcon className="h-4 w-4 text-white absolute -top-1" />}
      </Button>
    </div>
  )
}