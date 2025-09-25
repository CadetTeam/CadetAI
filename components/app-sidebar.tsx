"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  HomeIcon,
  FileTextIcon,
  ClockIcon,
  BarChartIcon,
  PlusIcon,
  PersonIcon,
  ExitIcon,
  GearIcon,
  LinkBreak1Icon,
  GlobeIcon,
  CodeIcon,
  UpdateIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HamburgerMenuIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/Logo"

const mainNavItems = [
  { href: "/app", label: "Home", icon: HomeIcon, shortcut: "⌘P" },
  { href: "/app/apd-gpt/engine", label: "APD Engine", icon: FileTextIcon, shortcut: "⌘B" },
  { href: "/app/apd-gpt/history", label: "History", icon: ClockIcon, shortcut: "⌘S" },
  { href: "/app/apd-gpt/performance", label: "Performance", icon: BarChartIcon, shortcut: "⌘K" },
]

const peopleNavItems = [
  { href: "/app/apd-gpt/teams/new", label: "+ New Team", icon: PlusIcon, shortcut: "⌘T" },
  { href: "/app/apd-gpt/teams", label: "Teams", icon: PersonIcon },
  { href: "/app/apd-gpt/teams/invite", label: "Invite users", icon: PlusIcon, arrow: true },
  { href: "/app/apd-gpt/settings", label: "Settings", icon: GearIcon, shortcut: "⌘S" },
]

const utilitiesNavItems = [
  { href: "/app/apd-gpt/integrations", label: "Integrations", icon: LinkBreak1Icon },
  { href: "/app/apd-gpt/support", label: "Support", icon: GlobeIcon },
  { href: "/app/apd-gpt/api", label: "API", icon: CodeIcon },
  { href: "/app/logout", label: "Log out", icon: ExitIcon, shortcut: "⌘⇧Q" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true) // Default to expanded

  // Define pages where sidebar should be collapsed
  const collapsedPages = [
    '/app/apd-gpt/engine',
    '/app/apd-gpt/history', 
    '/app/apd-gpt/performance'
  ]
  
  const shouldCollapseOnThisPage = collapsedPages.includes(pathname)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-collapse on specific pages
  useEffect(() => {
    if (!isMobile && shouldCollapseOnThisPage) {
      setIsCollapsed(true)
      setIsExpanded(false)
    } else if (!isMobile && !shouldCollapseOnThisPage) {
      setIsCollapsed(false)
      setIsExpanded(true)
    }
  }, [pathname, isMobile, shouldCollapseOnThisPage])

  const shouldShowExpanded = !isMobile && (isHovered || isExpanded)
  const sidebarWidth = isMobile ? (isExpanded ? "w-64" : "w-16") : (shouldShowExpanded ? "w-64" : "w-16")

  return (
    <div 
      className={cn(
        "flex flex-col bg-sidebar border-r border-border transition-all duration-300 relative",
        sidebarWidth
      )}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full bg-sidebar border border-border hover:bg-accent"
        onClick={() => {
          if (isMobile) {
            setIsExpanded(!isExpanded)
          } else {
            // Only allow manual toggle if not on auto-collapse pages
            if (!shouldCollapseOnThisPage) {
              setIsCollapsed(!isCollapsed)
              setIsExpanded(!isExpanded)
            }
          }
        }}
      >
        {isMobile ? (
          <HamburgerMenuIcon className="w-4 h-4" />
        ) : (
          isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />
        )}
      </Button>

      {/* Logo */}
      <div className="flex items-center justify-center p-4 border-b border-border">
        <Logo variant="icon" size={shouldShowExpanded ? 32 : 40} className="flex-shrink-0" />
        {shouldShowExpanded && (
          <span className="ml-3 text-lg font-semibold text-foreground">CadetAI</span>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4 space-y-6">
        {/* APD GPT Section */}
        <div className="space-y-2">
          {shouldShowExpanded && (
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
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                    !shouldShowExpanded && "justify-center"
                  )}
                  title={!shouldShowExpanded ? item.label : undefined}
                >
                  <item.icon className={cn("transition-all", shouldShowExpanded ? "w-4 h-4" : "w-5 h-5")} />
                  {shouldShowExpanded && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.shortcut && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {item.shortcut}
                        </span>
                      )}
                    </>
                  )}
                  {/* Tooltip for collapsed state */}
                  {!shouldShowExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                      {item.shortcut && (
                        <span className="ml-2 text-muted-foreground">{item.shortcut}</span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <Separator />

        {/* People Section */}
        <div className="space-y-2">
          {shouldShowExpanded && (
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
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                    !shouldShowExpanded && "justify-center"
                  )}
                  title={!shouldShowExpanded ? item.label : undefined}
                >
                  <item.icon className={cn("transition-all", shouldShowExpanded ? "w-4 h-4" : "w-5 h-5")} />
                  {shouldShowExpanded && (
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
                  {/* Tooltip for collapsed state */}
                  {!shouldShowExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                      {item.shortcut && (
                        <span className="ml-2 text-muted-foreground">{item.shortcut}</span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <Separator />

        {/* Utilities Section */}
        <div className="space-y-2">
          {shouldShowExpanded && (
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
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                    !shouldShowExpanded && "justify-center"
                  )}
                  title={!shouldShowExpanded ? item.label : undefined}
                >
                  <item.icon className={cn("transition-all", shouldShowExpanded ? "w-4 h-4" : "w-5 h-5")} />
                  {shouldShowExpanded && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.shortcut && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {item.shortcut}
                        </span>
                      )}
                    </>
                  )}
                  {/* Tooltip for collapsed state */}
                  {!shouldShowExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                      {item.shortcut && (
                        <span className="ml-2 text-muted-foreground">{item.shortcut}</span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Technologies Section */}
        <div className="space-y-2">
          {shouldShowExpanded && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Technologies
            </h3>
          )}
          <div className={cn(
            "flex items-center",
            shouldShowExpanded ? "space-x-2" : "justify-center"
          )}>
            <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">Z</span>
            </div>
            <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">4+</span>
            </div>
            {shouldShowExpanded && <span className="text-xs text-muted-foreground">4+</span>}
          </div>
        </div>
      </div>

      {/* Bottom Chat Interface */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          {/* Audio Waveform */}
          {shouldShowExpanded && (
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
          )}

          {/* Chat Input */}
          <div className="relative">
            {shouldShowExpanded ? (
              <input
                type="text"
                placeholder="Hey Cadet..."
                className="w-full px-3 py-2 pr-20 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full h-8 bg-muted hover:bg-accent"
                title="Chat with Cadet"
              >
                <UpdateIcon className="w-4 h-4" />
              </Button>
            )}
            {shouldShowExpanded && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <UpdateIcon className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <PersonIcon className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <PlusIcon className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
