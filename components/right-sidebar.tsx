"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const collaborators = [
  { name: "Anne Couture", avatar: "/avatars/anne.jpg", time: "5 min ago" },
  { name: "Miriam Soleil", avatar: "/avatars/miriam.jpg", time: "10 min ago" },
  { name: "Marie Laval", avatar: "/avatars/marie.jpg", time: "15 min ago" },
  { name: "Mark Morain", avatar: "/avatars/mark.jpg", time: "20 min ago" },
]

const recentActivity = [
  { 
    name: "Hola Spine", 
    action: "invited you to a channel", 
    time: "2 min ago",
    avatar: "/avatars/hola.jpg"
  },
  { 
    name: "Eva Solain", 
    action: "invited you to a chat", 
    time: "20 min ago",
    avatar: "/avatars/eva.jpg"
  },
  { 
    name: "Pierre Ford", 
    action: "is a new lead in your pipeline", 
    time: "1 hour ago",
    avatar: "/avatars/pierre.jpg"
  },
  { 
    name: "Steve Ater", 
    action: "started following you", 
    time: "2 hours ago",
    avatar: "/avatars/steve.jpg"
  },
]

export function RightSidebar() {
  return (
    <div className="w-80 bg-background border-l border-border p-6 space-y-6 overflow-auto">
      {/* Call Prep Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Call Prep</h3>
        <div className="text-sm text-muted-foreground">
          No call preparation items available.
        </div>
      </div>

      <Separator />

      {/* Vendors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Vendors</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            See all
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          {collaborators.slice(0, 3).map((collaborator, index) => (
            <Avatar key={index} className="h-8 w-8">
              <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
              <AvatarFallback>
                {collaborator.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">4+</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Collaborators Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Collaborators</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            See all
          </Button>
        </div>
        <div className="space-y-3">
          {collaborators.map((collaborator, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                <AvatarFallback>
                  {collaborator.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {collaborator.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {collaborator.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            See all
          </Button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar} alt={activity.name} />
                <AvatarFallback>
                  {activity.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.name}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
