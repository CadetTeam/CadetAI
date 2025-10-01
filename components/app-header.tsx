"use client"

import { BellIcon, QuestionMarkCircledIcon, HamburgerMenuIcon, Component1Icon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useState, useEffect } from "react"

export function AppHeader() {
  const { user } = useUser()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      {/* Mobile Menu Button - Only show on mobile */}
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Menu"
        >
          <HamburgerMenuIcon className="w-5 h-5" />
        </Button>
      )}
      
      {/* Spacer for layout */}
      <div className="flex-1" />

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Link href="/app/knowledge-base">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Knowledge Base">
            <Component1Icon className="w-4 h-4" />
          </Button>
        </Link>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <BellIcon className="w-4 h-4" />
        </Button>
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
