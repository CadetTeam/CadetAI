"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  FileTextIcon, 
  ChatBubbleIcon, 
  UpdateIcon,
  PersonIcon,
  ClockIcon
} from "@radix-ui/react-icons"

interface ActivityItem {
  id: string
  type: 'apd_update' | 'chat_message' | 'user_action' | 'system_update'
  title: string
  description: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  timestamp: string
  status?: 'completed' | 'pending' | 'failed'
}

interface RecentActivityComponentProps {
  className?: string
}

// Mock data based on current page context
const getMockActivities = (pathname: string): ActivityItem[] => {
  if (pathname.includes('/apdgpt/engine')) {
    return [
      {
        id: "1",
        type: 'apd_update',
        title: "APD Document Updated",
        description: "Section 3.2 - Risk Assessment was modified",
        user: { name: "Sarah Chen", initials: "SC" },
        timestamp: "2 min ago",
        status: 'completed'
      },
      {
        id: "2",
        type: 'user_action',
        title: "New Comment Added",
        description: "Added comment on compliance requirements",
        user: { name: "Mike Rodriguez", initials: "MR" },
        timestamp: "15 min ago",
        status: 'completed'
      },
      {
        id: "3",
        type: 'apd_update',
        title: "Data Validation Complete",
        description: "All data points validated successfully",
        user: { name: "System", initials: "S" },
        timestamp: "1 hour ago",
        status: 'completed'
      }
    ]
  } else if (pathname.includes('/apdgpt/history')) {
    return [
      {
        id: "1",
        type: 'chat_message',
        title: "New Chat Session",
        description: "Started discussion about Q4 compliance",
        user: { name: "Alex Thompson", initials: "AT" },
        timestamp: "5 min ago",
        status: 'completed'
      },
      {
        id: "2",
        type: 'chat_message',
        title: "Chat Summary Generated",
        description: "AI generated summary of compliance discussion",
        user: { name: "System", initials: "S" },
        timestamp: "30 min ago",
        status: 'completed'
      },
      {
        id: "3",
        type: 'user_action',
        title: "Chat Exported",
        description: "Chat history exported to PDF",
        user: { name: "Lisa Wang", initials: "LW" },
        timestamp: "2 hours ago",
        status: 'completed'
      }
    ]
  } else {
    return [
      {
        id: "1",
        type: 'user_action',
        title: "Team Member Added",
        description: "New team member joined the organization",
        user: { name: "John Smith", initials: "JS" },
        timestamp: "1 hour ago",
        status: 'completed'
      },
      {
        id: "2",
        type: 'system_update',
        title: "System Update",
        description: "Platform updated to version 2.1.0",
        user: { name: "System", initials: "S" },
        timestamp: "3 hours ago",
        status: 'completed'
      },
      {
        id: "3",
        type: 'user_action',
        title: "Document Shared",
        description: "APD document shared with external team",
        user: { name: "Emma Davis", initials: "ED" },
        timestamp: "5 hours ago",
        status: 'completed'
      }
    ]
  }
}

export function RecentActivityComponent({ className }: RecentActivityComponentProps) {

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          See all
        </Button>
      </div>

      <div className="space-y-3">
        {/* Skeleton loading states */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-3 p-2 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
