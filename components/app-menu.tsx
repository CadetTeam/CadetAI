"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
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

interface AppMenuProps {
  currentApp: string
  onAppChange: (appId: string) => void
}

const defaultVisibleApps: App[] = [
  {
    id: "apdgpt",
    name: "APD GPT",
    lightIcon: "/app-icons/lightFolder.png",
    darkIcon: "/app-icons/darkFolder.png",
    href: "/app",
    isActive: true
  }
]

const defaultAvailableApps: App[] = [
  {
    id: "rfpgpt",
    name: "RFP GPT",
    lightIcon: "/app-icons/lightMagnifier.png",
    darkIcon: "/app-icons/darkMagnifier.png",
    href: "/app/rfpgpt"
  },
  {
    id: "responsenow",
    name: "Response Now",
    lightIcon: "/app-icons/lightNote.png",
    darkIcon: "/app-icons/darkTag.png",
    href: "/app/responsenow"
  },
  {
    id: "statusai",
    name: "StatusAI",
    lightIcon: "/app-icons/lightFingerprint.png",
    darkIcon: "/app-icons/darkFingerprint.png",
    href: "/app/statusai"
  },
  {
    id: "forecost",
    name: "ForeCost",
    lightIcon: "/app-icons/lightWallet.png",
    darkIcon: "/app-icons/darkWallet.png",
    href: "/app/forecost"
  },
  {
    id: "commander",
    name: "Commander",
    lightIcon: "/app-icons/lightLayers.png",
    darkIcon: "/app-icons/darkLayers.png",
    href: "/app/commander"
  }
]

export function AppMenu({ currentApp, onAppChange }: AppMenuProps) {
  const { theme } = useTheme()
  const router = useRouter()
  const [visibleApps, setVisibleApps] = useState<App[]>(defaultVisibleApps)
  const [availableApps, setAvailableApps] = useState<App[]>(defaultAvailableApps)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showRemoveMenu, setShowRemoveMenu] = useState<string | null>(null)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)

  // Load persisted app menu state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('appMenuState')
    if (stored) {
      try {
        const { visible, available } = JSON.parse(stored)
        setVisibleApps(visible)
        setAvailableApps(available)
      } catch (e) {
        // If parsing fails, use defaults
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

  // Close remove menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowRemoveMenu(null)
      setShowAddMenu(false)
    }
    if (showRemoveMenu || showAddMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showRemoveMenu, showAddMenu])

  const handleAppClick = (app: App) => {
    onAppChange(app.id)
    router.push(app.href)
  }

  const handleAddApp = (app: App) => {
    setVisibleApps((prev) => [...prev, app])
    setAvailableApps((prev) => prev.filter((a) => a.id !== app.id))
    setShowAddMenu(false)
    handleAppClick(app)
  }

  const handleRemoveApp = (app: App) => {
    if (app.id === 'apdgpt') return // Don't allow removing APD GPT
    setVisibleApps((prev) => prev.filter((a) => a.id !== app.id))
    setAvailableApps((prev) => [...prev, app])
    setShowRemoveMenu(null)
  }

  const handleLongPressStart = (appId: string) => {
    const timer = setTimeout(() => {
      setShowRemoveMenu(appId)
    }, 500) // 500ms long press
    setLongPressTimer(timer)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, appId: string) => {
    e.preventDefault()
    setShowRemoveMenu(appId)
  }

  return (
    <div className="h-screen w-16 bg-background border-r border-border flex flex-col relative z-[60]">

      {/* App Icons */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="space-y-1 px-1">
          {visibleApps.map((app) => {
            const isActive = currentApp === app.id
            // Dark mode uses dark icons (for dark backgrounds), light mode uses light icons (for light backgrounds)
            const iconSrc = theme === 'dark' ? app.darkIcon : app.lightIcon
            console.log(`Loading icon for ${app.name}:`, iconSrc)

            return (
              <div key={app.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAppClick(app)}
                  onMouseDown={() => handleLongPressStart(app.id)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onContextMenu={(e) => handleContextMenu(e, app.id)}
                  onTouchStart={() => handleLongPressStart(app.id)}
                  onTouchEnd={handleLongPressEnd}
                  className={cn(
                    "w-full h-10 p-0 relative group",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <img
                      src={`${iconSrc}?v=2`}
                      alt={app.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        console.error('Failed to load icon:', iconSrc)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                  
                  {/* Badge */}
                  {app.badge && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-blue-500 text-white"
                    >
                      {app.badge}
                    </Badge>
                  )}
                </Button>

                {/* Remove Popover */}
                {showRemoveMenu === app.id && app.id !== 'apdgpt' && (
                  <div className="fixed left-20 z-[9999] bg-popover text-popover-foreground border border-border rounded-md shadow-xl p-2 w-40">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => handleRemoveApp(app)}
                    >
                      Remove from menu
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Section - Add New App */}
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-10 p-0 relative"
          onClick={() => setShowAddMenu((prev) => !prev)}
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <PlusIcon className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </Button>

        {showAddMenu && (
          <div 
            className="fixed bottom-20 left-4 z-[9999] bg-popover text-popover-foreground border border-border rounded-md shadow-xl w-56 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs px-2 py-1 text-muted-foreground">Add to menu</p>
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
                      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                        <img src={`${iconSrc}?v=2`} alt={app.name} className="w-6 h-6 object-contain" />
                      </div>
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
  )
}
