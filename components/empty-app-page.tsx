"use client"

import { AppHeader } from "@/components/app-header"
import { AppMenu } from "@/components/app-menu"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  UpdateIcon,
  PlusIcon,
  GearIcon
} from "@radix-ui/react-icons"

interface EmptyAppPageProps {
  appName: string
  appId: string
  description?: string
  features?: string[]
}

export function EmptyAppPage({ 
  appName, 
  appId, 
  description = "This app is coming soon!",
  features = []
}: EmptyAppPageProps) {
  const [, setCurrentApp] = useState("apdgpt")

  const handleAppChange = (appId: string) => {
    setCurrentApp(appId)
    // In a real implementation, this would navigate to the selected app
    console.log(`Switching to ${appId} app`)
  }

  const defaultFeatures = [
    "Advanced functionality coming soon",
    "Integration with CadetAI platform",
    "Secure and scalable architecture",
    "Modern user interface"
  ]

  const displayFeatures = features.length > 0 ? features : defaultFeatures

  return (
    <div className="flex h-screen bg-background">
      {/* App Menu */}
      <AppMenu currentApp={appId} onAppChange={handleAppChange} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-12">
        {/* Header */}
        <AppHeader />
        
        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* App Title and Description */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl mb-6 shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {appName.charAt(0)}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {appName}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {displayFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                        <UpdateIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature}</h3>
                        <p className="text-sm text-muted-foreground">
                          Feature description coming soon
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="text-center space-x-4">
              <Button className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Get Started
              </Button>
              <Button variant="outline">
                <GearIcon className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>

            {/* Coming Soon Notice */}
            <div className="mt-12 p-6 bg-muted rounded-lg text-center">
              <h3 className="font-semibold text-foreground mb-2">
                🚀 Coming Soon
              </h3>
              <p className="text-muted-foreground">
                This application is currently under development. Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
