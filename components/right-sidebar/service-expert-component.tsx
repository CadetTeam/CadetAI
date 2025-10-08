"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search,
  Users,
  Building2,
  Wrench,
  Star,
  Clock,
  DollarSign
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
      case 'engineer': return 'bg-black text-white dark:bg-white dark:text-black'
      case 'architect': return 'bg-black text-white dark:bg-white dark:text-black'
      case 'mita_consultant': return 'bg-black text-white dark:bg-white dark:text-black'
      default: return 'bg-black text-white dark:bg-white dark:text-black'
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
      <div className={`space-y-3 ${className}`}>
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

        {/* Compact Expert List */}
        <div className="space-y-2">
          {mockExperts.slice(0, 3).map((expert) => (
            <div
              key={expert.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                    {expert.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${getAvailabilityColor(expert.availability)}`}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xs font-medium text-foreground truncate">{expert.name}</h4>
                  <Badge className={`${getSpecialtyColor(expert.specialty)} text-[0.6rem] px-1 py-0 h-4 leading-none`}>
                    {getSpecialtyLabel(expert.specialty)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{expert.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{expert.hourlyRate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{expert.responseTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Show more button */}
          {mockExperts.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              View all {mockExperts.length} experts
            </Button>
          )}
        </div>
      </div>

      {/* Service Experts Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Service Experts
            </DialogTitle>
            <DialogDescription>
              Connect with qualified engineers, architects, and MITA consultants to help with your project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {mockExperts.map((expert) => (
              <div
                key={expert.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {expert.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${getAvailabilityColor(expert.availability)}`}
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
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{expert.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{expert.hourlyRate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{expert.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleContactExpert(expert)}
                  disabled={expert.availability === 'offline'}
                  className="flex-shrink-0"
                >
                  {expert.availability === 'available' ? 'Contact' : 
                   expert.availability === 'busy' ? 'Schedule' : 'Unavailable'}
                </Button>
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
