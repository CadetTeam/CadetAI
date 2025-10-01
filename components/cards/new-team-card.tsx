"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  PlusIcon,
  Cross2Icon,
  PersonIcon,
  CheckIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

interface NewTeamCardProps {
  isOpen: boolean
  onClose: () => void
  position: { top: number; left: number }
}

export function NewTeamCard({ isOpen, onClose, position }: NewTeamCardProps) {
  const [teamName, setTeamName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const mockMembers = [
    { id: "1", name: "Sarah Chen", email: "sarah@company.com", role: "Developer" },
    { id: "2", name: "Mike Rodriguez", email: "mike@company.com", role: "Designer" },
    { id: "3", name: "Alex Kim", email: "alex@company.com", role: "Manager" },
    { id: "4", name: "Emma Wilson", email: "emma@company.com", role: "Analyst" },
  ]

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleCreateTeam = () => {
    // Handle team creation logic here
    console.log("Creating team:", { teamName, description, selectedMembers })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[102] bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popover */}
      <div 
        className="fixed z-[103] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-border rounded-lg shadow-xl w-80 max-h-[600px] overflow-hidden"
        style={{
          top: position.top,
          left: position.left,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Create New Team</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <Cross2Icon className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the team's purpose"
              rows={3}
            />
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <Label>Add Team Members</Label>
            <div className="space-y-2">
              {mockMembers.map((member) => {
                const isSelected = selectedMembers.includes(member.id)
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-border/80"
                    )}
                    onClick={() => handleMemberToggle(member.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <PersonIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {member.role}
                      </Badge>
                      {isSelected && (
                        <CheckIcon className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam} disabled={!teamName.trim()}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
