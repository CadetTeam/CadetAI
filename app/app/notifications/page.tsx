"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { RightSidebar } from "@/components/right-sidebar"
import { FloatingChat } from "@/components/floating-chat"
import { MobileAppMenu } from "@/components/mobile-app-menu"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { 
  BellIcon, 
  CheckIcon, 
  TrashIcon,
  ClockIcon,
  PersonIcon,
  FileTextIcon,
  ExclamationTriangleIcon
} from "@radix-ui/react-icons"

interface Notification {
  id: string
  type: 'team' | 'system' | 'document' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionRequired?: boolean
}

export default function NotificationsPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const [currentApp, setCurrentApp] = useState("apdgpt")
  const [isMobile, setIsMobile] = useState(false)
  const [isTabletOrBelow, setIsTabletOrBelow] = useState(false)
  const [isLayoutReady, setIsLayoutReady] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  // Check if mobile/tablet on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTabletOrBelow(window.innerWidth < 1200)
      if (window.innerWidth >= 1200) {
        setShowRightSidebar(true)
      } else {
        setShowRightSidebar(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mark layout as ready once auth is loaded
  useEffect(() => {
    if (isLoaded) {
      setIsLayoutReady(true)
    }
  }, [isLoaded])

  // Load sample notifications
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'team',
        title: 'New Team Member',
        message: 'John Smith has joined your organization',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: false,
        actionRequired: false
      },
      {
        id: '2',
        type: 'system',
        title: 'System Update',
        message: 'Platform updated to version 2.1.0 with new features',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        read: false,
        actionRequired: false
      },
      {
        id: '3',
        type: 'document',
        title: 'Document Shared',
        message: 'APD document shared with Emma Davis',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
        actionRequired: true
      },
      {
        id: '4',
        type: 'warning',
        title: 'Storage Warning',
        message: 'Your storage is 85% full. Consider upgrading your plan.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        actionRequired: true
      },
      {
        id: '5',
        type: 'team',
        title: 'Invitation Sent',
        message: 'Team invitation sent to sarah@company.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
        actionRequired: false
      }
    ]
    setNotifications(sampleNotifications)
  }, [])

  // Show marketing page for unauthenticated users
  if (!isLoaded || !isSignedIn) {
    return <LoadingSkeleton />
  }

  const handleAppChange = (appId: string) => {
    setCurrentApp(appId)
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'team':
        return <PersonIcon className="w-4 h-4" />
      case 'system':
        return <BellIcon className="w-4 h-4" />
      case 'document':
        return <FileTextIcon className="w-4 h-4" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'team':
        return 'text-blue-500'
      case 'system':
        return 'text-green-500'
      case 'document':
        return 'text-purple-500'
      case 'warning':
        return 'text-orange-500'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read
    if (filter === 'read') return notif.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile App Menu - Only show on mobile */}
      {isMobile && (
        <MobileAppMenu currentApp={currentApp} onAppChange={handleAppChange} />
      )}

      
      {/* Left Sidebar - Always show for notifications page */}
      <AppSidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden z-20">
        {/* Header - Always render first */}
        <div className="z-30">
          <AppHeader 
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onRightSidebarToggle={() => setShowRightSidebar((prev) => !prev)}
          />
        </div>
        
        {/* Main Content - Render after layout is ready */}
        <div className="flex-1 flex overflow-hidden">
          <main className={cn(
            "flex-1 overflow-auto",
            isTabletOrBelow ? "px-4 py-2" : "px-6 py-4"
          )}>
            {isLayoutReady ? (
              <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                    <p className="text-muted-foreground mt-1">
                      {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <Button onClick={markAllAsRead} variant="outline" size="sm">
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Mark all as read
                    </Button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
                  {(['all', 'unread', 'read'] as const).map((filterType) => (
                    <Button
                      key={filterType}
                      variant={filter === filterType ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilter(filterType)}
                      className="capitalize"
                    >
                      {filterType}
                      {filterType === 'unread' && unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>

                {/* Notifications List */}
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-1">
                        {filteredNotifications.length > 0 ? (
                          filteredNotifications.map((notification, index) => (
                            <div
                              key={notification.id}
                              className={cn(
                                "flex items-start space-x-4 p-4 hover:bg-accent transition-colors",
                                !notification.read && "bg-blue-50/50 dark:bg-blue-950/20",
                                index !== filteredNotifications.length - 1 && "border-b border-border"
                              )}
                            >
                              <div className={cn("flex-shrink-0 mt-1", getNotificationColor(notification.type))}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h3 className="text-sm font-semibold text-foreground">
                                        {notification.title}
                                      </h3>
                                      {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                      )}
                                      {notification.actionRequired && (
                                        <Badge variant="destructive" className="text-xs">
                                          Action Required
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center space-x-1 mt-2">
                                      <ClockIcon className="w-3 h-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">
                                        {notification.timestamp.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1 ml-4">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => markAsRead(notification.id)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <CheckIcon className="w-4 h-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteNotification(notification.id)}
                                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <BellIcon className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              No {filter} notifications
                            </h3>
                            <p className="text-muted-foreground">
                              {filter === 'unread' 
                                ? "You're all caught up! No unread notifications."
                                : filter === 'read'
                                ? "No read notifications to show."
                                : "No notifications yet."
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <LoadingSkeleton />
            )}
          </main>
          
          {/* Right Sidebar - toggleable; auto-hidden on tablet and below unless opened */}
          {showRightSidebar && (
            <div className="z-30">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
      
      {/* Floating Chat */}
      <FloatingChat />
    </div>
  )
}
