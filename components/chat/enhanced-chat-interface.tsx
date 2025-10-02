"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { 
  PaperPlaneIcon,
  UploadIcon,
  StopIcon,
  CopyIcon,
  ReloadIcon,
  Cross2Icon,
  FileTextIcon,
  GlobeIcon,
  CheckIcon,
  DownloadIcon,
  ExternalLinkIcon,
  BookmarkIcon,
  Share2Icon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ArchiveIcon,
  SpeakerLoudIcon,
  Cross1Icon
} from "@radix-ui/react-icons"
import { Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import libreChatClient, { Conversation, ChatMessage } from "@/lib/librechat"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface FileAttachment {
  id: string
  file: File
  name: string
  size: number
  type: string
  preview?: string
  analysisStatus?: 'pending' | 'analyzing' | 'completed' | 'error'
  analysisResult?: string
}

interface LinkReference {
  id: string
  url: string
  title?: string
  description?: string
  status: 'pending' | 'analyzing' | 'completed' | 'error'
  analysisResult?: string
}

interface EnhancedMessage extends ChatMessage {
  attachments?: FileAttachment[]
  links?: LinkReference[]
  analysisType?: 'document' | 'web' | 'perplexity' | 'standard'
  processingSteps?: string[]
  currentStep?: string
}

interface EnhancedChatInterfaceProps {
  className?: string
  showSidebar?: boolean
  isFloating?: boolean
}

export function EnhancedChatInterface({ 
  className, 
  showSidebar = true
}: EnhancedChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<EnhancedMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = () => {
      const convos = libreChatClient.getConversations()
      setConversations(convos)
      
      if (convos.length > 0 && !currentConversation) {
        setCurrentConversation(convos[0])
        libreChatClient.setCurrentConversation(convos[0].id)
        setMessages(convos[0].messages as EnhancedMessage[])
      }
    }
    loadConversations()
  }, [currentConversation])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newAttachments: FileAttachment[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      analysisStatus: 'pending'
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

  const extractLinksFromText = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.match(urlRegex) || []
  }

  const analyzeDocument = async (attachment: FileAttachment): Promise<string> => {
    // Simulate document analysis with Perplexity
    await new Promise(resolve => setTimeout(resolve, 2000))
    return `Document analysis complete for ${attachment.name}. Key findings: This document contains important compliance information and regulatory requirements.`
  }

  const analyzeWebContent = async (url: string): Promise<string> => {
    // Simulate web content analysis with Perplexity
    await new Promise(resolve => setTimeout(resolve, 1500))
    return `Web content analysis complete for ${url}. Retrieved current information and relevant context.`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return

    const userMessage: EnhancedMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      attachments: [...attachments],
      links: extractLinksFromText(inputValue).map(url => ({
        id: Date.now().toString() + Math.random().toString(),
        url,
        status: 'pending' as const
      })),
      analysisType: attachments.length > 0 ? 'document' : 
                   extractLinksFromText(inputValue).length > 0 ? 'web' : 'standard'
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setAttachments([])
    setIsGenerating(true)

    // Create assistant message with processing steps
    const assistantMessage: EnhancedMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isGenerating: true,
      analysisType: userMessage.analysisType,
      processingSteps: [],
      currentStep: 'Initializing analysis...'
    }

    setMessages(prev => [...prev, assistantMessage])

    try {
      // Process attachments
      if (userMessage.attachments && userMessage.attachments.length > 0) {
        assistantMessage.processingSteps = ['Analyzing documents...', 'Extracting key information...', 'Generating insights...']
        
        for (let i = 0; i < userMessage.attachments.length; i++) {
          const attachment = userMessage.attachments[i]
          assistantMessage.currentStep = `Analyzing ${attachment.name}...`
          setMessages(prev => [...prev])
          
          const analysisResult = await analyzeDocument(attachment)
          attachment.analysisStatus = 'completed'
          attachment.analysisResult = analysisResult
        }
      }

      // Process links
      if (userMessage.links && userMessage.links.length > 0) {
        assistantMessage.processingSteps = [...(assistantMessage.processingSteps || []), 'Analyzing web content...', 'Retrieving current information...']
        
        for (let i = 0; i < userMessage.links.length; i++) {
          const link = userMessage.links[i]
          assistantMessage.currentStep = `Analyzing ${link.url}...`
          setMessages(prev => [...prev])
          
          const analysisResult = await analyzeWebContent(link.url)
          link.status = 'completed'
          link.analysisResult = analysisResult
        }
      }

      // Generate final response
      assistantMessage.currentStep = 'Generating comprehensive response...'
      setMessages(prev => [...prev])

      const response = await libreChatClient.sendMessage(
        inputValue + 
        (attachments.length > 0 ? `\n\nAttached files: ${attachments.map(a => a.name).join(', ')}` : '') +
        (userMessage.links?.length ? `\n\nReferenced links: ${userMessage.links.map(l => l.url).join(', ')}` : '')
      )

      // Update assistant message with final response
      assistantMessage.content = response.content
      assistantMessage.isGenerating = false
      assistantMessage.model = response.model
      assistantMessage.currentStep = undefined

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id ? assistantMessage : msg
      ))

      // Update conversation
      const updatedConversation = libreChatClient.getCurrentConversation()
      setCurrentConversation(updatedConversation)
      setConversations(libreChatClient.getConversations())

    } catch (error) {
      assistantMessage.error = error instanceof Error ? error.message : 'Unknown error'
      assistantMessage.isGenerating = false
      assistantMessage.currentStep = undefined
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id ? assistantMessage : msg
      ))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewConversation = () => {
    const newConversation = libreChatClient.createConversation()
    setCurrentConversation(newConversation)
    setConversations(libreChatClient.getConversations())
    setMessages([])
  }

  const handleSelectConversation = (conversationId: string) => {
    if (libreChatClient.setCurrentConversation(conversationId)) {
      const conversation = libreChatClient.getCurrentConversation()
      setCurrentConversation(conversation)
      setMessages(conversation?.messages as EnhancedMessage[] || [])
    }
  }

  const handleDeleteConversation = (conversationId: string) => {
    libreChatClient.deleteConversation(conversationId)
    setConversations(libreChatClient.getConversations())
    
    if (currentConversation?.id === conversationId) {
      const remaining = libreChatClient.getConversations()
      if (remaining.length > 0) {
        setCurrentConversation(remaining[0])
        libreChatClient.setCurrentConversation(remaining[0].id)
        setMessages(remaining[0].messages as EnhancedMessage[])
      } else {
        setCurrentConversation(null)
        setMessages([])
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredConversations = searchQuery
    ? libreChatClient.searchConversations(searchQuery)
    : conversations

  const renderProcessingIndicator = (message: EnhancedMessage) => {
    if (!message.isGenerating || !message.processingSteps) return null

    const currentStepIndex = message.processingSteps.findIndex(step => step === message.currentStep)
    const progress = message.processingSteps.length > 0 ? 
      ((currentStepIndex + 1) / message.processingSteps.length) * 100 : 0

    return (
      <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center space-x-2">
          <CheckIcon className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium">Processing with Perplexity AI</span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="space-y-1">
          {message.processingSteps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              {index <= currentStepIndex ? (
                <CheckIcon className="h-3 w-3 text-green-500" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
              )}
              <span className={cn(
                index <= currentStepIndex ? "text-green-600" : "text-muted-foreground"
              )}>
                {step}
              </span>
            </div>
          ))}
        </div>
        
        {message.currentStep && (
          <div className="text-xs text-muted-foreground animate-pulse">
            {message.currentStep}
          </div>
        )}
      </div>
    )
  }

  const renderAttachments = (message: EnhancedMessage) => {
    if (!message.attachments || message.attachments.length === 0) return null

    return (
      <div className="mt-3 space-y-2">
        {message.attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg">
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{attachment.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatFileSize(attachment.size)} • {attachment.type}
              </div>
            </div>
            {attachment.analysisStatus === 'completed' && (
              <Badge variant="secondary" className="text-xs">
                <CheckIcon className="h-3 w-3 mr-1" />
                Analyzed
              </Badge>
            )}
            {attachment.analysisStatus === 'analyzing' && (
              <Badge variant="outline" className="text-xs">
                <CheckIcon className="h-3 w-3 mr-1 animate-pulse" />
                Analyzing
              </Badge>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderLinks = (message: EnhancedMessage) => {
    if (!message.links || message.links.length === 0) return null

    return (
      <div className="mt-3 space-y-2">
        {message.links.map((link) => (
          <div key={link.id} className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg">
            <GlobeIcon className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate block"
              >
                {link.title || link.url}
              </a>
              <div className="text-xs text-muted-foreground">
                {link.description || 'Web content'}
              </div>
            </div>
            {link.status === 'completed' && (
              <Badge variant="secondary" className="text-xs">
                <CheckIcon className="h-3 w-3 mr-1" />
                Analyzed
              </Badge>
            )}
            {link.status === 'analyzing' && (
              <Badge variant="outline" className="text-xs">
                <CheckIcon className="h-3 w-3 mr-1 animate-pulse" />
                Analyzing
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => window.open(link.url, '_blank')}
            >
              <ExternalLinkIcon className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    )
  }

  const renderMessage = (message: EnhancedMessage) => {
    return (
      <div
        key={message.id}
        className={cn(
          "flex space-x-3 animate-in slide-in-from-bottom-2 duration-300",
          message.role === "user" ? "justify-end" : "justify-start"
        )}
      >
        {message.role === "assistant" && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-sm font-bold">
              C
            </AvatarFallback>
          </Avatar>
        )}
        
        <div
          className={cn(
            "max-w-[80%] space-y-2",
            message.role === "user" ? "flex flex-col items-end" : ""
          )}
        >
          <div
            className={cn(
              "rounded-lg px-4 py-3 text-sm",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            {message.isGenerating ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                  <span className="text-sm text-muted-foreground">CadetAI is thinking...</span>
                </div>
                {renderProcessingIndicator(message)}
              </div>
            ) : message.error ? (
              <div className="flex items-center space-x-2 text-red-600">
                <CheckIcon className="h-4 w-4" />
                <span className="text-sm">{message.error}</span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center space-x-1"
                      >
                        <span>{children}</span>
                        <ExternalLinkIcon className="h-3 w-3" />
                      </a>
                    )
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
            
            {renderAttachments(message)}
            {renderLinks(message)}
          </div>
          
          {message.role === "assistant" && !message.isGenerating && (
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(message.content)}
                title="Copy message"
              >
                <CopyIcon className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                title="Regenerate response"
              >
                <ReloadIcon className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                title="Bookmark message"
              >
                <BookmarkIcon className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                title="Share message"
              >
                <Share2Icon className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>{message.timestamp.toLocaleTimeString()}</span>
            {message.model && (
              <Badge variant="outline" className="text-xs">
                {message.model}
              </Badge>
            )}
            {message.analysisType && message.analysisType !== 'standard' && (
              <Badge variant="secondary" className="text-xs">
                <CheckIcon className="h-3 w-3 mr-1" />
                {message.analysisType === 'document' ? 'Document Analysis' : 
                 message.analysisType === 'web' ? 'Web Analysis' : 'Perplexity AI'}
              </Badge>
            )}
          </div>
        </div>

        {message.role === "user" && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              U
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex h-full bg-background", className)}>
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chat History</h2>
              <Button size="sm" onClick={handleNewConversation}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {searchQuery ? "Try a different search term" : "Start a new conversation to get started"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors group",
                      "hover:bg-accent hover:text-accent-foreground",
                      currentConversation?.id === conversation.id && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {conversation.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conversation.messages.length} messages
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {conversation.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteConversation(conversation.id)
                        }}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{currentConversation.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentConversation.messages.length} messages
                  </p>
                </div>
                <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <ArchiveIcon className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                  <Button size="sm" variant="outline">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      Start a conversation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ask CadetAI to help with your APD generation, analyze documents, or research current information
                    </p>
                  </div>
                ) : (
                  messages.map(renderMessage)
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              {/* File Attachments */}
              {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2 text-sm"
                    >
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate max-w-[150px]">{attachment.name}</span>
                      <span className="text-xs text-muted-foreground">({formatFileSize(attachment.size)})</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(attachment.id)}
                        className="h-4 w-4 p-0 hover:bg-muted"
                      >
                        <Cross2Icon className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask CadetAI about your APD requirements, upload documents for analysis, or share links for research..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[60px] max-h-[120px] resize-none pr-20"
                    disabled={isGenerating}
                  />
                  <div className="absolute right-2 bottom-2 flex space-x-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.xls,.pptx,.ppt"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload files"
                    >
                      <UploadIcon className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => setIsRecording(!isRecording)}
                      title="Voice input"
                    >
                      {isRecording ? (
                        <Cross1Icon className="h-3 w-3 text-red-500" />
                      ) : (
                        <SpeakerLoudIcon className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={(!inputValue.trim() && attachments.length === 0) || isGenerating}
                  size="sm"
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                >
                  {isGenerating ? (
                    <StopIcon className="h-4 w-4 animate-pulse" />
                  ) : (
                    <PaperPlaneIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex space-x-2 mt-3">
                <Button size="sm" variant="outline" className="text-xs">
                  <CheckIcon className="h-3 w-3 mr-1" />
                  Analyze with Perplexity
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Simplify jargon per gov regs
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Add compliance section
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Generate stakeholder analysis
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No conversation selected
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select a conversation from the sidebar or create a new one
              </p>
              <Button onClick={handleNewConversation}>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
