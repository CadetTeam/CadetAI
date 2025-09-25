"use client"

import { useState, useEffect } from "react"
import { CardSlider } from "@/components/ui/card-slider"
import { EyeOpenIcon, PersonIcon } from "@radix-ui/react-icons"

// Mock data for demonstration
const recentAPDFiles = [
  {
    id: 1,
    title: "CA-MMIS Takeover & Replacement (2009)",
    description: "A community for VR and novices alike, regular and friendly chat.",
    views: 23232,
    dataSize: 374,
    online: 5678,
    members: 345678,
    isActive: true
  },
  {
    id: 2,
    title: "Provider Management System",
    description: "PAVE automates compliance-heavy enrollment & verification processes.",
    views: 15678,
    dataSize: 892,
    online: 2345,
    members: 123456,
    isActive: false
  },
  {
    id: 3,
    title: "Financial Systems Integration",
    description: "Federal Draw & Reporting (FDR) modernization project.",
    views: 9876,
    dataSize: 456,
    online: 1234,
    members: 78901,
    isActive: false
  }
]

const newTemplates = [
  {
    id: 1,
    title: "Core MMIS Replacement",
    description: "Full system modernization of claims processing (CA-MMIS)",
    views: 28628,
    clones: 1983,
    isActive: true
  },
  {
    id: 2,
    title: "Provider Management",
    description: "PAVE automates compliance-heavy enrollment & verification",
    views: 28628,
    clones: 1983,
    isActive: true
  },
  {
    id: 3,
    title: "EA & Governance Framework",
    description: "MITA support, EPMO, EBPM activities and compliance",
    views: 15678,
    clones: 892,
    isActive: false
  }
]

const sharedProjects = [
  {
    id: 1,
    title: "EA & Governance",
    description: "MITA support, EPMO, EBPM activities",
    views: 28628,
    clones: 1983,
    isActive: true
  },
  {
    id: 2,
    title: "Financial Systems",
    description: "Federal Draw & Reporting (FDR) modernization",
    views: 28628,
    clones: 1983,
    isActive: true
  },
  {
    id: 3,
    title: "Security & Compliance",
    description: "FedRAMP Moderate compliance framework implementation",
    views: 12345,
    clones: 567,
    isActive: false
  }
]


export default function AppDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-6 space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Unlock a fully connected world</h1>
          <p className="text-xl opacity-90">CADET AI</p>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Recent APD Files Section */}
      <CardSlider
        title="Recent APD Files"
        seeAllHref="/app/apd-gpt/history"
        cards={recentAPDFiles.map(file => ({
          id: file.id,
          title: file.title,
          description: file.description,
          stats: [
            { label: "Views", value: file.views.toLocaleString(), icon: EyeOpenIcon },
            { label: "Data Size", value: `${file.dataSize}MB` },
            { label: "Online", value: file.online.toLocaleString(), icon: PersonIcon },
            { label: "Members", value: file.members.toLocaleString() }
          ],
          isActive: file.isActive,
          isLoading: isLoading
        }))}
      />

      {/* New Templates Section */}
      <CardSlider
        title="New Templates"
        seeAllHref="/app/apd-gpt/templates"
        cards={newTemplates.map(template => ({
          id: template.id,
          title: template.title,
          description: template.description,
          stats: [
            { label: "Views", value: template.views.toLocaleString(), icon: EyeOpenIcon },
            { label: "Clones", value: template.clones.toLocaleString() }
          ],
          isActive: template.isActive,
          isLoading: isLoading
        }))}
      />

      {/* Shared Projects Section */}
      <CardSlider
        title="Shared Projects"
        seeAllHref="/app/apd-gpt/projects"
        cards={sharedProjects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          stats: [
            { label: "Views", value: project.views.toLocaleString(), icon: EyeOpenIcon },
            { label: "Clones", value: project.clones.toLocaleString() }
          ],
          isActive: project.isActive,
          isLoading: isLoading
        }))}
      />
    </div>
  )
}
