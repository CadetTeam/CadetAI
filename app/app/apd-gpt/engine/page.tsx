"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  FileText, 
  Save, 
  Download, 
  Share, 
  Clock, 
  User, 
  Fingerprint,
  File,
  RotateCcw,
  Plus
} from "lucide-react"

export default function APDEnginePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [documentContent, setDocumentContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Document Content Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>

        {/* Audio Waveform Skeleton */}
        <Card>
          <CardContent className="py-6">
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>

        {/* Input Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">CA-MMIS Takeover & Replacement (2009)</h1>
        <p className="text-muted-foreground">Today Sept 23 2025 | 2:32pm EST</p>
      </div>

      {/* Main Document */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Advanced Planning Document</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Fingerprint className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Clock className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <File className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <span className="text-xs font-medium">CA</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input 
                  id="title"
                  defaultValue="CA-MMIS Takeover & Replacement (2009)"
                  className="font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Document Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your APD content here..."
                  className="min-h-[400px]"
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setIsEditing(false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="prose max-w-none">
                <h2>Executive Summary</h2>
                <p>
                  This Advanced Planning Document outlines the comprehensive strategy for the 
                  takeover and replacement of the California Medicaid Management Information 
                  System (CA-MMIS) in 2009. The project represents a critical modernization 
                  effort to improve healthcare delivery and administrative efficiency.
                </p>
                
                <h3>Project Objectives</h3>
                <ul>
                  <li>Modernize legacy Medicaid management systems</li>
                  <li>Improve claims processing efficiency</li>
                  <li>Enhance provider enrollment and verification</li>
                  <li>Strengthen fraud detection and prevention</li>
                  <li>Ensure compliance with federal requirements</li>
                </ul>

                <h3>Stakeholder Analysis</h3>
                <p>
                  Key stakeholders include the California Department of Health Care Services, 
                  healthcare providers, managed care organizations, and federal oversight agencies. 
                  Each stakeholder group has specific requirements and expectations that must be 
                  addressed in the implementation plan.
                </p>

                <h3>Risk Assessment</h3>
                <p>
                  The project faces several risks including technical complexity, regulatory 
                  compliance requirements, and stakeholder coordination challenges. Mitigation 
                  strategies include phased implementation, comprehensive testing, and ongoing 
                  stakeholder engagement.
                </p>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button onClick={() => setIsEditing(true)}>
                  Edit Document
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Waveform */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center h-12 bg-muted rounded-lg">
            <div className="flex space-x-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 4}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Hey Cadet..."
          className="pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <User className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
