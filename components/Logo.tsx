"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
  variant?: "full" | "icon" | "avatar"
  size?: number
  className?: string
}

export function Logo({ variant = "full", size = 32, className = "" }: LogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder during SSR
    return (
      <div 
        className={`bg-primary rounded-lg flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-primary-foreground font-bold text-sm">C</span>
      </div>
    )
  }

  const currentTheme = resolvedTheme || theme || "light"
  const isDark = currentTheme === "dark"

  const getLogoSrc = () => {
    switch (variant) {
      case "icon":
        return isDark ? "/logos/cdarki.png" : "/logos/clighti.png"
      case "avatar":
        return "/logos/cadetai-logo-avatar.png"
      case "full":
      default:
        return isDark ? "/logos/cdarkl.png" : "/logos/clightl.png"
    }
  }

  return (
    <Image
      src={getLogoSrc()}
      alt="CadetAI"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}

export default Logo
