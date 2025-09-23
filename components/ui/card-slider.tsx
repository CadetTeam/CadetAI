"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface CardSliderProps {
  title: string
  seeAllHref?: string
  cards: Array<{
    id: string | number
    title: string
    description: string
    stats?: Array<{
      label: string
      value: string | number
      icon?: React.ComponentType<{ className?: string }>
    }>
    isActive?: boolean
    isLoading?: boolean
    isEmpty?: boolean
  }>
  className?: string
}

export function CardSlider({ title, seeAllHref, cards, className }: CardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const cardWidth = 320 // Card width + gap
  const visibleCards = 3

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const nextSlide = () => {
    const maxIndex = Math.max(0, cards.length - visibleCards)
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const canGoNext = currentIndex < Math.max(0, cards.length - visibleCards)
  const canGoPrev = currentIndex > 0

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {seeAllHref && (
          <Button variant="ghost" size="sm">
            See all
          </Button>
        )}
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        {cards.length > visibleCards && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
              onClick={prevSlide}
              disabled={!canGoPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
              onClick={nextSlide}
              disabled={!canGoNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Cards Container */}
        <div 
          ref={sliderRef}
          className="overflow-hidden"
        >
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-6"
            style={{ 
              transform: `translateX(-${currentIndex * cardWidth}px)`,
              width: `${cards.length * cardWidth}px`
            }}
          >
            {cards.map((card) => (
              <div key={card.id} className="flex-shrink-0" style={{ width: `${cardWidth - 24}px` }}>
                {card.isLoading ? (
                  <CardSkeleton />
                ) : card.isEmpty ? (
                  <EmptyStateCard />
                ) : (
                  <Card className={cn(
                    "transition-all duration-200 hover:shadow-md h-full",
                    card.isActive && "ring-2 ring-primary"
                  )}>
                    <CardHeader>
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-primary mt-1" />
                        <div className="flex-1">
                          <CardTitle className="text-lg">{card.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {card.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {card.stats && (
                        <div className="space-y-2">
                          {card.stats.map((stat, statIndex) => (
                            <div key={statIndex} className="flex justify-between text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                {stat.icon && <stat.icon className="h-4 w-4" />}
                                <span>{stat.label}</span>
                              </div>
                              <span>{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {cards.length > visibleCards && (
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: Math.ceil(cards.length / visibleCards) }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  Math.floor(currentIndex / visibleCards) === index
                    ? "bg-primary"
                    : "bg-muted"
                )}
                onClick={() => setCurrentIndex(index * visibleCards)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <div className="flex items-start space-x-3">
          <Skeleton className="h-5 w-5 mt-1" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyStateCard() {
  return (
    <Card className="bg-muted/30 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No items available</h3>
        <p className="text-sm text-muted-foreground text-center">
          Create your first item to get started
        </p>
      </CardContent>
    </Card>
  )
}
