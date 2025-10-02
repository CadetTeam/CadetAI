"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Shield, 
  CreditCard, 
  Bell, 
  Globe, 
  Lock,
  Database,
  Users,
  Building,
  ArrowRightLeft,
  UserPlus
} from "lucide-react"

export function OrganizationSettings() {
  return (
    <>
      {/* Organization information (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Organization Information</span>
          </CardTitle>
          <CardDescription>
            Update your organization details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((__, j) => (
            <div key={j} className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Team management (functional) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Management</span>
          </CardTitle>
          <CardDescription>
            Add, remove, and change roles for members in your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <MembersAdminPanel />
        </CardContent>
      </Card>
    </>
  )
}

export function SecuritySettings() {
  return (
    <>
      {[...Array(2)].map((_, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {idx === 0 ? <Shield className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              <span>{idx === 0 ? 'Security Policies' : 'Password Policy'}</span>
            </CardTitle>
            <CardDescription>
              {idx === 0 ? 'Configure security settings and compliance requirements' : 'Set password requirements and rotation policies'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((__, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export function BillingSettings() {
  return (
    <>
      {[...Array(2)].map((_, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>{idx === 0 ? 'Billing Information' : 'Usage & Limits'}</span>
            </CardTitle>
            <CardDescription>
              {idx === 0 ? 'Manage your subscription and payment methods' : 'Monitor your current usage and plan limits'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((__, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notification Preferences</span>
        </CardTitle>
        <CardDescription>
          Configure how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(4)].map((_, j) => (
          <div key={j} className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function IntegrationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Third-party Integrations</span>
        </CardTitle>
        <CardDescription>
          Connect with external services and tools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, j) => (
          <div key={j} className="p-4 border rounded-lg space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DataPrivacySettings() {
  return (
    <>
      {[...Array(2)].map((_, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>{idx === 0 ? 'Data Management' : 'Data Export & Deletion'}</span>
            </CardTitle>
            <CardDescription>
              {idx === 0 ? 'Control your data retention and export settings' : 'Export your data or request account deletion'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((__, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </>
  )
}

function MembersAdminPanel() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [members, setMembers] = React.useState<Array<{id:string; userId?: string; name?: string; email?: string; role: string; imageUrl?: string;}>>([])
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [updating, setUpdating] = React.useState<string | null>(null)
  const [transferring, setTransferring] = React.useState(false)

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/org-members')
        if (!res.ok) throw new Error('Failed to load members')
        const data = await res.json()
        setMembers(data.members || [])
        setCurrentUserId(data.currentUserId || null)
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load members'
        setError(message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const invite = async () => {
    try {
      setUpdating('invite')
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress: inviteEmail })
      })
      if (!res.ok) throw new Error('Failed to invite user')
      setInviteEmail("")
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to invite user'
      setError(message)
    } finally {
      setUpdating(null)
    }
  }

  const changeRole = async (membershipId: string, role: string) => {
    try {
      setUpdating(membershipId)
      const res = await fetch('/api/org-members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId, role })
      })
      if (!res.ok) throw new Error('Failed to update role')
      setMembers(prev => prev.map(m => m.id === membershipId ? { ...m, role } : m))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update role'
      setError(message)
    } finally {
      setUpdating(null)
    }
  }

  const removeMember = async (membershipId: string) => {
    try {
      setUpdating(membershipId)
      const res = await fetch('/api/org-members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId })
      })
      if (!res.ok) throw new Error('Failed to remove member')
      setMembers(prev => prev.filter(m => m.id !== membershipId))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to remove member'
      setError(message)
    } finally {
      setUpdating(null)
    }
  }

  const leaveOrganization = async () => {
    if (!currentUserId) return
    try {
      setUpdating('leave')
      const res = await fetch('/api/org-members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: currentUserId })
      })
      if (!res.ok) throw new Error('Failed to leave organization')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to leave organization'
      setError(message)
    } finally {
      setUpdating(null)
    }
  }

  const transferOwnership = async (userId?: string) => {
    if (!userId) return
    try {
      setTransferring(true)
      const res = await fetch('/api/transfer-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOwnerUserId: userId })
      })
      if (!res.ok) throw new Error('Failed to transfer ownership')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to transfer ownership'
      setError(message)
    } finally {
      setTransferring(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_,i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-2">
        <Input
          placeholder="user@example.com"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <Button onClick={invite} disabled={!inviteEmail || updating === 'invite'}>
          <UserPlus className="h-4 w-4 mr-2" /> Invite
        </Button>
      </div>

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted overflow-hidden" />
              <div>
                <p className="text-sm font-medium">{m.name || m.email}</p>
                <p className="text-xs text-muted-foreground">{m.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => changeRole(m.id, 'basic_member')} disabled={updating === m.id}>Member</Button>
              <Button variant="outline" size="sm" onClick={() => changeRole(m.id, 'admin')} disabled={updating === m.id}>Admin</Button>
              <Button variant="ghost" size="sm" onClick={() => transferOwnership(m.userId)} disabled={transferring} title="Transfer ownership">
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => removeMember(m.id)} disabled={updating === m.id} title="Remove member">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={leaveOrganization} disabled={updating === 'leave'}>
          Leave Organization
        </Button>
      </div>
    </div>
  )
}

