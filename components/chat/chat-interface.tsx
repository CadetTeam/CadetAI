"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { UploadsView } from "@/components/chat/uploads-view"
import { 
  PaperPlaneIcon,
  UploadIcon,
  CopyIcon,
  ReloadIcon,
  FileTextIcon,
  GlobeIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import libreChatClient from "@/lib/librechat"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
  attachments?: File[]
  browsingLinks?: string[]
  formattedContent?: boolean
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
  const [showAttachmentPopover, setShowAttachmentPopover] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const attachmentRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

    // Simulate browsing links like Grok
    const browsingLinks = [
      "https://it.nc.gov/resources/statewide-it-procurement/it-procurement-forms-templates",
      "https://www.dau.edu/sites/default/files/Migrated/CopDocuments/Sample-RFP-Sections-L-M"
    ]

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      browsingLinks: browsingLinks,
      isTyping: true
    }

    setMessages(prev => [...prev, assistantMessage])

    try {
      // Use the real Perplexity integration
      const response = await libreChatClient.sendMessage(userMessage.content)
      
      // Update the assistant message with the response
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? {
              ...msg,
              content: response.content,
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
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
                <div className="relative flex items-center bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-3 h-14">
                  {/* Attachment Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0 mr-3 text-gray-600 dark:text-white hover:bg-white/10 dark:hover:bg-white/10"
                    title="Upload files"
                    onClick={() => setShowAttachmentPopover(!showAttachmentPopover)}
                  >
                    <UploadIcon className="h-4 w-4 text-gray-600 dark:text-white" />
                  </Button>
                  
                  {/* Growing Textarea */}
                  <Textarea
                    ref={textareaRef}
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
                    className="flex-1 min-h-[32px] bg-transparent resize-none text-base border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ease-in-out"
                    disabled={isLoading}
                    style={{ 
                      height: '32px',
                      overflowY: 'hidden'
                    }}
                  />
                  
                  {/* Send Button */}
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="h-8 w-8 p-0 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 flex-shrink-0 ml-3"
                  >
                    <PaperPlaneIcon className="h-4 w-4 text-white" />
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
                {/* Browsing Links Display */}
                {message.browsingLinks && message.browsingLinks.length > 0 && (
                  <div className="mb-3 p-3 bg-white/5 dark:bg-black/5 rounded-lg border border-white/10 dark:border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
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
                )}

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
                  ) : message.formattedContent ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
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
              {/* Attachment Button with Popover */}
              <div className="relative">
                <Button
                  ref={attachmentRef}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 flex-shrink-0 mr-3 text-gray-600 dark:text-white hover:bg-white/10 dark:hover:bg-white/10"
                  title="Upload files"
                  onClick={() => setShowAttachmentPopover(!showAttachmentPopover)}
                >
                  <UploadIcon className="h-4 w-4 text-gray-600 dark:text-white" />
                </Button>

              {/* Attachment Menu Popover */}
              {showAttachmentPopover && (
                <Card 
                  ref={popoverRef}
                  className="absolute bottom-full left-0 mb-2 w-56 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-2xl z-50"
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

                      {/* View Recent */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-3 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg text-white"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <FileTextIcon className="h-4 w-4 text-white" />
                          <span className="text-sm font-medium">View Recent</span>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Growing Textarea */}
            <Textarea
              ref={textareaRef}
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
              className="flex-1 min-h-[32px] bg-transparent resize-none text-base border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ease-in-out"
              disabled={isLoading}
              style={{ 
                height: '32px',
                overflowY: 'hidden'
              }}
            />
            
            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-8 w-8 p-0 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 flex-shrink-0 ml-3"
            >
              <PaperPlaneIcon className="h-4 w-4 text-white" />
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
