"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { NewTeamCard } from "@/components/cards/new-team-card"
import { InviteUsersCard } from "@/components/cards/invite-users-card"
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
  ChevronLeftIcon,
  ChevronRightIcon,
  HamburgerMenuIcon,
  AvatarIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/Logo"

const mainNavItems = [
  { href: "/app", label: "Home", icon: HomeIcon, shortcut: "⌘H" },
  { href: "/app/apd-gpt/engine", label: "APD Engine", icon: FileTextIcon, shortcut: "⌘B" },
  { href: "/app/apd-gpt/history", label: "History", icon: ClockIcon, shortcut: "⌘S" },
  { href: "/app/apd-gpt/performance", label: "Performance", icon: BarChartIcon, shortcut: "⌘K" },
]

const peopleNavItems = [
  { href: "/app/apd-gpt/teams/new", label: "New Team", icon: PlusIcon, shortcut: "⌘T", isModal: true },
  { href: "/app/apd-gpt/teams", label: "Teams", icon: AvatarIcon },
  { href: "/app/apd-gpt/teams/invite", label: "Invite users", icon: PersonIcon, arrow: true, isModal: true },
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
  const { signOut } = useClerk()
  const [isCollapsed, setIsCollapsed] = useState(false) // Default to expanded
  const [isMobile, setIsMobile] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true) // Default to expanded
  const [isNewTeamCardOpen, setIsNewTeamCardOpen] = useState(false)
  const [isInviteUsersCardOpen, setIsInviteUsersCardOpen] = useState(false)
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 })

  // Check if mobile on mount and resize, and auto-collapse on specific pages
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    // Auto-collapse sidebar on History and APD Engine pages, but keep expanded on home page
    const isHomePage = pathname === '/app'
    const shouldAutoCollapse = (pathname.includes('/apd-gpt/history') || pathname.includes('/apd-gpt/engine')) && !isHomePage
    
    if (shouldAutoCollapse) {
      setIsCollapsed(true)
      setIsExpanded(false)
    } else if (isHomePage) {
      // Ensure home page defaults to expanded
      setIsCollapsed(false)
      setIsExpanded(true)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [pathname])

  const shouldShowExpanded = !isMobile && (isHovered || isExpanded)
  const sidebarWidth = isMobile ? (isExpanded ? "w-64" : "w-16") : (shouldShowExpanded ? "w-64" : "w-16")
  const collapsedItemClasses = !shouldShowExpanded ? "justify-center h-10 w-10 p-0" : ""

  const handleCardAction = (href: string, event: React.MouseEvent) => {
    const buttonRect = event.currentTarget.getBoundingClientRect()
    const position = {
      top: buttonRect.top,
      left: buttonRect.right + 8 // Position to the right of the button
    }
    setCardPosition(position)
    
    if (href === "/app/apd-gpt/teams/new") {
      setIsNewTeamCardOpen(true)
      setIsInviteUsersCardOpen(false)
    } else if (href === "/app/apd-gpt/teams/invite") {
      setIsInviteUsersCardOpen(true)
      setIsNewTeamCardOpen(false)
    }
  }

  const handleAPDEngineClick = () => {
    // Minimize the sidebar when APD Engine is clicked
    setIsCollapsed(true)
    setIsExpanded(false)
    // Navigate to APD Engine page
    window.location.href = "/app/apd-gpt/engine"
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirectUrl: "/auth-unified" })
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

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
            setIsCollapsed(!isCollapsed)
            setIsExpanded(!isExpanded)
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
              APD GPT
            </h3>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href
              const isAPDEngine = item.href === "/app/apd-gpt/engine"
              
              if (isAPDEngine) {
                return (
                  <button
                    key={item.href}
                    onClick={handleAPDEngineClick}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative w-full",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground",
                      collapsedItemClasses
                    )}
                    title={!shouldShowExpanded ? item.label : undefined}
                  >
                    <item.icon className={cn("w-5 h-5", !shouldShowExpanded && "w-6 h-6") } />
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
                  </button>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                    collapsedItemClasses
                  )}
                  title={!shouldShowExpanded ? item.label : undefined}
                >
                  <item.icon className={cn("w-5 h-5", !shouldShowExpanded && "w-6 h-6") } />
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
              const isModalAction = 'isModal' in item && item.isModal
              
              const commonClassName = cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                "hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground",
                !shouldShowExpanded && "justify-center"
              )

              if (isModalAction) {
                return (
                  <button
                    key={item.href}
                    onClick={(e) => handleCardAction(item.href, e)}
                    className={commonClassName}
                    title={!shouldShowExpanded ? item.label : undefined}
                  >
                           <item.icon className="w-5 h-5" />
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
                  </button>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={commonClassName}
                  title={!shouldShowExpanded ? item.label : undefined}
                >
                           <item.icon className="w-5 h-5" />
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
              const isLogout = item.href === "/app/logout"
              
              if (isLogout) {
                return (
                  <button
                    key={item.href}
                    onClick={handleLogout}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative w-full",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground",
                      !shouldShowExpanded && "justify-center"
                    )}
                    title={!shouldShowExpanded ? item.label : undefined}
                  >
                           <item.icon className="w-5 h-5" />
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
                  </button>
                )
              }
              
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
                           <item.icon className="w-5 h-5" />
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
      </div>

      {/* Cards */}
      <NewTeamCard 
        isOpen={isNewTeamCardOpen} 
        onClose={() => setIsNewTeamCardOpen(false)}
        position={cardPosition}
      />
      <InviteUsersCard 
        isOpen={isInviteUsersCardOpen} 
        onClose={() => setIsInviteUsersCardOpen(false)}
        position={cardPosition}
      />
    </div>
  )
}
