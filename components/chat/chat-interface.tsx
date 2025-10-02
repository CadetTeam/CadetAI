"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UploadsView } from "@/components/chat/uploads-view"
import { 
  PaperPlaneIcon,
  UploadIcon,
  StopIcon,
  CopyIcon,
  ReloadIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import libreChatClient from "@/lib/librechat"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
  attachments?: File[]
}

interface ChatInterfaceProps {
  currentView: 'ask' | 'uploads' | 'history'
  sidebarCollapsed: boolean
}

export function ChatInterface({ currentView, sidebarCollapsed }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Use the real Perplexity integration
      const response = await libreChatClient.sendMessage(userMessage.content)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleStopGeneration = () => {
    setIsLoading(false)
    setIsTyping(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Uploads view
  if (currentView === 'uploads') {
    return <UploadsView collapsed={sidebarCollapsed} />
  }

  // Empty state for Ask view
  if (currentView === 'ask' && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Compact Chat Input */}
        <div className="w-full max-w-2xl">
          <div className="relative flex items-end bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-3">
            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 flex-shrink-0 mr-3"
              title="Upload files"
            >
              <UploadIcon className="h-4 w-4" />
            </Button>
            
            {/* Growing Textarea */}
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
              onKeyPress={handleKeyPress}
              placeholder="Ask Cadet anything..."
              className="flex-1 min-h-[20px] max-h-[120px] bg-transparent resize-none text-base border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading}
              style={{ 
                height: 'auto',
                overflow: 'hidden'
              }}
            />
            
            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-8 w-8 p-0 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 flex-shrink-0 ml-3"
            >
              <PaperPlaneIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Chat interface with messages
  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-sm font-bold">
                    C
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] space-y-2",
                  message.role === 'user' ? "flex flex-col items-end" : ""
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm",
                    message.role === 'user'
                      ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.isTyping ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span>Cadet is thinking...</span>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                </div>
                
                {message.role === 'assistant' && !message.isTyping && (
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(message.content)}
                    >
                      <CopyIcon className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ReloadIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {message.role === 'user' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    U
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-sm font-bold">
                  C
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>Cadet is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-3">
            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 flex-shrink-0 mr-3"
              title="Upload files"
            >
              <UploadIcon className="h-4 w-4" />
            </Button>
            
            {/* Growing Textarea */}
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
              onKeyPress={handleKeyPress}
              placeholder="Message Cadet..."
              className="flex-1 min-h-[20px] max-h-[120px] bg-transparent resize-none text-base border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading}
              style={{ 
                height: 'auto',
                overflow: 'hidden'
              }}
            />
            
            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-8 w-8 p-0 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 flex-shrink-0 ml-3"
            >
              <PaperPlaneIcon className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Cadet can make mistakes. Check important information.
          </p>
        </div>
      </div>
    </div>
  )
}
