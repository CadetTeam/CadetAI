"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  HomeIcon,
  LockClosedIcon,
  PersonIcon,
  DesktopIcon,
  FileTextIcon,
  LockClosedIcon as KeyIcon,
  PlusIcon
} from "@radix-ui/react-icons"

interface App {
  id: string
  name: string
  icon: React.ElementType
  href: string
  isActive?: boolean
  badge?: string
}

interface AppMenuProps {
  currentApp: string
  onAppChange: (appId: string) => void
}

const apps: App[] = [
  {
    id: "apdgpt",
    name: "APD GPT",
    icon: HomeIcon,
    href: "/app",
    isActive: true
  },
  {
    id: "security",
    name: "Security",
    icon: LockClosedIcon,
    href: "/app/security"
  },
  {
    id: "wallet",
    name: "Wallet",
    icon: PersonIcon,
    href: "/app/wallet"
  },
  {
    id: "windows",
    name: "Windows",
    icon: DesktopIcon,
    href: "/app/windows"
  },
  {
    id: "files",
    name: "Files",
    icon: FileTextIcon,
    href: "/app/files"
  },
  {
    id: "keys",
    name: "Keys",
    icon: KeyIcon,
    href: "/app/keys"
  }
]

export function AppMenu({ currentApp, onAppChange }: AppMenuProps) {

  const handleAppClick = (app: App) => {
    onAppChange(app.id)
    // In a real implementation, you would navigate to the app
    console.log(`Switching to ${app.name} app`)
  }

  return (
    <div className="h-full w-16 bg-background border-r border-border flex flex-col">

      {/* App Icons */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1 px-1">
          {apps.map((app) => {
            const isActive = currentApp === app.id

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
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <app.icon className="w-6 h-6" />
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
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-10 p-0"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <PlusIcon className="w-6 h-6 opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </Button>
      </div>
    </div>
  )
}
