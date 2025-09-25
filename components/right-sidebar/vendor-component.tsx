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
  Cross2Icon,
  HomeIcon as BuildingIcon
} from "@radix-ui/react-icons"

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

// Mock data - in real app this would come from API
const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Acme Corp",
    initials: "AC",
    organization: "Acme Corporation",
    accessLevel: 'read',
    lastAccess: "2 hours ago",
    status: 'active'
  },
  {
    id: "2", 
    name: "Tech Solutions",
    initials: "TS",
    organization: "Tech Solutions Inc",
    accessLevel: 'write',
    lastAccess: "1 day ago",
    status: 'active'
  },
  {
    id: "3",
    name: "Data Systems",
    initials: "DS", 
    organization: "Data Systems LLC",
    accessLevel: 'read',
    lastAccess: "3 days ago",
    status: 'pending'
  }
]

export function VendorComponent({ className }: VendorComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
          {mockVendors.slice(0, 3).map((vendor) => (
            <Avatar key={vendor.id} className="h-8 w-8 border-2 border-background">
              <AvatarImage src={vendor.avatar} alt={vendor.name} />
              <AvatarFallback className="text-xs font-medium">
                {vendor.initials}
              </AvatarFallback>
            </Avatar>
          ))}
          {mockVendors.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              +{mockVendors.length - 3}
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
              Manage vendors that have access to your organization's resources.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {mockVendors.map((vendor) => (
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
