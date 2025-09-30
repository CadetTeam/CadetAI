"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
}

export function MobileRightMenu({ anchorClassName }: MobileRightMenuProps) {
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
      {/* 9-Dot Grid Button */}
      <div className={anchorClassName ?? "fixed bottom-6 right-6 z-50"}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 p-0 bg-black rounded-full shadow-lg hover:bg-gray-800"
        >
          <DotsHorizontalIcon className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Floating Bottom-Up Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute bottom-20 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[320px] max-w-[90vw] max-h-[70vh] overflow-y-auto">
            
            {/* Contractors Section */}
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Contractors</CardTitle>
                <CardDescription className="text-xs">Organizations with access</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {mockContractors.map((contractor) => (
                    <div key={contractor.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-blue-500 text-white">
                            {contractor.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{contractor.name}</p>
                          <p className="text-xs text-muted-foreground">{contractor.lastActivity}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <PersonIcon className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <EyeOpenIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Collaborators Section */}
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Collaborators</CardTitle>
                <CardDescription className="text-xs">Team members and users</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {mockCollaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-green-500 text-white">
                            {collaborator.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{collaborator.name}</p>
                          <p className="text-xs text-muted-foreground">{collaborator.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <PersonIcon className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <EyeOpenIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                <CardDescription className="text-xs">Latest updates</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-2">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                          {activity.user && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">by {activity.user}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
