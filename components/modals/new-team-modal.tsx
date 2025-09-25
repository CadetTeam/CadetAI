"use client"

import { useState } from "react"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircledIcon, 
  ExclamationTriangleIcon, 
  UpdateIcon,
  PersonIcon,
  HomeIcon as BuildingIcon
} from "@radix-ui/react-icons"

interface NewTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TeamFormData {
  name: string
  description: string
  department: string
  clearanceLevel: string
  maxMembers: string
}

export function NewTeamModal({ isOpen, onClose }: NewTeamModalProps) {
  const { organization } = useOrganization()
  const { createOrganization } = useOrganizationList()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    description: "",
    department: "",
    clearanceLevel: "",
    maxMembers: "50"
  })

  const clearanceLevels = [
    { value: "public", label: "Public" },
    { value: "internal", label: "Internal" },
    { value: "confidential", label: "Confidential" },
    { value: "secret", label: "Secret" },
    { value: "top_secret", label: "Top Secret" }
  ]

  const departments = [
    "Administration",
    "Finance", 
    "Human Resources",
    "Information Technology",
    "Operations",
    "Security",
    "Legal",
    "Research & Development",
    "Customer Service",
    "Marketing"
  ]

  const handleInputChange = (field: keyof TeamFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError("")
    setSuccess("")
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Team name is required")
      return false
    }
    if (!formData.description.trim()) {
      setError("Team description is required")
      return false
    }
    if (!formData.department) {
      setError("Department selection is required")
      return false
    }
    if (!formData.clearanceLevel) {
      setError("Clearance level is required")
      return false
    }
    return true
  }

  const handleCreateTeam = async () => {
    if (!validateForm()) return

    setIsCreating(true)
    setError("")
    setSuccess("")

    try {
      // Create organization (team) via Clerk
      const newOrganization = await createOrganization?.({
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')
      })

      if (newOrganization) {
        setSuccess(`Team "${formData.name}" created successfully!`)
        
        // Reset form
        setFormData({
          name: "",
          description: "",
          department: "",
          clearanceLevel: "",
          maxMembers: "50"
        })

        // Close modal after a short delay
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (err: unknown) {
      console.error('Error creating team:', err)
      const errorMessage = err instanceof Error ? err.message : "Failed to create team. Please try again."
      setError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    if (!isCreating) {
      setError("")
      setSuccess("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BuildingIcon className="h-5 w-5" />
            Create New Team
          </DialogTitle>
          <DialogDescription>
            Create a new team within your organization. Teams help organize users and manage access to specific resources.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CheckCircledIcon className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-6">
            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Security Operations Team"
                disabled={isCreating}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the team's purpose and responsibilities..."
                rows={3}
                disabled={isCreating}
              />
            </div>

            {/* Department and Clearance Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleInputChange('department', value)}
                  disabled={isCreating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clearanceLevel">Clearance Level *</Label>
                <Select 
                  value={formData.clearanceLevel} 
                  onValueChange={(value) => handleInputChange('clearanceLevel', value)}
                  disabled={isCreating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select clearance level" />
                  </SelectTrigger>
                  <SelectContent>
                    {clearanceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Max Members */}
            <div className="space-y-2">
              <Label htmlFor="maxMembers">Maximum Members</Label>
              <Select 
                value={formData.maxMembers} 
                onValueChange={(value) => handleInputChange('maxMembers', value)}
                disabled={isCreating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 members</SelectItem>
                  <SelectItem value="25">25 members</SelectItem>
                  <SelectItem value="50">50 members</SelectItem>
                  <SelectItem value="100">100 members</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTeam}
            disabled={isCreating || !formData.name.trim() || !formData.description.trim()}
            className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
          >
            {isCreating ? (
              <>
                <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                Creating Team...
              </>
            ) : (
              <>
                <BuildingIcon className="mr-2 h-4 w-4" />
                Create Team
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
