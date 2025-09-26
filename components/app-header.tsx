"use client"

import { MagnifyingGlassIcon, BellIcon, QuestionMarkCircledIcon, HeartIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/Logo"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"

export function AppHeader() {
  const { user } = useUser()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Logo variant="icon" size={32} />
        <span className="font-semibold text-lg">CadetAI</span>
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Explore"
            className="pl-10 bg-muted border-border focus:bg-background"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Link href="/app/knowledge-base">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Knowledge Base">
            <HeartIcon className="w-4 h-4" />
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
