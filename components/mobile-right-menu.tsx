"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  DotsHorizontalIcon,
  PersonIcon,
  FileTextIcon,
  ClockIcon,
  EyeOpenIcon
} from "@radix-ui/react-icons"

interface Contractor {
  id: string
  name: string
  avatar: string
  status: "online" | "offline"
  lastActivity: string
}

interface Collaborator {
  id: string
  name: string
  avatar: string
  role: string
  status: "online" | "offline"
}

interface Activity {
  id: string
  type: "data_change" | "chat_update" | "user_action"
  description: string
  timestamp: string
  user?: string
}

const mockContractors: Contractor[] = [
  {
    id: "1",
    name: "Acme Corp",
    avatar: "AC",
    status: "online",
    lastActivity: "2 min ago"
  },
  {
    id: "2",
    name: "Tech Solutions",
    avatar: "TS",
    status: "offline",
    lastActivity: "1 hour ago"
  },
  {
    id: "3",
    name: "Global Systems",
    avatar: "GS",
    status: "online",
    lastActivity: "5 min ago"
  }
]

const mockCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "SJ",
    role: "Project Manager",
    status: "online"
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "MC",
    role: "Developer",
    status: "offline"
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "ED",
    role: "Analyst",
    status: "online"
  }
]

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "data_change",
    description: "APD document updated",
    timestamp: "5 minutes ago",
    user: "Sarah Johnson"
  },
  {
    id: "2",
    type: "chat_update",
    description: "New message in team chat",
    timestamp: "10 minutes ago"
  },
  {
    id: "3",
    type: "user_action",
    description: "New user invited to project",
    timestamp: "15 minutes ago",
    user: "Mike Chen"
  }
]

interface MobileRightMenuProps {
  anchorClassName?: string
  chatContainerClassName?: string
}

export function MobileRightMenu({}: MobileRightMenuProps = {}) {
  const [isOpen, setIsOpen] = useState(false)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "data_change":
        return <FileTextIcon className="w-4 h-4 text-blue-500" />
      case "chat_update":
        return <ClockIcon className="w-4 h-4 text-green-500" />
      case "user_action":
        return <PersonIcon className="w-4 h-4 text-purple-500" />
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <>
      {/* Menu Button - Fixed position for mobile */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={("fixed bottom-32 right-4 h-10 w-10 p-0 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 z-50 pointer-events-auto " + (""))}
      >
        <DotsHorizontalIcon className="w-5 h-5 text-gray-600 dark:text-white" />
      </Button>

      {/* Mobile-Friendly Glassmorphic Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute bottom-24 right-4 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-3 w-80 max-w-[90vw] max-h-[60vh] overflow-y-auto">
            
            {/* Contractors Section */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">Contractors</h3>
                <span className="text-xs text-white/70">{mockContractors.length}</span>
              </div>
              <div className="space-y-1">
                {mockContractors.map((contractor) => (
                  <div key={contractor.id} className="flex items-center justify-between p-2 bg-white/5 dark:bg-black/5 rounded-lg hover:bg-white/10 dark:hover:bg-black/10">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-blue-500 text-white">
                          {contractor.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-white truncate">{contractor.name}</p>
                        <p className="text-xs text-white/70">{contractor.lastActivity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-white/70 hover:text-white hover:bg-white/10">
                        <PersonIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-white/70 hover:text-white hover:bg-white/10">
                        <EyeOpenIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaborators Section */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">Collaborators</h3>
                <span className="text-xs text-white/70">{mockCollaborators.length}</span>
              </div>
              <div className="space-y-1">
                {mockCollaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center justify-between p-2 bg-white/5 dark:bg-black/5 rounded-lg hover:bg-white/10 dark:hover:bg-black/10">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-green-500 text-white">
                          {collaborator.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-white truncate">{collaborator.name}</p>
                        <p className="text-xs text-white/70">{collaborator.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-white/70 hover:text-white hover:bg-white/10">
                        <PersonIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-white/70 hover:text-white hover:bg-white/10">
                        <EyeOpenIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
                <span className="text-xs text-white/70">{mockActivities.length}</span>
              </div>
              <div className="space-y-2">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-2 p-2 bg-white/5 dark:bg-black/5 rounded-lg hover:bg-white/10 dark:hover:bg-black/10">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white line-clamp-2">{activity.description}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <p className="text-xs text-white/70">{activity.timestamp}</p>
                        {activity.user && (
                          <>
                            <span className="text-xs text-white/70">•</span>
                            <p className="text-xs text-white/70">by {activity.user}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
