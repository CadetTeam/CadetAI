"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  UserPlus, 
  Settings, 
  Trash2,
  Edit,
  Shield,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock team data
const teams = [
  {
    id: 1,
    name: "CA-MMIS Core Team",
    description: "Primary team responsible for CA-MMIS replacement project",
    members: [
      { id: 1, name: "Corey Engel", role: "Project Manager", avatar: "/avatars/corey.jpg", status: "online" },
      { id: 2, name: "Sarah Johnson", role: "Technical Lead", avatar: "/avatars/sarah.jpg", status: "away" },
      { id: 3, name: "Mike Chen", role: "Compliance Officer", avatar: "/avatars/mike.jpg", status: "offline" },
      { id: 4, name: "Lisa Rodriguez", role: "Business Analyst", avatar: "/avatars/lisa.jpg", status: "online" }
    ],
    createdAt: "2024-01-15",
    isActive: true,
    permissions: ["read", "write", "admin"]
  },
  {
    id: 2,
    name: "Compliance Review Board",
    description: "Oversight team for regulatory compliance and audit requirements",
    members: [
      { id: 5, name: "David Wilson", role: "Compliance Director", avatar: "/avatars/david.jpg", status: "online" },
      { id: 6, name: "Emily Davis", role: "Audit Specialist", avatar: "/avatars/emily.jpg", status: "online" }
    ],
    createdAt: "2024-02-01",
    isActive: true,
    permissions: ["read", "review"]
  },
  {
    id: 3,
    name: "Technical Architecture Team",
    description: "System architecture and technical implementation team",
    members: [
      { id: 7, name: "Alex Thompson", role: "Solutions Architect", avatar: "/avatars/alex.jpg", status: "away" },
      { id: 8, name: "Maria Garcia", role: "DevOps Engineer", avatar: "/avatars/maria.jpg", status: "online" }
    ],
    createdAt: "2024-01-20",
    isActive: false,
    permissions: ["read", "write"]
  }
]

export default function TeamsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewTeamModal, setShowNewTeamModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Search and Actions Skeleton */}
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Teams Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-8 w-8 rounded-full" />
                  ))}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Teams</h1>
        <p className="text-muted-foreground">Manage your teams and collaborate on APD projects</p>
      </div>

      {/* Search and Actions */}
      <div className="flex space-x-4">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={showNewTeamModal} onOpenChange={setShowNewTeamModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a new team to collaborate on APD projects
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Team name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Team description"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewTeamModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowNewTeamModal(false)}>
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Users
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite Users</DialogTitle>
              <DialogDescription>
                Invite users to join your teams
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input
                  id="role"
                  placeholder="Team role"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
              <InviteUserButton onDone={() => setShowInviteModal(false)} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {searchQuery ? "No teams found" : "No teams yet"}
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {searchQuery ? "Try a different search term" : "Create your first team to get started"}
                </p>
                <Button onClick={() => setShowNewTeamModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredTeams.map((team) => (
            <Card key={team.id} className={cn(
              "transition-all duration-200 hover:shadow-md",
              !team.isActive && "opacity-60"
            )}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Team
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Members
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Team Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{team.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Team Members */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Members ({team.members.length})</span>
                    <Button size="sm" variant="outline" onClick={() => setShowInviteModal(true)}>
                      <UserPlus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    {team.members.slice(0, 4).map((member) => (
                      <div key={member.id} className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
                          member.status === "online" && "bg-green-500",
                          member.status === "away" && "bg-yellow-500",
                          member.status === "offline" && "bg-gray-400"
                        )} />
                      </div>
                    ))}
                    {team.members.length > 4 && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">+{team.members.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Info */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Permissions: {team.permissions.join(", ")}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-between items-center">
                  <Badge variant={team.isActive ? "default" : "secondary"}>
                    {team.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function InviteUserButton({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInvite = async () => {
    try {
      setLoading(true)
      setError(null)
      // Grab form fields
      const email = (document.getElementById('email') as HTMLInputElement)?.value
      const role = (document.getElementById('role') as HTMLInputElement)?.value || 'basic_member'
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress: email, role })
      })
      if (!res.ok) throw new Error('Failed to send invite')
      onDone()
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to invite'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-500">{error}</span>}
      <Button onClick={handleInvite} disabled={loading}>
        {loading ? 'Sending…' : 'Send Invite'}
      </Button>
    </div>
  )
}
