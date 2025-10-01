"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Cross2Icon,
  PaperPlaneIcon,
  PlusIcon
} from "@radix-ui/react-icons"

interface InviteUsersCardProps {
  isOpen: boolean
  onClose: () => void
  position: { top: number; left: number }
}

interface InviteUser {
  id: string
  email: string
  role: string
}

export function InviteUsersCard({ isOpen, onClose, position }: InviteUsersCardProps) {
  const [invites, setInvites] = useState<InviteUser[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [currentRole, setCurrentRole] = useState("")

  const roles = [
    { value: "admin", label: "Admin", description: "Full access to all features" },
    { value: "manager", label: "Manager", description: "Manage teams and projects" },
    { value: "member", label: "Member", description: "Basic access to assigned projects" },
    { value: "viewer", label: "Viewer", description: "Read-only access" },
  ]

  const addInvite = () => {
    if (currentEmail.trim() && currentRole) {
      const newInvite: InviteUser = {
        id: Date.now().toString(),
        email: currentEmail.trim(),
        role: currentRole
      }
      setInvites(prev => [...prev, newInvite])
      setCurrentEmail("")
      setCurrentRole("")
    }
  }

  const removeInvite = (id: string) => {
    setInvites(prev => prev.filter(invite => invite.id !== id))
  }

  const handleSendInvites = () => {
    // Handle sending invites logic here
    console.log("Sending invites:", invites)
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addInvite()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[102] bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popover */}
      <div 
        className="fixed z-[103] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-border rounded-lg shadow-xl w-80 max-h-[600px] overflow-hidden"
        style={{
          top: position.top,
          left: position.left,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Invite Users</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <Cross2Icon className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Add User Form */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="user@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={currentRole} onValueChange={setCurrentRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-muted-foreground">{role.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={addInvite} 
              disabled={!currentEmail.trim() || !currentRole}
              className="w-full"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add to Invite List
            </Button>
          </div>

          {/* Invite List */}
          {invites.length > 0 && (
            <div className="space-y-2">
              <Label>Invite List ({invites.length})</Label>
              <div className="space-y-2">
                {invites.map((invite) => {
                  const roleInfo = roles.find(r => r.value === invite.role)
                  return (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{invite.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {roleInfo?.label || invite.role}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {roleInfo?.label || invite.role}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInvite(invite.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Cross2Icon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {invites.length} user{invites.length !== 1 ? 's' : ''} to invite
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSendInvites} disabled={invites.length === 0}>
              <PaperPlaneIcon className="w-4 h-4 mr-2" />
              Send Invites
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
