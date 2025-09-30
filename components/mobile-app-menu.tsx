"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { 
  HamburgerMenuIcon,
  PlusIcon
} from "@radix-ui/react-icons"

interface App {
  id: string
  name: string
  lightIcon: string
  darkIcon: string
  href: string
  isActive?: boolean
  badge?: string
}

interface MobileAppMenuProps {
  currentApp: string
  onAppChange: (appId: string) => void
}

const initialVisibleApps: App[] = [
  { id: "adpgpt", name: "ADP GPT", lightIcon: "/app-icons/light-folder.png", darkIcon: "/app-icons/dark-folder.png", href: "/app", isActive: true },
  { id: "rfpgpt", name: "RFP GPT", lightIcon: "/app-icons/light-grid.png", darkIcon: "/app-icons/dark-grid.png", href: "/app/rfp-gpt" },
  { id: "responsenow", name: "Response Now", lightIcon: "/app-icons/light-new-doc.png", darkIcon: "/app-icons/dark-new-doc.png", href: "/app/response-now" },
]

const initialAvailableApps: App[] = [
  { id: "statusai", name: "StatusAI", lightIcon: "/app-icons/light-search.png", darkIcon: "/app-icons/dark-search.png", href: "/app/statusai" },
  { id: "forecost", name: "ForeCost", lightIcon: "/app-icons/light-pricing.png", darkIcon: "/app-icons/dark-pricing.png", href: "/app/forecost" },
  { id: "commander", name: "Commander", lightIcon: "/app-icons/light-cards.png", darkIcon: "/app-icons/dark-cards.png", href: "/app/commander" },
]

export function MobileAppMenu({ currentApp, onAppChange }: MobileAppMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()
  const [visibleApps, setVisibleApps] = useState<App[]>(initialVisibleApps)
  const [availableApps, setAvailableApps] = useState<App[]>(initialAvailableApps)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const handleAppClick = (app: App) => {
    onAppChange(app.id)
    setIsOpen(false)
    // In a real implementation, you would navigate to the app
    console.log(`Switching to ${app.name} app`)
  }

  return (
    <>
      {/* Floating Menu Button - placed below header */}
      <div className="fixed left-4 top-[74px] z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 w-10 p-0 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10 shadow-lg hover:bg-white/20 dark:hover:bg-black/20"
        >
          <HamburgerMenuIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Glassmorphic Dropdown Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute top-16 left-4 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-4 min-w-[280px]">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground mb-3 px-2">Apps</h3>
              {visibleApps.slice(0, 3).map((app) => {
                const isActive = currentApp === app.id
                const iconSrc = theme === 'dark' ? app.darkIcon : app.lightIcon

                return (
                  <Button
                    key={app.id}
                    variant="ghost"
                    onClick={() => handleAppClick(app)}
                    className={cn(
                      "w-full justify-start h-12 px-3 bg-white/5 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg",
                      isActive && "bg-white/15 dark:bg-black/15"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <Image
                          src={iconSrc}
                          alt={app.name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">{app.name}</span>
                      {app.badge && (
                        <Badge className="ml-auto bg-blue-500/20 text-blue-600 dark:text-blue-400 border-0">
                          {app.badge}
                        </Badge>
                      )}
                    </div>
                  </Button>
                )
              })}
              
              {/* Add New App */}
              <div className="border-t border-white/20 dark:border-white/10 pt-2 mt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 px-3 bg-white/5 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg relative"
                  onClick={() => setShowAddMenu((prev) => !prev)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                      <PlusIcon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Add New App</span>
                  </div>
                </Button>
                {showAddMenu && (
                  <div className="absolute left-4 mt-2 z-50 bg-popover text-popover-foreground border border-border rounded-md shadow-md w-64 p-2">
                    <div className="space-y-1 max-h-60 overflow-auto">
                      {availableApps.map((app) => {
                        const iconSrc = theme === 'dark' ? app.darkIcon : app.lightIcon
                        return (
                          <Button
                            key={app.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-9 px-2"
                            onClick={() => {
                              setVisibleApps((prev) => [...prev, app])
                              setAvailableApps((prev) => prev.filter((a) => a.id !== app.id))
                              setShowAddMenu(false)
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <Image src={iconSrc} alt={app.name} width={20} height={20} />
                              <span className="text-sm">{app.name}</span>
                            </div>
                          </Button>
                        )
                      })}
                      {availableApps.length === 0 && (
                        <div className="px-2 py-1 text-xs text-muted-foreground">No more apps</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
