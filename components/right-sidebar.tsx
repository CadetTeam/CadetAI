"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { ContractorComponent } from "@/components/right-sidebar/contractor-component"
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
          "transition-all duration-300",
          shouldMinimize && "opacity-80 scale-90"
        )}>
          <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-[5px]">
            <div className="rounded-xl p-[10px] space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Call Prep</h3>
              <div className="text-sm text-muted-foreground">
                No call preparation items available.
              </div>
            </div>
          </div>
        </div>

        {/* Contractors Component */}
        <div className={cn(
          "transition-all duration-300",
          shouldMinimize && "opacity-80 scale-90"
        )}>
          <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-[5px]">
            <div className="rounded-xl p-[10px]">
              <ContractorComponent />
            </div>
          </div>
        </div>

        {/* Collaborators Component */}
        <div className={cn(
          "transition-all duration-300",
          shouldMinimize && "opacity-80 scale-90"
        )}>
          <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-[5px]">
            <div className="rounded-xl p-[10px]">
              <CollaboratorsComponent />
            </div>
          </div>
        </div>

        {/* Recent Activity Component */}
        <div className={cn(
          "transition-all duration-300",
          shouldMinimize && "opacity-80 scale-90"
        )}>
          <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-[5px]">
            <div className="rounded-xl p-[10px]">
              <RecentActivityComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
