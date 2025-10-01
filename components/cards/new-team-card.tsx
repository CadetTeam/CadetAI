"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState<Array<{id: string; name: string; email: string; role: string}>>([])

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      // Simulate loading
      const timer = setTimeout(() => {
        setMembers([
          { id: "1", name: "Sarah Chen", email: "sarah@company.com", role: "Developer" },
          { id: "2", name: "Mike Rodriguez", email: "mike@company.com", role: "Designer" },
          { id: "3", name: "Alex Kim", email: "alex@company.com", role: "Manager" },
          { id: "4", name: "Emma Wilson", email: "emma@company.com", role: "Analyst" },
        ])
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

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
        className="fixed z-[103] bg-background border border-border rounded-xl shadow-2xl w-72 sm:w-80 max-h-[500px] sm:max-h-[600px] overflow-hidden"
        style={{
          top: position.top,
          left: position.left,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 sm:p-3 border-b border-border">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">New Team</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-5 w-5 p-0"
          >
            <Cross2Icon className="h-3 w-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          {/* Team Name */}
          <div className="space-y-1">
            <Label htmlFor="teamName" className="text-xs">Team Name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="h-8 text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Team purpose"
              rows={2}
              className="text-sm"
            />
          </div>

          {/* Team Members */}
          <div className="space-y-1">
            <Label className="text-xs">Add Members</Label>
            {isLoading ? (
              <div className="space-y-1.5">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-2 p-2 rounded-lg border border-border">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2 w-32" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-4 text-xs text-muted-foreground">
                No members available
              </div>
            ) : (
              <div className="space-y-1">
                {members.map((member) => {
                const isSelected = selectedMembers.includes(member.id)
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center justify-between p-1.5 sm:p-2 rounded-lg border cursor-pointer transition-colors",
                      isSelected 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:bg-accent/50"
                    )}
                    onClick={() => handleMemberToggle(member.id)}
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <PersonIcon className="w-3 h-3" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs truncate">{member.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Badge variant="outline" className="text-[9px] px-1 py-0">
                        {member.role}
                      </Badge>
                      {isSelected && (
                        <CheckIcon className="w-3 h-3 text-primary" />
                      )}
                    </div>
                  </div>
                )
              })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-2 sm:p-3 border-t border-border">
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            {selectedMembers.length} selected
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <Button variant="outline" onClick={onClose} className="h-7 text-xs px-2">
              Cancel
            </Button>
            <Button onClick={handleCreateTeam} disabled={!teamName.trim()} className="h-7 text-xs px-2">
              <PlusIcon className="w-3 h-3 mr-1" />
              Create
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
