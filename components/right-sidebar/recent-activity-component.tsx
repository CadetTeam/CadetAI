"use client"

import { Button } from "@/components/ui/button"


interface RecentActivityComponentProps {
  className?: string
}


export function RecentActivityComponent({ className }: RecentActivityComponentProps) {

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          See all
        </Button>
      </div>

      <div className="space-y-3">
        {/* Skeleton loading states */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-3 p-2 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
