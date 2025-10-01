"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  const [isLoading, setIsLoading] = useState(false)

  const roles = [
    { value: "admin", label: "Admin", description: "Full access" },
    { value: "manager", label: "Manager", description: "Manage teams" },
    { value: "member", label: "Member", description: "Basic access" },
    { value: "viewer", label: "Viewer", description: "Read-only" },
  ]

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

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
        className="fixed z-[103] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-border rounded-xl shadow-2xl w-72 sm:w-80 max-h-[500px] sm:max-h-[600px] overflow-hidden"
        style={{
          top: position.top,
          left: position.left,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 sm:p-3 border-b border-border">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">Invite Users</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-5 w-5 p-0"
          >
            <Cross2Icon className="h-3 w-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-7 w-full" />
            </div>
          ) : (
            <>
              {/* Add User Form */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="user@company.com"
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="role" className="text-xs">Role</Label>
                  <Select value={currentRole} onValueChange={setCurrentRole}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value} className="text-sm">
                          <div>
                            <div className="font-medium text-xs">{role.label}</div>
                            <div className="text-[10px] text-muted-foreground">{role.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={addInvite} 
                  disabled={!currentEmail.trim() || !currentRole}
                  className="w-full h-7 text-xs"
                >
                  <PlusIcon className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>

              {/* Invite List */}
              {invites.length > 0 ? (
                <div className="space-y-1">
                  <Label className="text-xs">Invite List ({invites.length})</Label>
                  <div className="space-y-1">
                    {invites.map((invite) => {
                      const roleInfo = roles.find(r => r.value === invite.role)
                      return (
                        <div
                          key={invite.id}
                          className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg border border-border bg-muted/30"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs truncate">{invite.email}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {roleInfo?.label || invite.role}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Badge variant="outline" className="text-[9px] px-1 py-0">
                              {roleInfo?.label || invite.role}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInvite(invite.id)}
                              className="h-5 w-5 p-0"
                            >
                              <Cross2Icon className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-2 sm:p-3 border-t border-border">
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            {invites.length} to invite
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <Button variant="outline" onClick={onClose} className="h-7 text-xs px-2">
              Cancel
            </Button>
            <Button onClick={handleSendInvites} disabled={invites.length === 0} className="h-7 text-xs px-2">
              <PaperPlaneIcon className="w-3 h-3 mr-1" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
