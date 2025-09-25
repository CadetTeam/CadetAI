"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UploadsView } from "@/components/chat/uploads-view"
import { 
  PaperPlaneIcon,
  UploadIcon,
  StopIcon,
  MixerHorizontalIcon,
  CopyIcon,
  UpdateIcon,
  ReloadIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

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

    // Simulate AI response with OSS120B model
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${userMessage.content}". As Cadet, I'm here to help you with APD documents, compliance analysis, and team collaboration. Let me provide you with a comprehensive response based on the OSS120B model's analysis capabilities.

This is a simulated response from the OSS120B model. In a real implementation, this would connect to OpenAI and Perplexity APIs to provide accurate, contextual responses based on your specific needs.

Would you like me to elaborate on any particular aspect of your question?`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
      setIsTyping(false)
    }, 2000)
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Cadet Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl mb-6 shadow-lg">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Cadet
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Your AI assistant for APD documents and compliance
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <Badge variant="outline" className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>OSS120B Model</span>
            </Badge>
            <Badge variant="outline">OpenAI + Perplexity</Badge>
          </div>
        </div>

        {/* Chat Input - Centered */}
        <div className="w-full max-w-2xl">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What do you want to know about your APD documents?"
              className="min-h-[60px] resize-none pr-12 text-base"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Upload files"
              >
                <UploadIcon className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-8 w-8 p-0 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                <PaperPlaneIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>

        {/* Suggested Prompts */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {[
            "Analyze this compliance document",
            "Help me set up team permissions",
            "Review this APD workflow",
            "Explain security best practices"
          ].map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 text-left justify-start hover:bg-accent"
              onClick={() => setInputValue(prompt)}
            >
              <div>
                <div className="font-medium">{prompt}</div>
              </div>
            </Button>
          ))}
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
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Cadet..."
              className="min-h-[60px] resize-none pr-24 text-base"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              {isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStopGeneration}
                  className="h-8 w-8 p-0"
                  title="Stop generation"
                >
                  <StopIcon className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Upload files"
              >
                <UploadIcon className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-8 w-8 p-0 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                <PaperPlaneIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Cadet can make mistakes. Check important information.
          </p>
        </div>
      </div>
    </div>
  )
}
