"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ResponsiveTabs } from "@/components/ui/responsive-tabs"
import { OrganizationSettings, SecuritySettings, BillingSettings, NotificationSettings, IntegrationSettings, DataPrivacySettings } from "./tab-components"
import { 
  Shield, 
  CreditCard, 
  Bell, 
  Globe, 
  Database,
  Building,
  Download,
  Upload,
  Save,
  UserPlus,
  ArrowRightLeft
} from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("organization")

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        const res = await fetch('/api/settings', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load settings')
        await res.json()
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load settings'
        setLoadError(message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSettings: {}, orgSettings: {} })
      })
      if (!res.ok) throw new Error('Failed to save settings')
      setSavedAt(new Date().toLocaleTimeString())
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to save settings'
      setSaveError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const renderTabContent = (tabId: string) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {tabId === "organization" && <OrganizationSettings />}
          {tabId === "security" && <SecuritySettings />}
          {tabId === "billing" && <BillingSettings />}
          {tabId === "notifications" && <NotificationSettings />}
          {tabId === "integrations" && <IntegrationSettings />}
          {tabId === "data" && <DataPrivacySettings />}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled={isSaving} onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving…' : 'Save Changes'}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Import Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">FedRAMP Moderate</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SOC 2 Type II</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">GDPR</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">CCPA</span>
                <Badge variant="default">Compliant</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const tabs = [
    { 
      value: "organization", 
      label: "Organization", 
      icon: <Building className="h-4 w-4" />,
      content: renderTabContent("organization")
    },
    { 
      value: "security", 
      label: "Security", 
      icon: <Shield className="h-4 w-4" />,
      content: renderTabContent("security")
    },
    { 
      value: "billing", 
      label: "Billing", 
      icon: <CreditCard className="h-4 w-4" />,
      content: renderTabContent("billing")
    },
    { 
      value: "notifications", 
      label: "Notifications", 
      icon: <Bell className="h-4 w-4" />,
      content: renderTabContent("notifications")
    },
    { 
      value: "integrations", 
      label: "Integrations", 
      icon: <Globe className="h-4 w-4" />,
      content: renderTabContent("integrations")
    },
    { 
      value: "data", 
      label: "Data & Privacy", 
      icon: <Database className="h-4 w-4" />,
      content: renderTabContent("data")
    }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings and preferences</p>
        {loadError && (
          <p className="text-sm text-red-500">{loadError}</p>
        )}
        {saveError && (
          <p className="text-sm text-red-500">{saveError}</p>
        )}
        {savedAt && (
          <p className="text-xs text-muted-foreground">Saved at {savedAt}</p>
        )}
      </div>

      {/* Responsive Tabs */}
      <ResponsiveTabs
        tabs={tabs}
        defaultValue="organization"
        value={activeTab}
        onValueChange={setActiveTab}
        visibleCountMobile={2}
        visibleCountTablet={4}
        visibleCountDesktop={6}
      />
      {/* Content is provided by each tab via ResponsiveTabs */}
    </div>
  )
}

