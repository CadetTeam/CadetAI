"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  MagnifyingGlassIcon, 
  CheckCircledIcon,
  PlusIcon,
  Link2Icon
} from "@radix-ui/react-icons"

// Cloud Environments
const cloudIntegrations = [
  { id: "aws", name: "Amazon Web Services", description: "Connect your AWS infrastructure and services", logo: "☁️", category: "Cloud", connected: true },
  { id: "azure", name: "Microsoft Azure", description: "Integrate with Azure cloud platform", logo: "🔷", category: "Cloud", connected: false },
  { id: "gcp", name: "Google Cloud Platform", description: "Connect Google Cloud services", logo: "🌩️", category: "Cloud", connected: true },
  { id: "oracle", name: "Oracle Cloud", description: "Integrate Oracle Cloud Infrastructure", logo: "🔴", category: "Cloud", connected: false },
  { id: "ibm", name: "IBM Cloud", description: "Connect IBM Cloud services", logo: "🔵", category: "Cloud", connected: false },
  { id: "alibaba", name: "Alibaba Cloud", description: "Integrate Alibaba Cloud platform", logo: "🟠", category: "Cloud", connected: false },
]

// On-Premise Environments
const onPremIntegrations = [
  { id: "vmware", name: "VMware vSphere", description: "Virtualization infrastructure management", logo: "🖥️", category: "On-Premise", connected: true },
  { id: "openstack", name: "OpenStack", description: "Open source cloud computing platform", logo: "⚙️", category: "On-Premise", connected: false },
  { id: "kubernetes", name: "Kubernetes", description: "Container orchestration platform", logo: "☸️", category: "On-Premise", connected: true },
  { id: "docker", name: "Docker Enterprise", description: "Container platform for enterprise", logo: "🐳", category: "On-Premise", connected: false },
  { id: "redhat", name: "Red Hat OpenShift", description: "Enterprise Kubernetes platform", logo: "🎩", category: "On-Premise", connected: false },
  { id: "nutanix", name: "Nutanix", description: "Hyperconverged infrastructure", logo: "🔷", category: "On-Premise", connected: false },
]

// Mind Mapping & Data Tools
const mindMappingTools = [
  { id: "miro", name: "Miro", description: "Visual collaboration platform", logo: "🎨", category: "Mind Mapping", connected: true },
  { id: "lucidchart", name: "Lucidchart", description: "Diagramming and visualization", logo: "📊", category: "Mind Mapping", connected: false },
  { id: "mural", name: "Mural", description: "Digital workspace for visual collaboration", logo: "🖼️", category: "Mind Mapping", connected: false },
  { id: "mindmeister", name: "MindMeister", description: "Online mind mapping tool", logo: "🧠", category: "Mind Mapping", connected: false },
  { id: "xmind", name: "XMind", description: "Mind mapping and brainstorming", logo: "💭", category: "Mind Mapping", connected: true },
  { id: "whimsical", name: "Whimsical", description: "Visual workspace for thinking", logo: "✨", category: "Mind Mapping", connected: false },
]

// Enterprise Architecture Tools
const enterpriseArchTools = [
  { id: "archimate", name: "ArchiMate", description: "Enterprise architecture modeling language", logo: "🏛️", category: "Enterprise Architecture", connected: false },
  { id: "sparx", name: "Sparx Enterprise Architect", description: "Comprehensive EA modeling tool", logo: "🔶", category: "Enterprise Architecture", connected: true },
  { id: "bizzdesign", name: "BiZZdesign", description: "Enterprise architecture suite", logo: "📐", category: "Enterprise Architecture", connected: false },
  { id: "ardoq", name: "Ardoq", description: "Data-driven enterprise architecture", logo: "🔷", category: "Enterprise Architecture", connected: false },
  { id: "leanix", name: "LeanIX", description: "Enterprise architecture management", logo: "📈", category: "Enterprise Architecture", connected: true },
  { id: "avolution", name: "Avolution ABACUS", description: "EA modeling and analysis", logo: "🎯", category: "Enterprise Architecture", connected: false },
]

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const allIntegrations = [
    ...cloudIntegrations,
    ...onPremIntegrations,
    ...mindMappingTools,
    ...enterpriseArchTools
  ]

  const filteredIntegrations = allIntegrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTabIntegrations = (tab: string) => {
    switch (tab) {
      case "cloud":
        return cloudIntegrations
      case "onprem":
        return onPremIntegrations
      case "mindmapping":
        return mindMappingTools
      case "enterprise":
        return enterpriseArchTools
      default:
        return filteredIntegrations
    }
  }

  const handleConnect = (id: string) => {
    console.log("Connecting integration:", id)
    // TODO: Implement connection logic
  }

  const renderSkeletonCard = () => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  )

  const renderIntegrationCard = (integration: typeof allIntegrations[0]) => (
    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="text-3xl sm:text-4xl flex-shrink-0">{integration.logo}</div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg truncate">{integration.name}</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1 line-clamp-2">
                {integration.description}
              </CardDescription>
            </div>
          </div>
          {integration.connected && (
            <Badge variant="default" className="bg-green-500 flex-shrink-0 self-start sm:self-auto">
              <CheckCircledIcon className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Badge variant="outline" className="text-xs">{integration.category}</Badge>
          <Button
            size="sm"
            variant={integration.connected ? "outline" : "default"}
            onClick={() => handleConnect(integration.id)}
            className="w-full sm:w-auto"
          >
            {integration.connected ? (
              <>Configure</>
            ) : (
              <>
                <PlusIcon className="w-4 h-4 mr-2" />
                Connect
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderEmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <Link2Icon className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No integrations found</h3>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-6">
        {searchQuery 
          ? `No integrations match "${searchQuery}". Try adjusting your search.`
          : "Get started by connecting your first integration to enhance your workflow."}
      </p>
      {searchQuery && (
        <Button variant="outline" onClick={() => setSearchQuery("")}>
          Clear Search
        </Button>
      )}
    </div>
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Connect CadetAI with your favorite tools and platforms
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs sm:text-sm">Total Integrations</CardDescription>
              <CardTitle className="text-xl sm:text-2xl">{allIntegrations.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs sm:text-sm">Connected</CardDescription>
              <CardTitle className="text-xl sm:text-2xl text-green-600">
                {allIntegrations.filter(i => i.connected).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs sm:text-sm">Cloud Platforms</CardDescription>
              <CardTitle className="text-xl sm:text-2xl">{cloudIntegrations.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs sm:text-sm">Enterprise Tools</CardDescription>
              <CardTitle className="text-xl sm:text-2xl">{enterpriseArchTools.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="w-full sm:w-auto inline-flex">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="cloud" className="text-xs sm:text-sm">Cloud</TabsTrigger>
            <TabsTrigger value="onprem" className="text-xs sm:text-sm whitespace-nowrap">On-Premise</TabsTrigger>
            <TabsTrigger value="mindmapping" className="text-xs sm:text-sm whitespace-nowrap">Mind Map</TabsTrigger>
            <TabsTrigger value="enterprise" className="text-xs sm:text-sm whitespace-nowrap">Enterprise</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-4 sm:mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>{renderSkeletonCard()}</div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {getTabIntegrations(activeTab).length > 0 ? (
                getTabIntegrations(activeTab).map(renderIntegrationCard)
              ) : (
                renderEmptyState()
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
