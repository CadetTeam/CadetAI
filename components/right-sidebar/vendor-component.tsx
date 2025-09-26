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
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/supabase-client"

interface Vendor {
  id: string
  name: string
  avatar?: string
  initials: string
  organization: string
  accessLevel: 'read' | 'write' | 'admin'
  lastAccess: string
  status: 'active' | 'pending' | 'suspended'
}

interface VendorComponentProps {
  className?: string
}

export function VendorComponent({ className }: VendorComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    const fetchVendors = async () => {
      if (!user) return

      try {
        setIsLoading(true)

        // Fetch vendors from Supabase
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendors')
          .select('*')
          .eq('user_id', user.id)
          .order('last_access', { ascending: false })
          .limit(10)

        if (vendorError) throw vendorError

        // Transform data to match Vendor interface
        const transformedVendors: Vendor[] = (vendorData || []).map((vendor: {
          id: string;
          name: string;
          avatar_url?: string;
          organization_name: string;
          access_level: string;
          last_access: string;
          status: string;
        }) => ({
          id: vendor.id,
          name: vendor.name,
          avatar: vendor.avatar_url,
          initials: vendor.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
          organization: vendor.organization_name,
          accessLevel: vendor.access_level as 'admin' | 'read' | 'write',
          lastAccess: formatLastAccess(vendor.last_access),
          status: vendor.status
        }))

        setVendors(transformedVendors)

      } catch (err) {
        console.error('Error fetching vendors:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendors()
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

  const handleProfileClick = (vendor: Vendor) => {
    console.log('View profile for:', vendor.name)
    // TODO: Implement profile view
  }

  const handleAccessClick = (vendor: Vendor) => {
    console.log('Manage access for:', vendor.name)
    // TODO: Implement access management
  }

  const handleActivityClick = (vendor: Vendor) => {
    console.log('View activity for:', vendor.name)
    // TODO: Implement activity view
  }

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Vendors</h3>
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
          ) : vendors.length > 0 ? (
            <>
              {vendors.slice(0, 3).map((vendor) => (
                <Avatar key={vendor.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={vendor.avatar} alt={vendor.name} />
                  <AvatarFallback className="text-xs font-medium">
                    {vendor.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              {vendors.length > 3 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  +{vendors.length - 3}
                </div>
              )}
            </>
          ) : (
            // Empty state
            <div className="text-xs text-muted-foreground">
              No vendors yet
            </div>
          )}
        </div>
      </div>

      {/* Vendor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BuildingIcon className="h-5 w-5" />
              Organization Vendors
            </DialogTitle>
            <DialogDescription>
              Manage vendors that have access to your organization&apos;s resources.
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
            ) : vendors.length > 0 ? (
              vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={vendor.avatar} alt={vendor.name} />
                    <AvatarFallback>
                      {vendor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{vendor.name}</h4>
                      <Badge className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{vendor.organization}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getAccessLevelColor(vendor.accessLevel)}>
                        {vendor.accessLevel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Last access: {vendor.lastAccess}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProfileClick(vendor)}
                    className="h-8 w-8 p-0"
                    title="View Profile"
                  >
                    <PersonIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAccessClick(vendor)}
                    className="h-8 w-8 p-0"
                    title="Manage Access"
                  >
                    <EyeOpenIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleActivityClick(vendor)}
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
                <h3 className="text-lg font-semibold text-foreground mb-2">No vendors found</h3>
                <p className="text-muted-foreground mb-4">
                  No vendors have access to your organization yet.
                </p>
                <Button variant="outline" size="sm">
                  Invite Vendor
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
