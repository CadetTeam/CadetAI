"use client"

import { ContractorComponent } from "@/components/right-sidebar/contractor-component"
import { CollaboratorsComponent } from "@/components/right-sidebar/collaborators-component"
import { RecentActivityComponent } from "@/components/right-sidebar/recent-activity-component"

export function RightSidebar() {
  return (
    <div className="w-80 relative">
      {/* Content - always full width, transparent background */}
      <div className="relative z-10 p-6 space-y-4">
        {/* Call Prep Section */}
        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-[5px] transition-all duration-300">
          <div className="rounded-xl p-[10px] space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Call Prep</h3>
            <div className="text-sm text-muted-foreground">
              No call preparation items available.
            </div>
          </div>
        </div>

        {/* Contractors Component */}
        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-[5px] transition-all duration-300">
          <div className="rounded-xl p-[10px]">
            <ContractorComponent />
          </div>
        </div>

        {/* Collaborators Component */}
        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-[5px] transition-all duration-300">
          <div className="rounded-xl p-[10px]">
            <CollaboratorsComponent />
          </div>
        </div>

        {/* Recent Activity Component */}
        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-[5px] transition-all duration-300">
          <div className="rounded-xl p-[10px]">
            <RecentActivityComponent />
          </div>
        </div>
      </div>
    </div>
  )
}
