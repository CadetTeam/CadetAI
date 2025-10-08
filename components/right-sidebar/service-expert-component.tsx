"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Search,
  Users,
  Building2,
  Wrench
} from "lucide-react"

interface ServiceExpert {
  id: string
  name: string
  title: string
  company: string
  specialty: 'engineer' | 'architect' | 'mita_consultant'
  rating: number
  availability: 'available' | 'busy' | 'offline'
  hourlyRate: string
  responseTime: string
}

interface ServiceExpertComponentProps {
  className?: string
}

// Mock data for service experts
const mockExperts: ServiceExpert[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior Systems Engineer",
    company: "TechCorp Solutions",
    specialty: 'engineer',
    rating: 4.9,
    availability: 'available',
    hourlyRate: "$150/hr",
    responseTime: "2 hours"
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    title: "Enterprise Architect",
    company: "Architectural Partners",
    specialty: 'architect',
    rating: 4.8,
    availability: 'available',
    hourlyRate: "$200/hr",
    responseTime: "4 hours"
  },
  {
    id: "3",
    name: "Dr. Lisa Wang",
    title: "MITA Consultant",
    company: "Healthcare Innovations",
    specialty: 'mita_consultant',
    rating: 4.9,
    availability: 'busy',
    hourlyRate: "$180/hr",
    responseTime: "6 hours"
  }
]

export function ServiceExpertComponent({ className }: ServiceExpertComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case 'engineer': return <Wrench className="h-4 w-4" />
      case 'architect': return <Building2 className="h-4 w-4" />
      case 'mita_consultant': return <Users className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case 'engineer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'architect': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'mita_consultant': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getSpecialtyLabel = (specialty: string) => {
    switch (specialty) {
      case 'engineer': return 'Engineer'
      case 'architect': return 'Architect'
      case 'mita_consultant': return 'MITA Consultant'
      default: return 'Expert'
    }
  }

  const handleContactExpert = (expert: ServiceExpert) => {
    console.log('Contact expert:', expert.name)
    // TODO: Implement contact functionality
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Service Experts</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Find Expert
          </Button>
        </div>

        {/* Call to Action Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Find a Service Expert</h4>
              <p className="text-xs text-muted-foreground">Get professional help</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                <Wrench className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs text-muted-foreground">Engineer</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xs text-muted-foreground">Architect</p>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-muted-foreground">MITA Consultant</p>
            </div>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            <Search className="h-4 w-4 mr-2" />
            Find Expert
          </Button>
        </div>
      </div>

      {/* Service Experts Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Service Experts
            </DialogTitle>
            <DialogDescription>
              Connect with qualified engineers, architects, and MITA consultants to help with your project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {mockExperts.map((expert) => (
              <div
                key={expert.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {expert.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div 
                      className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background ${getAvailabilityColor(expert.availability)}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{expert.name}</h4>
                      <Badge className={getSpecialtyColor(expert.specialty)}>
                        <div className="flex items-center gap-1">
                          {getSpecialtyIcon(expert.specialty)}
                          {getSpecialtyLabel(expert.specialty)}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{expert.title}</p>
                    <p className="text-sm text-muted-foreground">{expert.company}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>⭐ {expert.rating}</span>
                      <span>💰 {expert.hourlyRate}</span>
                      <span>⏱️ {expert.responseTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactExpert(expert)}
                    disabled={expert.availability === 'offline'}
                  >
                    {expert.availability === 'available' ? 'Contact' : 
                     expert.availability === 'busy' ? 'Schedule' : 'Unavailable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
