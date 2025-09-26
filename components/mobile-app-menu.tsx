"use client"

import { useState } from "react"
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

const apps: App[] = [
  {
    id: "apdgpt",
    name: "APD GPT",
    lightIcon: "/app-icons/light-folder.png",
    darkIcon: "/app-icons/dark-folder.png",
    href: "/app",
    isActive: true
  },
  {
    id: "security",
    name: "Security",
    lightIcon: "/app-icons/light-fingerprint.png",
    darkIcon: "/app-icons/dark-fingerprint.png",
    href: "/app/security"
  },
  {
    id: "wallet",
    name: "Wallet",
    lightIcon: "/app-icons/light-wallet.png",
    darkIcon: "/app-icons/dark-wallet.png",
    href: "/app/wallet"
  },
  {
    id: "windows",
    name: "Windows",
    lightIcon: "/app-icons/light-windows.png",
    darkIcon: "/app-icons/dark-windows.png",
    href: "/app/windows"
  },
  {
    id: "files",
    name: "Files",
    lightIcon: "/app-icons/light-folder.png",
    darkIcon: "/app-icons/dark-folder.png",
    href: "/app/files"
  },
  {
    id: "keys",
    name: "Keys",
    lightIcon: "/app-icons/light-key.png",
    darkIcon: "/app-icons/dark-key.png",
    href: "/app/keys"
  }
]

export function MobileAppMenu({ currentApp, onAppChange }: MobileAppMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAppClick = (app: App) => {
    onAppChange(app.id)
    setIsOpen(false)
    // In a real implementation, you would navigate to the app
    console.log(`Switching to ${app.name} app`)
  }

  return (
    <>
      {/* Floating Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 h-10 w-10 p-0 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10 shadow-lg hover:bg-white/20 dark:hover:bg-black/20"
      >
        <HamburgerMenuIcon className="w-5 h-5" />
      </Button>

      {/* Glassmorphic Dropdown Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute top-16 left-4 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-4 min-w-[280px]">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground mb-3 px-2">Apps</h3>
              {apps.map((app) => {
                const isActive = currentApp === app.id
                const iconSrc = app.darkIcon // Use dark icons for better contrast on glassmorphic background

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
                  className="w-full justify-start h-12 px-3 bg-white/5 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                      <PlusIcon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Add New App</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
