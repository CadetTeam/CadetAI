"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { VendorComponent } from "@/components/right-sidebar/vendor-component"
import { CollaboratorsComponent } from "@/components/right-sidebar/collaborators-component"
import { RecentActivityComponent } from "@/components/right-sidebar/recent-activity-component"
import { cn } from "@/lib/utils"

export function RightSidebar() {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)
  
  // Check if we're on the APD Engine page
  const isAPDEngine = pathname.includes('/apd-gpt/engine')
  
  // Determine if components should be minimized
  const shouldMinimize = isAPDEngine && !isHovered

  return (
    <div 
      className="w-80 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content - always full width, transparent background */}
      <div className="relative z-10 p-6 space-y-4">
        {/* Call Prep Section */}
        <div className={cn(
          "space-y-4 transition-all duration-300",
          shouldMinimize && "opacity-80 scale-90"
        )}>
          <h3 className="text-sm font-semibold text-foreground">Call Prep</h3>
          <div className="text-sm text-muted-foreground">
            No call preparation items available.
          </div>
        </div>

        {/* Vendors Component */}
        <div className={cn(
          "transition-all duration-300",
          shouldMinimize && "opacity-80 scale-90"
        )}>
          <VendorComponent />
        </div>

        {/* Collaborators Component */}
        <div className={cn(
          "transition-all duration-300",
          shouldMinimize && "opacity-80 scale-90"
        )}>
          <CollaboratorsComponent />
        </div>

        {/* Recent Activity Component */}
        <div className={cn(
          "transition-all duration-300",
          shouldMinimize && "opacity-80 scale-90"
        )}>
          <RecentActivityComponent />
        </div>
      </div>
    </div>
  )
}
