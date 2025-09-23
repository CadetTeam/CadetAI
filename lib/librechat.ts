import { v4 as uuidv4 } from 'uuid'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  model?: string
  conversationId?: string
  parentMessageId?: string
  isGenerating?: boolean
  error?: string
}

export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: ChatMessage[]
  model: string
  isArchived?: boolean
}

export interface LibreChatConfig {
  apiEndpoint: string
  apiKey?: string
  defaultModel: string
  maxTokens?: number
  temperature?: number
}

class LibreChatClient {
  private config: LibreChatConfig
  private conversations: Map<string, Conversation> = new Map()
  private currentConversationId: string | null = null

  constructor(config: LibreChatConfig) {
    this.config = config
  }

  // Create a new conversation
  createConversation(title?: string): Conversation {
    const id = uuidv4()
    const conversation: Conversation = {
      id,
      title: title || 'New Conversation',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      model: this.config.defaultModel
    }
    
    this.conversations.set(id, conversation)
    this.currentConversationId = id
    return conversation
  }

  // Get all conversations
  getConversations(): Conversation[] {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // Get current conversation
  getCurrentConversation(): Conversation | null {
    if (!this.currentConversationId) return null
    return this.conversations.get(this.currentConversationId) || null
  }

  // Set current conversation
  setCurrentConversation(conversationId: string): boolean {
    if (this.conversations.has(conversationId)) {
      this.currentConversationId = conversationId
      return true
    }
    return false
  }

  // Add message to conversation
  addMessage(content: string, role: 'user' | 'assistant' | 'system' = 'user'): ChatMessage {
    if (!this.currentConversationId) {
      this.createConversation()
    }

    const conversation = this.conversations.get(this.currentConversationId!)
    if (!conversation) throw new Error('No active conversation')

    const message: ChatMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date(),
      model: this.config.defaultModel,
      conversationId: this.currentConversationId!
    }

    conversation.messages.push(message)
    conversation.updatedAt = new Date()

    // Update title if it's the first user message
    if (role === 'user' && conversation.messages.filter(m => m.role === 'user').length === 1) {
      conversation.title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
    }

    return message
  }

  // Send message and get AI response
  async sendMessage(content: string): Promise<ChatMessage> {
    // Add user message
    this.addMessage(content, 'user')
    
    // Create assistant message placeholder
    const assistantMessage = this.addMessage('', 'assistant')
    assistantMessage.isGenerating = true

    try {
      // Simulate API call to LibreChat
      const response = await this.callLibreChatAPI()
      
      // Update assistant message with response
      assistantMessage.content = response.content
      assistantMessage.isGenerating = false
      assistantMessage.model = response.model

      return assistantMessage
    } catch (error) {
      assistantMessage.error = error instanceof Error ? error.message : 'Unknown error'
      assistantMessage.isGenerating = false
      throw error
    }
  }

  // Simulate LibreChat API call
  private async callLibreChatAPI(): Promise<{content: string, model: string}> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simulate AI responses based on content
    const responses = [
      "I understand you're working on APD generation. Let me help you create a comprehensive Advanced Planning Document.",
      "Based on your requirements, I'll structure the document with the following sections: Executive Summary, Stakeholder Analysis, Technical Requirements, and Implementation Timeline.",
      "For government compliance, we need to ensure adherence to OMB A-130 guidelines and include proper risk assessment frameworks.",
      "I've generated a template that includes all necessary compliance sections. Would you like me to elaborate on any specific area?",
      "The document now includes proper stakeholder mapping and technical architecture diagrams. Shall we proceed with the implementation timeline?",
      "I've added the required security and compliance sections. The APD is now ready for review and approval."
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    return {
      content: randomResponse,
      model: this.config.defaultModel
    }
  }

  // Delete conversation
  deleteConversation(conversationId: string): boolean {
    if (this.conversations.has(conversationId)) {
      this.conversations.delete(conversationId)
      if (this.currentConversationId === conversationId) {
        this.currentConversationId = null
      }
      return true
    }
    return false
  }

  // Archive conversation
  archiveConversation(conversationId: string): boolean {
    const conversation = this.conversations.get(conversationId)
    if (conversation) {
      conversation.isArchived = true
      return true
    }
    return false
  }

  // Search conversations
  searchConversations(query: string): Conversation[] {
    const lowerQuery = query.toLowerCase()
    return this.getConversations().filter(conversation =>
      conversation.title.toLowerCase().includes(lowerQuery) ||
      conversation.messages.some(message => 
        message.content.toLowerCase().includes(lowerQuery)
      )
    )
  }

  // Export conversation
  exportConversation(conversationId: string): string {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) throw new Error('Conversation not found')

    const exportData = {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      model: conversation.model,
      messages: conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    }

    return JSON.stringify(exportData, null, 2)
  }
}

// Create singleton instance
const libreChatClient = new LibreChatClient({
  apiEndpoint: process.env.NEXT_PUBLIC_LIBRECHAT_API_ENDPOINT || '/api/librechat',
  defaultModel: 'gpt-4',
  maxTokens: 4000,
  temperature: 0.7
})

export default libreChatClient
