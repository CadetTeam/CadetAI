"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MagnifyingGlassIcon, 
  CheckCircledIcon,
  PlusIcon
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

  const renderIntegrationCard = (integration: typeof allIntegrations[0]) => (
    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{integration.logo}</div>
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <CardDescription className="text-sm mt-1">
                {integration.description}
              </CardDescription>
            </div>
          </div>
          {integration.connected && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircledIcon className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{integration.category}</Badge>
          <Button
            size="sm"
            variant={integration.connected ? "outline" : "default"}
            onClick={() => handleConnect(integration.id)}
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

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground mt-2">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Integrations</CardDescription>
            <CardTitle className="text-2xl">{allIntegrations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Connected</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {allIntegrations.filter(i => i.connected).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Cloud Platforms</CardDescription>
            <CardTitle className="text-2xl">{cloudIntegrations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Enterprise Tools</CardDescription>
            <CardTitle className="text-2xl">{enterpriseArchTools.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="cloud">Cloud</TabsTrigger>
          <TabsTrigger value="onprem">On-Premise</TabsTrigger>
          <TabsTrigger value="mindmapping">Mind Mapping</TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise Architecture</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getTabIntegrations(activeTab).map(renderIntegrationCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
