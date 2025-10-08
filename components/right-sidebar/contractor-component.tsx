"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  PersonIcon, 
  EyeOpenIcon, 
  ClockIcon,
  HomeIcon as BuildingIcon
} from "@radix-ui/react-icons"
import { Plus } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/supabase-client"

interface Contractor {
  id: string
  name: string
  avatar?: string
  initials: string
  organization: string
  accessLevel: 'read' | 'write' | 'admin'
  lastAccess: string
  status: 'active' | 'pending' | 'suspended'
}

interface ContractorComponentProps {
  className?: string
}

export function ContractorComponent({ className }: ContractorComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    const fetchContractors = async () => {
      if (!user) return

      try {
        setIsLoading(true)

        // Fetch contractors from Supabase
        const { data: contractorData, error: contractorError } = await supabase
          .from('contractors')
          .select('*')
          .eq('user_id', user.id)
          .order('last_access', { ascending: false })
          .limit(10)

        if (contractorError) throw contractorError

        // Transform data to match Contractor interface
        const transformedContractors: Contractor[] = (contractorData || []).map((contractor: {
          id: string;
          name: string;
          avatar_url?: string;
          organization_name: string;
          access_level: string;
          last_access: string;
          status: string;
        }) => ({
          id: contractor.id,
          name: contractor.name,
          avatar: contractor.avatar_url,
          initials: contractor.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
          organization: contractor.organization_name,
          accessLevel: contractor.access_level as 'admin' | 'read' | 'write',
          lastAccess: formatLastAccess(contractor.last_access),
          status: contractor.status as 'active' | 'pending' | 'suspended'
        }))

        setContractors(transformedContractors)

      } catch (err) {
        console.error('Error fetching contractors:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContractors()
  }, [user])

  const formatLastAccess = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'write': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'read': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const handleProfileClick = (contractor: Contractor) => {
    console.log('View profile for:', contractor.name)
    // TODO: Implement profile view
  }

  const handleAccessClick = (contractor: Contractor) => {
    console.log('Manage access for:', contractor.name)
    // TODO: Implement access management
  }

  const handleActivityClick = (contractor: Contractor) => {
    console.log('View activity for:', contractor.name)
    // TODO: Implement activity view
  }

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Contractors</h3>
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
          {isLoading ? (
            // Skeleton loading state
            <>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </>
          ) : contractors.length > 0 ? (
            <>
              {contractors.slice(0, 3).map((contractor) => (
                <Avatar key={contractor.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={contractor.avatar} alt={contractor.name} />
                  <AvatarFallback className="text-xs font-medium">
                    {contractor.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              {contractors.length > 3 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  +{contractors.length - 3}
                </div>
              )}
            </>
          ) : (
            // Empty skeleton state with add button
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="h-8 w-8 p-0 bg-primary/10 hover:bg-primary/20 text-primary rounded-full"
                title="Add New Contractor"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Contractor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BuildingIcon className="h-5 w-5" />
              Organization Contractors
            </DialogTitle>
            <DialogDescription>
              Manage contractors that have access to your organization&apos;s resources.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isLoading ? (
              // Skeleton loading for modal
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-4 border rounded-lg animate-pulse">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </>
            ) : contractors.length > 0 ? (
              contractors.map((contractor) => (
              <div
                key={contractor.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contractor.avatar} alt={contractor.name} />
                    <AvatarFallback>
                      {contractor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{contractor.name}</h4>
                      <Badge className={getStatusColor(contractor.status)}>
                        {contractor.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{contractor.organization}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getAccessLevelColor(contractor.accessLevel)}>
                        {contractor.accessLevel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Last access: {contractor.lastAccess}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProfileClick(contractor)}
                    className="h-8 w-8 p-0"
                    title="View Profile"
                  >
                    <PersonIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAccessClick(contractor)}
                    className="h-8 w-8 p-0"
                    title="Manage Access"
                  >
                    <EyeOpenIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleActivityClick(contractor)}
                    className="h-8 w-8 p-0"
                    title="Recent Activity"
                  >
                    <ClockIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              ))
            ) : (
              // Empty state for modal
              <div className="text-center py-8">
                <BuildingIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No contractors found</h3>
                <p className="text-muted-foreground mb-4">
                  No contractors have access to your organization yet.
                </p>
                <Button variant="outline" size="sm">
                  Invite Contractor
                </Button>
              </div>
            )}
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
