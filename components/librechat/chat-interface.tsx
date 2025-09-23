"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Trash2, 
  Archive,
  Download,
  Search,
  Plus,
  Bot,
  User,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import libreChatClient, { Conversation } from "@/lib/librechat"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatInterfaceProps {
  className?: string
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = () => {
      const convos = libreChatClient.getConversations()
      setConversations(convos)
      
      if (convos.length > 0 && !currentConversation) {
        setCurrentConversation(convos[0])
        libreChatClient.setCurrentConversation(convos[0].id)
      }
    }

    loadConversations()
  }, [currentConversation])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation?.messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return

    const message = inputValue.trim()
    setInputValue("")
    setIsGenerating(true)

    try {
      await libreChatClient.sendMessage(message)
      const updatedConversation = libreChatClient.getCurrentConversation()
      setCurrentConversation(updatedConversation)
      setConversations(libreChatClient.getConversations())
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNewConversation = () => {
    const newConversation = libreChatClient.createConversation()
    setCurrentConversation(newConversation)
    setConversations(libreChatClient.getConversations())
  }

  const handleSelectConversation = (conversationId: string) => {
    if (libreChatClient.setCurrentConversation(conversationId)) {
      const conversation = libreChatClient.getCurrentConversation()
      setCurrentConversation(conversation)
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
      } else {
        setCurrentConversation(null)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = searchQuery
    ? libreChatClient.searchConversations(searchQuery)
    : conversations

  return (
    <div className={cn("flex h-full bg-background", className)}>
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <Button size="sm" onClick={handleNewConversation}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentConversation.messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ask CadetAI to help with your APD generation or any questions
                  </p>
                </div>
              ) : (
                currentConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex space-x-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg p-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                          <span className="text-sm text-muted-foreground">CadetAI is thinking...</span>
                        </div>
                      ) : message.error ? (
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{message.error}</span>
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.model && (
                          <span className="text-xs text-muted-foreground">
                            {message.model}
                          </span>
                        )}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
              
              {isGenerating && (
                <div className="flex space-x-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                      <span className="text-sm text-muted-foreground">CadetAI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Ask CadetAI about your APD requirements..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[60px] max-h-[120px] resize-none pr-20"
                    disabled={isGenerating}
                  />
                  <div className="absolute right-2 bottom-2 flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      {isRecording ? (
                        <MicOff className="h-3 w-3 text-red-500" />
                      ) : (
                        <Mic className="h-3 w-3" />
                      )}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Paperclip className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isGenerating}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex space-x-2 mt-3">
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
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
