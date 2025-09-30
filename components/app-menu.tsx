"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Image from "next/image"
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

const initialVisibleApps: App[] = [
  {
    id: "adpgpt",
    name: "ADP GPT",
    lightIcon: "/app-icons/light-folder.png",
    darkIcon: "/app-icons/dark-folder.png",
    href: "/app",
    isActive: true
  },
  {
    id: "rfpgpt",
    name: "RFP GPT",
    lightIcon: "/app-icons/light-grid.png",
    darkIcon: "/app-icons/dark-grid.png",
    href: "/app/rfp-gpt"
  },
  {
    id: "responsenow",
    name: "Response Now",
    lightIcon: "/app-icons/light-new-doc.png",
    darkIcon: "/app-icons/dark-new-doc.png",
    href: "/app/response-now"
  }
]

const initialAvailableApps: App[] = [
  {
    id: "statusai",
    name: "StatusAI",
    lightIcon: "/app-icons/light-search.png",
    darkIcon: "/app-icons/dark-search.png",
    href: "/app/statusai"
  },
  {
    id: "forecost",
    name: "ForeCost",
    lightIcon: "/app-icons/light-pricing.png",
    darkIcon: "/app-icons/dark-pricing.png",
    href: "/app/forecost"
  },
  {
    id: "commander",
    name: "Commander",
    lightIcon: "/app-icons/light-cards.png",
    darkIcon: "/app-icons/dark-cards.png",
    href: "/app/commander"
  }
]

export function AppMenu({ currentApp, onAppChange }: AppMenuProps) {
  const { theme } = useTheme()
  const router = useRouter()
  const [visibleApps, setVisibleApps] = useState<App[]>(initialVisibleApps)
  const [availableApps, setAvailableApps] = useState<App[]>(initialAvailableApps)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const handleAppClick = (app: App) => {
    onAppChange(app.id)
    router.push(app.href)
  }

  return (
    <div className="h-screen w-16 bg-background border-r border-border flex flex-col">

      {/* App Icons */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="space-y-1 px-1">
          {visibleApps.slice(0, 3).map((app) => {
            const isActive = currentApp === app.id
            const iconSrc = theme === 'dark' ? app.darkIcon : app.lightIcon

            return (
              <div key={app.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAppClick(app)}
                  className={cn(
                    "w-full h-10 p-0 relative group",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
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
                  
                  {/* Badge */}
                  {app.badge && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-blue-500 text-white"
                    >
                      {app.badge}
                    </Badge>
                  )}
                </Button>
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
          <div className="fixed bottom-20 left-4 z-[9999] bg-popover text-popover-foreground border border-border rounded-md shadow-xl w-56 p-2">
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
  )
}
