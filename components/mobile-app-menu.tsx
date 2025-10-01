"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
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

const defaultVisibleApps: App[] = [
  { id: "apdgpt", name: "APD GPT", lightIcon: "/app-icons/light-folder.png", darkIcon: "/app-icons/dark-folder.png", href: "/app", isActive: true }
]

const defaultAvailableApps: App[] = [
  { id: "rfpgpt", name: "RFP GPT", lightIcon: "/app-icons/light-grid.png", darkIcon: "/app-icons/dark-grid.png", href: "/app/rfpgpt" },
  { id: "responsenow", name: "Response Now", lightIcon: "/app-icons/light-new-doc.png", darkIcon: "/app-icons/dark-new-doc.png", href: "/app/responsenow" },
  { id: "statusai", name: "StatusAI", lightIcon: "/app-icons/light-search.png", darkIcon: "/app-icons/dark-search.png", href: "/app/statusai" },
  { id: "forecost", name: "ForeCost", lightIcon: "/app-icons/light-pricing.png", darkIcon: "/app-icons/dark-pricing.png", href: "/app/forecost" },
  { id: "commander", name: "Commander", lightIcon: "/app-icons/light-cards.png", darkIcon: "/app-icons/dark-cards.png", href: "/app/commander" }
]

export function MobileAppMenu({ currentApp, onAppChange }: MobileAppMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()
  const router = useRouter()
  const [visibleApps, setVisibleApps] = useState<App[]>(defaultVisibleApps)
  const [availableApps, setAvailableApps] = useState<App[]>(defaultAvailableApps)
  const [showAddMenu, setShowAddMenu] = useState(false)

  // Load persisted app menu state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('appMenuState')
    if (stored) {
      try {
        const { visible, available } = JSON.parse(stored)
        setVisibleApps(visible)
        setAvailableApps(available)
      } catch (e) {
        console.error('Failed to load app menu state:', e)
      }
    }
  }, [])

  // Persist app menu state to localStorage
  useEffect(() => {
    localStorage.setItem('appMenuState', JSON.stringify({
      visible: visibleApps,
      available: availableApps
    }))
  }, [visibleApps, availableApps])

  const handleAppClick = (app: App) => {
    onAppChange(app.id)
    setIsOpen(false)
    router.push(app.href)
  }

  const handleAddApp = (app: App) => {
    setVisibleApps((prev) => [...prev, app])
    setAvailableApps((prev) => prev.filter((a) => a.id !== app.id))
    setShowAddMenu(false)
    handleAppClick(app)
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
              {visibleApps.map((app) => {
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
                      <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <Image
                          src={iconSrc}
                          alt={app.name}
                          width={32}
                          height={32}
                          className="object-contain"
                          unoptimized
                          priority
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
                  <div className="absolute left-4 mt-2 z-[9999] bg-popover text-popover-foreground border border-border rounded-md shadow-xl w-64 p-2">
                    <div className="space-y-1 max-h-60 overflow-auto">
                      {availableApps.map((app) => {
                        const iconSrc = theme === 'dark' ? app.darkIcon : app.lightIcon
                        return (
                          <Button
                            key={app.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-9 px-2"
                            onClick={() => handleAddApp(app)}
                          >
                            <div className="flex items-center space-x-2">
                              <Image src={iconSrc} alt={app.name} width={24} height={24} className="object-contain" unoptimized priority />
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
