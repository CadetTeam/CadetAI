"use client"

import { ContractorComponent } from "@/components/right-sidebar/contractor-component"
import { CollaboratorsComponent } from "@/components/right-sidebar/collaborators-component"
import { RecentActivityComponent } from "@/components/right-sidebar/recent-activity-component"
import { ServiceExpertComponent } from "@/components/right-sidebar/service-expert-component"

export function RightSidebar() {
  return (
    <div className="w-80 relative">
      {/* Content - always full width, transparent background */}
      <div className="relative z-[1] p-6 space-y-4">
        {/* Service Expert Section */}
        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-[5px] transition-all duration-300 hover:bg-white/15 dark:hover:bg-black/15">
          <div className="rounded-xl p-[10px]">
            <ServiceExpertComponent />
          </div>
        </div>

        {/* Contractors Component */}
        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-[5px] transition-all duration-300 hover:bg-white/15 dark:hover:bg-black/15">
          <div className="rounded-xl p-[10px]">
            <ContractorComponent />
          </div>
        </div>

        {/* Collaborators Component */}
        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-[5px] transition-all duration-300 hover:bg-white/15 dark:hover:bg-black/15">
          <div className="rounded-xl p-[10px]">
            <CollaboratorsComponent />
          </div>
        </div>

        {/* Recent Activity Component */}
        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-[5px] transition-all duration-300 hover:bg-white/15 dark:hover:bg-black/15">
          <div className="rounded-xl p-[10px]">
            <RecentActivityComponent />
          </div>
        </div>
      </div>
    </div>
  )
}
