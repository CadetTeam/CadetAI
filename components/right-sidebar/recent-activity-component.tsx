"use client"

import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileTextIcon, 
  ChatBubbleIcon, 
  UpdateIcon,
  PersonIcon,
  ClockIcon,
  CheckCircledIcon
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
  if (pathname.includes('/apd-gpt/engine')) {
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
  } else if (pathname.includes('/apd-gpt/history')) {
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
  const pathname = usePathname()
  const activities = getMockActivities(pathname)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'apd_update': return <FileTextIcon className="h-4 w-4" />
      case 'chat_message': return <ChatBubbleIcon className="h-4 w-4" />
      case 'user_action': return <PersonIcon className="h-4 w-4" />
      case 'system_update': return <UpdateIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'apd_update': return 'text-blue-600 dark:text-blue-400'
      case 'chat_message': return 'text-green-600 dark:text-green-400'
      case 'user_action': return 'text-purple-600 dark:text-purple-400'
      case 'system_update': return 'text-orange-600 dark:text-orange-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

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
        {activities.slice(0, 4).map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </p>
                {activity.status && (
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {activity.description}
              </p>
              <div className="flex items-center gap-2">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback className="text-xs">
                    {activity.user.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {activity.user.name} • {activity.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
