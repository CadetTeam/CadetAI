"use client"

import { BellIcon, QuestionMarkCircledIcon, Component1Icon, DropdownMenuIcon } from "@radix-ui/react-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  onMobileMenuToggle?: () => void
  onRightSidebarToggle?: () => void
}

export function AppHeader({ onMobileMenuToggle, onRightSidebarToggle }: AppHeaderProps = {}) {
  const { user } = useUser()
  const [isMobile, setIsMobile] = useState(false)
  const [isTabletOrBelow, setIsTabletOrBelow] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTabletOrBelow(window.innerWidth < 1200) // Match app-layout breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <header className={cn(
      "flex items-center justify-between border-b border-border bg-background",
      isTabletOrBelow ? "px-4 py-3" : "px-6 py-4"
    )}>
      {/* Mobile Menu Button - Show on tablet and below */}
      {isTabletOrBelow && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Menu"
          onClick={onMobileMenuToggle}
        >
          <DropdownMenuIcon className="w-5 h-5" />
        </Button>
      )}
      
      {/* Spacer for layout */}
      <div className="flex-1" />

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2 relative">
        <ThemeToggle />
        {/* Tablet+ right sidebar toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hidden xl:inline-flex"
          title="Toggle right panel"
          onClick={onRightSidebarToggle}
        >
          <Component1Icon className="w-4 h-4" />
        </Button>
        <Link href="/app/knowledge-base">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Knowledge Base">
            <Component1Icon className="w-4 h-4" />
          </Button>
        </Link>
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
              setAnchorRect(rect)
              setShowNotifications((prev) => !prev)
            }}
            title="Notifications"
          >
            <BellIcon className="w-4 h-4" />
          </Button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 z-50">
              <Card className="w-80 bg-popover text-popover-foreground border border-border shadow-xl">
                <CardHeader className="p-3 border-b border-border">
                  <CardTitle className="text-sm">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="max-h-80">
                    <div className="p-2 space-y-3">
                      <div>
                        <div className="px-2 py-1 text-xs text-muted-foreground">Today</div>
                        <div className="space-y-1">
                          <div className="p-3 rounded-lg hover:bg-accent flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium">Team invite accepted</div>
                              <div className="text-xs text-muted-foreground">Alex joined your organization</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Mark read</Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Dismiss</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="px-2 py-1 text-xs text-muted-foreground">Earlier</div>
                        <div className="space-y-1">
                          <div className="p-3 rounded-lg hover:bg-accent flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium">Billing updated</div>
                              <div className="text-xs text-muted-foreground">Your card ending in 4242 was charged</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">View</Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Dismiss</Button>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg hover:bg-accent flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium">New integration connected</div>
                              <div className="text-xs text-muted-foreground">Slack is now linked to your workspace</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Open</Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Dismiss</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="border-t border-border p-2">
                    <Link href="/app/notifications">
                      <Button variant="ghost" className="w-full justify-center">View All</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <QuestionMarkCircledIcon className="w-4 h-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
          <AvatarFallback>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
