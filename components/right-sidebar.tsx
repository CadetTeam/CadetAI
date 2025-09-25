"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { VendorComponent } from "@/components/right-sidebar/vendor-component"
import { CollaboratorsComponent } from "@/components/right-sidebar/collaborators-component"
import { RecentActivityComponent } from "@/components/right-sidebar/recent-activity-component"
import { cn } from "@/lib/utils"

export function RightSidebar() {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)
  
  // Check if we're on the APD Engine page
  const isAPDEngine = pathname.includes('/apd-gpt/engine')
  
  // Determine if sidebar should be shrunk
  const shouldShrink = isAPDEngine && !isHovered

  return (
    <div 
      className={cn(
        "bg-background border-l border-border overflow-auto transition-all duration-300",
        shouldShrink ? "w-40" : "w-80",
        "relative"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clickable background overlay for APD Engine */}
      {isAPDEngine && (
        <div 
          className="absolute inset-0 bg-transparent z-0 pointer-events-auto"
          onClick={() => {
            // Allow clicking through to the canvas behind
            console.log('Clicked through right sidebar')
          }}
        />
      )}
      
      {/* Content with proper z-index */}
      <div className={cn(
        "relative z-10 p-6 space-y-6",
        shouldShrink && "pointer-events-none"
      )}>
        {/* Call Prep Section */}
        <div className={cn(
          "space-y-4 transition-all duration-300",
          shouldShrink && "opacity-50 scale-50 origin-bottom"
        )}>
          <h3 className="text-sm font-semibold text-foreground">Call Prep</h3>
          <div className="text-sm text-muted-foreground">
            No call preparation items available.
          </div>
        </div>

        <Separator className={cn(
          "transition-all duration-300",
          shouldShrink && "opacity-50 scale-50 origin-bottom"
        )} />

        {/* Vendors Component */}
        <div className={cn(
          "transition-all duration-300",
          shouldShrink && "opacity-50 scale-50 origin-bottom"
        )}>
          <VendorComponent />
        </div>

        <Separator className={cn(
          "transition-all duration-300",
          shouldShrink && "opacity-50 scale-50 origin-bottom"
        )} />

        {/* Collaborators Component */}
        <div className={cn(
          "transition-all duration-300",
          shouldShrink && "opacity-50 scale-50 origin-bottom"
        )}>
          <CollaboratorsComponent />
        </div>

        <Separator className={cn(
          "transition-all duration-300",
          shouldShrink && "opacity-50 scale-50 origin-bottom"
        )} />

        {/* Recent Activity Component */}
        <div className={cn(
          "transition-all duration-300",
          shouldShrink && "opacity-50 scale-50 origin-bottom"
        )}>
          <RecentActivityComponent />
        </div>
      </div>
    </div>
  )
}
