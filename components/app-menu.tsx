"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Image from "next/image"

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

export function AppMenu({ currentApp, onAppChange }: AppMenuProps) {
  const { theme } = useTheme()

  const handleAppClick = (app: App) => {
    onAppChange(app.id)
    // In a real implementation, you would navigate to the app
    console.log(`Switching to ${app.name} app`)
  }

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-16 bg-background border-r border-border flex flex-col">

      {/* App Icons */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1 px-1">
          {apps.map((app) => {
            const isActive = currentApp === app.id
            const iconSrc = theme === 'dark' ? app.lightIcon : app.darkIcon

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
                  <div className="relative w-6 h-6">
                    <Image
                      src={iconSrc}
                      alt={app.name}
                      width={24}
                      height={24}
                      className="object-contain"
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
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-10 p-0"
        >
          <div className="relative w-6 h-6">
            <Image
              src={theme === 'dark' ? "/app-icons/light-add.png" : "/app-icons/dark-add.png"}
              alt="Add New App"
              width={24}
              height={24}
              className="object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
        </Button>
      </div>
    </div>
  )
}
