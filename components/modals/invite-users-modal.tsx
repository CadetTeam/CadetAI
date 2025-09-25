"use client"

import { useState } from "react"
import { useOrganization, useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircledIcon, 
  ExclamationTriangleIcon, 
  UpdateIcon,
  PlusIcon,
  Cross2Icon,
  EnvelopeClosedIcon as MailIcon
} from "@radix-ui/react-icons"

interface InviteUsersModalProps {
  isOpen: boolean
  onClose: () => void
}

interface InviteFormData {
  emails: string
  role: string
  team: string
  message: string
}

interface EmailInvite {
  email: string
  role: string
  team: string
}

export function InviteUsersModal({ isOpen, onClose }: InviteUsersModalProps) {
  const { organization } = useOrganization()
  const [isInviting, setIsInviting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [formData, setFormData] = useState<InviteFormData>({
    emails: "",
    role: "viewer",
    team: "",
    message: ""
  })

  const [emailInvites, setEmailInvites] = useState<EmailInvite[]>([])

  const roles = [
    { value: "admin", label: "Administrator", description: "Full access to all features" },
    { value: "manager", label: "Manager", description: "Manage teams and projects" },
    { value: "analyst", label: "Analyst", description: "Analyze data and create reports" },
    { value: "viewer", label: "Viewer", description: "View-only access" }
  ]

  const teams = organization ? [{
    value: organization.id,
    label: organization.name
  }] : []

  const handleInputChange = (field: keyof InviteFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError("")
    setSuccess("")
  }

  const parseEmails = (emailString: string): string[] => {
    return emailString
      .split(/[,\n;]/)
      .map(email => email.trim())
      .filter(email => email.length > 0)
      .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  }

  const handleAddEmails = () => {
    const emails = parseEmails(formData.emails)
    
    if (emails.length === 0) {
      setError("Please enter valid email addresses")
      return
    }

    const newInvites = emails.map(email => ({
      email,
      role: formData.role,
      team: formData.team
    }))

    setEmailInvites(prev => [...prev, ...newInvites])
    setFormData(prev => ({
      ...prev,
      emails: ""
    }))
  }

  const removeInvite = (index: number) => {
    setEmailInvites(prev => prev.filter((_, i) => i !== index))
  }

  const updateInviteRole = (index: number, role: string) => {
    setEmailInvites(prev => prev.map((invite, i) => 
      i === index ? { ...invite, role } : invite
    ))
  }

  const updateInviteTeam = (index: number, team: string) => {
    setEmailInvites(prev => prev.map((invite, i) => 
      i === index ? { ...invite, team } : invite
    ))
  }

  const validateInvites = (): boolean => {
    if (emailInvites.length === 0) {
      setError("Please add at least one email address")
      return false
    }
    return true
  }

  const handleSendInvites = async () => {
    if (!validateInvites()) return

    setIsInviting(true)
    setError("")
    setSuccess("")

    try {
      // Create invitations via Clerk API
      const invitationPromises = emailInvites.map(async (invite) => {
        const response = await fetch('/api/invite-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailAddress: invite.email,
            role: invite.role,
            organizationId: organization?.id,
            skipEmailVerification: false
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to invite ${invite.email}`)
        }

        return response.json()
      })

      await Promise.all(invitationPromises)
      
      setSuccess(`Successfully sent ${emailInvites.length} invitation(s)!`)
      
      // Reset form
      setEmailInvites([])
      setFormData({
        emails: "",
        role: "viewer",
        team: "",
        message: ""
      })

      // Close modal after a short delay
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err: unknown) {
      console.error('Error sending invitations:', err)
      const errorMessage = err instanceof Error ? err.message : "Failed to send invitations. Please try again."
      setError(errorMessage)
    } finally {
      setIsInviting(false)
    }
  }

  const handleClose = () => {
    if (!isInviting) {
      setError("")
      setSuccess("")
      setEmailInvites([])
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MailIcon className="h-5 w-5" />
            Invite Users to Organization
          </DialogTitle>
          <DialogDescription>
            Send invitations to users to join your organization. You can set their role and team assignment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CheckCircledIcon className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Email Input Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emails">Email Addresses *</Label>
                <Textarea
                  id="emails"
                  value={formData.emails}
                  onChange={(e) => handleInputChange('emails', e.target.value)}
                  placeholder="Enter email addresses separated by commas, semicolons, or new lines..."
                  rows={3}
                  disabled={isInviting}
                />
                <p className="text-sm text-muted-foreground">
                  You can enter multiple emails separated by commas, semicolons, or new lines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultRole">Default Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleInputChange('role', value)}
                    disabled={isInviting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-sm text-muted-foreground">{role.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultTeam">Default Team</Label>
                  <Select 
                    value={formData.team} 
                    onValueChange={(value) => handleInputChange('team', value)}
                    disabled={isInviting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.value} value={team.value}>
                          {team.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAddEmails}
                disabled={isInviting || !formData.emails.trim()}
                variant="outline"
                className="w-full"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Emails to Invite List
              </Button>
            </div>

            {/* Invite List */}
            {emailInvites.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Invitation List ({emailInvites.length})</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEmailInvites([])}
                    disabled={isInviting}
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                  {emailInvites.map((invite, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{invite.email}</p>
                      </div>
                      
                      <Select 
                        value={invite.role} 
                        onValueChange={(value) => updateInviteRole(index, value)}
                        disabled={isInviting}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select 
                        value={invite.team} 
                        onValueChange={(value) => updateInviteTeam(index, value)}
                        disabled={isInviting}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.value} value={team.value}>
                              {team.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInvite(index)}
                        disabled={isInviting}
                        className="h-8 w-8 p-0"
                      >
                        <Cross2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Add a personal message to include with the invitation..."
                rows={2}
                disabled={isInviting}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isInviting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendInvites}
            disabled={isInviting || emailInvites.length === 0}
            className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
          >
            {isInviting ? (
              <>
                <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                Sending Invitations...
              </>
            ) : (
              <>
                <MailIcon className="mr-2 h-4 w-4" />
                Send {emailInvites.length} Invitation{emailInvites.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
