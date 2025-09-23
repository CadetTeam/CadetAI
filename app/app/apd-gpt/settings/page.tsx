"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  CreditCard, 
  Bell, 
  Globe, 
  Lock,
  Database,
  Users,
  Building,
  Download,
  Upload,
  Trash2,
  Save
} from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("organization")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const tabs = [
    { id: "organization", label: "Organization", icon: Building },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Globe },
    { id: "data", label: "Data & Privacy", icon: Database }
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
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center space-x-2"
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Settings */}
          {activeTab === "organization" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Organization Information</span>
                  </CardTitle>
                  <CardDescription>
                    Update your organization details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input id="org-name" defaultValue="California Department of Health Care Services" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-type">Organization Type</Label>
                      <Input id="org-type" defaultValue="Government Agency" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-description">Description</Label>
                    <Textarea 
                      id="org-description" 
                      defaultValue="State agency responsible for administering California's Medicaid program and other health care services."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-email">Contact Email</Label>
                      <Input id="org-email" type="email" defaultValue="contact@dhcs.ca.gov" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-phone">Phone Number</Label>
                      <Input id="org-phone" defaultValue="(916) 440-7400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-address">Address</Label>
                    <Input id="org-address" defaultValue="1501 Capitol Avenue, Sacramento, CA 95814" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Team Management</span>
                  </CardTitle>
                  <CardDescription>
                    Configure team settings and user permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow team invitations</Label>
                      <p className="text-sm text-muted-foreground">Let team members invite new users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require admin approval</Label>
                      <p className="text-sm text-muted-foreground">New members require admin approval</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable guest access</Label>
                      <p className="text-sm text-muted-foreground">Allow external users to access projects</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Policies</span>
                  </CardTitle>
                  <CardDescription>
                    Configure security settings and compliance requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable FIPS 140-2 compliance</Label>
                      <p className="text-sm text-muted-foreground">Use FIPS 140-2 validated cryptographic modules</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require MFA for all users</Label>
                      <p className="text-sm text-muted-foreground">Enforce multi-factor authentication</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP whitelist enforcement</Label>
                      <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session timeout (minutes)</Label>
                      <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                    </div>
                    <Input type="number" defaultValue="30" className="w-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Password Policy</span>
                  </CardTitle>
                  <CardDescription>
                    Set password requirements and rotation policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Minimum password length</Label>
                      <p className="text-sm text-muted-foreground">Require at least 8 characters</p>
                    </div>
                    <Input type="number" defaultValue="12" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Password rotation (days)</Label>
                      <p className="text-sm text-muted-foreground">Force password changes every 90 days</p>
                    </div>
                    <Input type="number" defaultValue="90" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require special characters</Label>
                      <p className="text-sm text-muted-foreground">Include symbols and numbers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Billing Settings */}
          {activeTab === "billing" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Billing Information</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your subscription and payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Current Plan</Label>
                      <p className="text-sm text-muted-foreground">Enterprise Plan - $299/month</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Next Billing Date</Label>
                      <p className="text-sm text-muted-foreground">December 23, 2024</p>
                    </div>
                    <Button variant="outline" size="sm">Update Plan</Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm">**** **** **** 4242</span>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage & Limits</CardTitle>
                  <CardDescription>
                    Monitor your current usage and plan limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>APD Documents</span>
                      <span>45 / 100</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Team Members</span>
                      <span>12 / 25</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "48%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Used</span>
                      <span>2.3 GB / 10 GB</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "23%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser and mobile notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Team activity alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify when team members make changes</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Document approval requests</Label>
                    <p className="text-sm text-muted-foreground">Get notified when approval is needed</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Settings */}
          {activeTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Third-party Integrations</span>
                </CardTitle>
                <CardDescription>
                  Connect with external services and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                    <div>
                      <Label>Slack</Label>
                      <p className="text-sm text-muted-foreground">Team communication</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <div>
                      <Label>Microsoft Teams</Label>
                      <p className="text-sm text-muted-foreground">Video conferencing</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <div>
                      <Label>Google Workspace</Label>
                      <p className="text-sm text-muted-foreground">Document collaboration</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data & Privacy Settings */}
          {activeTab === "data" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Data Management</span>
                  </CardTitle>
                  <CardDescription>
                    Control your data retention and export settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data retention period</Label>
                      <p className="text-sm text-muted-foreground">Keep data for 7 years (government requirement)</p>
                    </div>
                    <Input type="number" defaultValue="7" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automatic backups</Label>
                      <p className="text-sm text-muted-foreground">Daily encrypted backups</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data residency</Label>
                      <p className="text-sm text-muted-foreground">Store data in US regions only</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Export & Deletion</CardTitle>
                  <CardDescription>
                    Export your data or request account deletion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Export all data</Label>
                      <p className="text-sm text-muted-foreground">Download a complete copy of your data</p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Delete account</Label>
                      <p className="text-sm text-muted-foreground">Permanently delete all data and account</p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
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
    </div>
  )
}
