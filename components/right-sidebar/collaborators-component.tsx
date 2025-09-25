"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  PersonIcon, 
  EyeOpenIcon, 
  ClockIcon,
  PersonIcon as CollaboratorsIcon
} from "@radix-ui/react-icons"

interface Collaborator {
  id: string
  name: string
  avatar?: string
  initials: string
  organization: string
  role: 'admin' | 'manager' | 'analyst' | 'viewer'
  lastActive: string
  status: 'online' | 'away' | 'offline'
  isExternal: boolean
}

interface CollaboratorsComponentProps {
  className?: string
}

// Mock data - in real app this would come from API
const mockCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Anne Couture",
    initials: "AC",
    organization: "CadetAI",
    role: 'admin',
    lastActive: "5 min ago",
    status: 'online',
    isExternal: false
  },
  {
    id: "2",
    name: "Miriam Soleil", 
    initials: "MS",
    organization: "CadetAI",
    role: 'manager',
    lastActive: "10 min ago",
    status: 'online',
    isExternal: false
  },
  {
    id: "3",
    name: "Marie Laval",
    initials: "ML", 
    organization: "External Corp",
    role: 'analyst',
    lastActive: "15 min ago",
    status: 'away',
    isExternal: true
  },
  {
    id: "4",
    name: "Mark Morain",
    initials: "MM",
    organization: "Partner Org",
    role: 'viewer',
    lastActive: "20 min ago", 
    status: 'offline',
    isExternal: true
  }
]

export function CollaboratorsComponent({ className }: CollaboratorsComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'analyst': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const handleProfileClick = (collaborator: Collaborator) => {
    console.log('View profile for:', collaborator.name)
    // TODO: Implement profile view
  }

  const handleAccessClick = (collaborator: Collaborator) => {
    console.log('Manage access for:', collaborator.name)
    // TODO: Implement access management
  }

  const handleActivityClick = (collaborator: Collaborator) => {
    console.log('View activity for:', collaborator.name)
    // TODO: Implement activity view
  }

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Collaborators</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            See all
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {mockCollaborators.slice(0, 4).map((collaborator) => (
            <div key={collaborator.id} className="relative">
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                <AvatarFallback className="text-xs font-medium">
                  {collaborator.initials}
                </AvatarFallback>
              </Avatar>
              <div 
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(collaborator.status)}`}
              />
            </div>
          ))}
          {mockCollaborators.length > 4 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              +{mockCollaborators.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Collaborators Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CollaboratorsIcon className="h-5 w-5" />
              Team Collaborators
            </DialogTitle>
            <DialogDescription>
              View and manage team members and external collaborators with access to your organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {mockCollaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                      <AvatarFallback>
                        {collaborator.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background ${getStatusColor(collaborator.status)}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{collaborator.name}</h4>
                      {collaborator.isExternal && (
                        <Badge variant="outline" className="text-xs">
                          External
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{collaborator.organization}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(collaborator.role)}>
                        {collaborator.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Last active: {collaborator.lastActive}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProfileClick(collaborator)}
                    className="h-8 w-8 p-0"
                    title="View Profile"
                  >
                    <PersonIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAccessClick(collaborator)}
                    className="h-8 w-8 p-0"
                    title="Manage Access"
                  >
                    <EyeOpenIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleActivityClick(collaborator)}
                    className="h-8 w-8 p-0"
                    title="Recent Activity"
                  >
                    <ClockIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
