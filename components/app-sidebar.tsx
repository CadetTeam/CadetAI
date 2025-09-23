"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Home, 
  FileText, 
  Clock, 
  BarChart3, 
  Plus, 
  Users, 
  UserPlus, 
  Settings, 
  Link as LinkIcon, 
  Globe, 
  Cloud, 
  LogOut,
  RotateCcw,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const mainNavItems = [
  { href: "/app", label: "Home", icon: Home, shortcut: "⌘P" },
  { href: "/app/apd-gpt/engine", label: "APD Engine", icon: FileText, shortcut: "⌘B" },
  { href: "/app/apd-gpt/history", label: "History", icon: Clock, shortcut: "⌘S" },
  { href: "/app/apd-gpt/performance", label: "Performance", icon: BarChart3, shortcut: "⌘K" },
]

const peopleNavItems = [
  { href: "/app/apd-gpt/teams/new", label: "+ New Team", icon: Plus, shortcut: "⌘T" },
  { href: "/app/apd-gpt/teams", label: "Teams", icon: Users },
  { href: "/app/apd-gpt/teams/invite", label: "Invite users", icon: UserPlus, arrow: true },
  { href: "/app/apd-gpt/settings", label: "Settings", icon: Settings, shortcut: "⌘S" },
]

const utilitiesNavItems = [
  { href: "/app/apd-gpt/integrations", label: "Integrations", icon: LinkIcon },
  { href: "/app/apd-gpt/support", label: "Support", icon: Globe },
  { href: "/app/apd-gpt/api", label: "API", icon: Cloud },
  { href: "/app/logout", label: "Log out", icon: LogOut, shortcut: "⌘⇧Q" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex flex-col bg-sidebar border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-center p-4 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">C</span>
        </div>
        {!isCollapsed && (
          <span className="ml-3 text-lg font-semibold text-foreground">ADP GPT</span>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4 space-y-6">
        {/* APD GPT Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              ADP GPT
            </h3>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.shortcut && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {item.shortcut}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <Separator />

        {/* People Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              PEOPLE
            </h3>
          )}
          <nav className="space-y-1">
            {peopleNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.arrow && (
                        <span className="ml-auto text-xs text-muted-foreground">→</span>
                      )}
                      {item.shortcut && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {item.shortcut}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <Separator />

        {/* Utilities Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              UTILITIES
            </h3>
          )}
          <nav className="space-y-1">
            {utilitiesNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.shortcut && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {item.shortcut}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Technologies Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Technologies
            </h3>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">Z</span>
            </div>
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">4+</span>
            </div>
            {!isCollapsed && <span className="text-xs text-muted-foreground">4+</span>}
          </div>
        </div>
      </div>

      {/* Bottom Chat Interface */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          {/* Audio Waveform */}
          <div className="h-8 bg-muted rounded flex items-center justify-center">
            <div className="flex space-x-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 4}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Hey Cadet..."
              className="w-full px-3 py-2 pr-20 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <RotateCcw className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <User className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
