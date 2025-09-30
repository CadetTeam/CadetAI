"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  PaperPlaneIcon,
  UploadIcon,
  StopIcon,
  CopyIcon,
  ReloadIcon,
  Cross2Icon,
  EyeOpenIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { MobileRightMenu } from "@/components/mobile-right-menu"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
  attachments?: FileAttachment[]
}

interface FileAttachment {
  id: string
  file: File
  name: string
  size: number
  type: string
}

export function FloatingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [showFilePreview, setShowFilePreview] = useState<FileAttachment | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newAttachments = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }))
    setAttachments(prev => [...prev, ...newAttachments])
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSendMessage = async () => {
    if ((inputMessage.trim() === "" && attachments.length === 0) || isSending) return

    setIsSending(true)
    const newUserMessage: Message = {
      id: `msg-${messages.length + 1}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      attachments: attachments
    }
    setMessages((prev) => [...prev, newUserMessage])
    setInputMessage("")
    setAttachments([])

    // Simulate AI response
    const aiResponseContent = `I received your message${inputMessage ? `: "${inputMessage}"` : ''}${attachments.length > 0 ? ` with ${attachments.length} file(s)` : ''}. I'm Cadet, your AI assistant. How else can I help you today?`
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

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      {/* Mobile Right Menu Button - Only show on mobile, positioned near chat */}
      {isMobile && (
        <MobileRightMenu anchorClassName="fixed bottom-[24px] left-[calc(50%+340px)] -translate-x-1/2 z-50" />
      )}

      {/* Glassmorphic Floating Chat Interface */}
      <div className={cn(
        "bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-white/10",
        isMobile ? "w-[90vw] max-w-[400px]" : "w-[600px] max-w-[90vw]"
      )}>
        {/* Messages Area */}
        {messages.length > 0 && (
          <ScrollArea className="max-h-[400px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex items-start space-x-3",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">C</span>
                    </div>
                  )}
                  <div className={cn(
                    "rounded-xl px-4 py-3 max-w-[80%]",
                    message.role === 'user' 
                      ? "bg-blue-600/90 text-white rounded-br-none" 
                      : "bg-white/20 dark:bg-white/10 text-foreground rounded-bl-none backdrop-blur-sm"
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
                    
                    {/* File Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center space-x-2 bg-white/20 dark:bg-white/10 rounded-lg px-3 py-1 text-xs"
                          >
                            <span className="truncate max-w-[120px]">{attachment.name}</span>
                            <span className="text-muted-foreground">({formatFileSize(attachment.size)})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'assistant' && !message.isTyping && (
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <CopyIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30">
                        <ReloadIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {message.role === 'user' && (
                    <Avatar className="flex-shrink-0 h-8 w-8">
                      <AvatarFallback className="text-xs">ME</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}

        {/* File Preview Modal */}
        {showFilePreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">{showFilePreview.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilePreview(null)}
                  className="h-6 w-6 p-0"
                >
                  <Cross2Icon className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                {showFilePreview.type.startsWith('image/') ? (
                  <Image
                    src={URL.createObjectURL(showFilePreview.file)}
                    alt={showFilePreview.name}
                    width={800}
                    height={600}
                    className="max-w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="text-center py-8">
                    <EyeOpenIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Preview not available for this file type</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {showFilePreview.name} ({formatFileSize(showFilePreview.size)})
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4">
          {/* File Attachments */}
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center space-x-2 bg-white/20 dark:bg-white/10 rounded-lg px-3 py-2 text-sm"
                >
                  <span className="truncate max-w-[150px]">{attachment.name}</span>
                  <span className="text-xs text-muted-foreground">({formatFileSize(attachment.size)})</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(attachment.id)}
                    className="h-4 w-4 p-0 hover:bg-white/30"
                  >
                    <Cross2Icon className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilePreview(attachment)}
                    className="h-4 w-4 p-0 hover:bg-white/30"
                  >
                    <EyeOpenIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-end space-x-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 w-10 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              <UploadIcon className="h-4 w-4" />
            </Button>
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Cadet anything..."
              className="flex-1 resize-none border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-sm focus:ring-2 focus:ring-white/30 dark:focus:ring-white/20 text-foreground placeholder:text-muted-foreground min-h-[40px] max-h-32"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && attachments.length === 0) || isSending}
              className="h-10 w-10 p-0 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white"
            >
              {isSending ? <StopIcon className="h-4 w-4 animate-pulse" /> : <PaperPlaneIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}