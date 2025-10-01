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
    <Card key={integration.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-full flex flex-col">
      <CardHeader className="p-2 sm:p-3 md:p-4 lg:p-6 pb-2 sm:pb-3">
        <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl flex-shrink-0 leading-none">{integration.logo}</div>
          <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
            <div className="flex items-start justify-between gap-1.5 sm:gap-2">
              <CardTitle className="text-xs sm:text-sm md:text-base lg:text-lg truncate leading-tight">
                {integration.name}
              </CardTitle>
              {integration.connected && (
                <Badge variant="default" className="bg-green-500 flex-shrink-0 text-[9px] sm:text-[10px] md:text-xs h-4 sm:h-5 md:h-6 px-1 sm:px-1.5 md:px-2">
                  <CheckCircledIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                  <span className="hidden md:inline">Connected</span>
                  <span className="md:hidden">✓</span>
                </Badge>
              )}
            </div>
            <CardDescription className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm line-clamp-2 leading-tight">
              {integration.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 md:p-4 lg:p-6 pt-0 mt-auto">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 md:gap-3">
          <Badge variant="outline" className="text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5 leading-tight">
            {integration.category}
          </Badge>
          <Button
            size="sm"
            variant={integration.connected ? "outline" : "default"}
            onClick={() => handleConnect(integration.id)}
            className="text-[10px] sm:text-xs md:text-sm h-6 sm:h-7 md:h-8 lg:h-9 px-2 sm:px-3 md:px-4"
          >
            {integration.connected ? (
              <span>Configure</span>
            ) : (
              <>
                <PlusIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-0.5 sm:mr-1 md:mr-2" />
                <span>Connect</span>
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
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
          Connect CadetAI with your favorite tools and platforms
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <MagnifyingGlassIcon className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        <Input
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 sm:pl-10 text-sm"
        />
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-2" />
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <Card>
            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
              <CardDescription className="text-[10px] sm:text-xs md:text-sm">Total Integrations</CardDescription>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">{allIntegrations.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
              <CardDescription className="text-[10px] sm:text-xs md:text-sm">Connected</CardDescription>
              <CardTitle className="text-lg sm:text-xl md:text-2xl text-green-600">
                {allIntegrations.filter(i => i.connected).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
              <CardDescription className="text-[10px] sm:text-xs md:text-sm">Cloud Platforms</CardDescription>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">{cloudIntegrations.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
              <CardDescription className="text-[10px] sm:text-xs md:text-sm">Enterprise Tools</CardDescription>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">{enterpriseArchTools.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto -mx-3 px-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0 pb-2">
          <TabsList className="w-full sm:w-auto inline-flex min-w-max">
            <TabsTrigger value="all" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3">All</TabsTrigger>
            <TabsTrigger value="cloud" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3">Cloud</TabsTrigger>
            <TabsTrigger value="onprem" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 whitespace-nowrap">On-Premise</TabsTrigger>
            <TabsTrigger value="mindmapping" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 whitespace-nowrap">Mind Map</TabsTrigger>
            <TabsTrigger value="enterprise" className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 whitespace-nowrap">Enterprise</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-3 sm:mt-4 md:mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>{renderSkeletonCard()}</div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
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
