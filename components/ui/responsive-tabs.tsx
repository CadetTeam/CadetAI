"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

export interface ResponsiveTab {
  value: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
}

interface ResponsiveTabsProps {
  tabs: ResponsiveTab[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  /**
   * Number of tabs to show before collapsing into "More" menu
   * Default: 3 on mobile, 5 on tablet, all on desktop
   */
  visibleCountMobile?: number
  visibleCountTablet?: number
  visibleCountDesktop?: number
}

export function ResponsiveTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
  visibleCountMobile = 2,
  visibleCountTablet = 4,
  visibleCountDesktop = tabs.length,
}: ResponsiveTabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.value || "")
  const [containerWidth, setContainerWidth] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const currentValue = value ?? activeTab

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Determine how many tabs to show based on screen width
  const getVisibleCount = () => {
    if (containerWidth === 0) return visibleCountDesktop
    if (containerWidth < 640) return visibleCountMobile // mobile
    if (containerWidth < 1024) return visibleCountTablet // tablet
    return visibleCountDesktop // desktop
  }

  const visibleCount = getVisibleCount()
  const visibleTabs = tabs.slice(0, visibleCount)
  const hiddenTabs = tabs.slice(visibleCount)

  const handleValueChange = (newValue: string) => {
    setActiveTab(newValue)
    onValueChange?.(newValue)
  }

  return (
    <Tabs
      value={currentValue}
      onValueChange={handleValueChange}
      className={cn("w-full", className)}
      ref={containerRef}
    >
      <div className="border-b border-border">
        <TabsList className="h-auto p-0 bg-transparent w-full justify-start rounded-none">
          {/* Visible tabs */}
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
                "px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm",
                "data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              )}
            >
              <span className="flex items-center gap-1.5 sm:gap-2">
                {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                <span className="truncate">{tab.label}</span>
              </span>
            </TabsTrigger>
          ))}

          {/* "More" dropdown for hidden tabs */}
          {hiddenTabs.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-none border-b-2 h-auto px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm",
                    hiddenTabs.some(tab => tab.value === currentValue)
                      ? "border-primary"
                      : "border-transparent"
                  )}
                >
                  <DotsHorizontalIcon className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {hiddenTabs.map((tab) => (
                  <DropdownMenuItem
                    key={tab.value}
                    onClick={() => handleValueChange(tab.value)}
                    className={cn(
                      "cursor-pointer",
                      currentValue === tab.value && "bg-accent"
                    )}
                  >
                    {tab.icon && <span className="mr-2">{tab.icon}</span>}
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TabsList>
      </div>

      {/* Tab content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4 sm:mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

