"use client"

import { useState, useEffect } from "react"
import { useOrganization } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  HomeIcon as BuildingIcon, 
  ArrowRightIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  UpdateIcon,
  CopyIcon,
  CheckIcon
} from "@radix-ui/react-icons"

export default function OrganizationSetupPage() {
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copiedSlug, setCopiedSlug] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    slug: ""
  })

  const [isLoading, setIsLoading] = useState(true)

  // Show loading state while Clerk loads
  useEffect(() => {
    if (orgLoaded) {
      setIsLoading(false)
      
      // If user is already in an organization, redirect to app
      if (organization) {
        window.location.href = "/app"
        return
      }
    }
  }, [orgLoaded, organization])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError("")
    setSuccess("")

    // Auto-generate slug from organization name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      
      setFormData(prev => ({
        ...prev,
        slug: slug
      }))
    }
  }

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError("Organization name is required")
      return
    }

    if (!formData.slug.trim()) {
      setError("Organization slug is required")
      return
    }

    setIsCreating(true)
    setError("")
    setSuccess("")

    try {
      // Create organization using Clerk API
      const response = await fetch('/api/create-organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create organization')
      }

      const result = await response.json()
      
      if (result.success) {
        setSuccess(`Organization "${formData.name}" created successfully!`)
        
        // Redirect to app after a short delay
        setTimeout(() => {
          window.location.href = "/app"
        }, 2000)
      }
    } catch (err: unknown) {
      console.error('Error creating organization:', err)
      const errorMessage = err instanceof Error && 'errors' in err 
        ? (err as { errors?: Array<{ message: string }> }).errors?.[0]?.message 
        : err instanceof Error 
          ? err.message 
          : "Failed to create organization. Please try again."
      setError(errorMessage || "Failed to create organization. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const copySlugToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.slug)
      setCopiedSlug(true)
      setTimeout(() => setCopiedSlug(false), 2000)
    } catch (err) {
      console.error('Failed to copy slug:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl mb-4 shadow-lg">
            <UpdateIcon className="h-8 w-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your workspace
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl mb-4 shadow-lg">
            <BuildingIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Organization
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set up your secure workspace
          </p>
        </div>

        {/* Organization Setup Card */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Organization Setup</CardTitle>
            <CardDescription className="text-center">
              Create your organization to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20">
                <CheckCircledIcon className="h-4 w-4 text-gray-600" />
                <AlertDescription className="text-gray-800 dark:text-gray-200">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleCreateOrganization} className="space-y-4">
              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <div className="relative">
                  <BuildingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your Company Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Organization Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Organization URL</Label>
                <div className="relative">
                  <Input
                    id="slug"
                    name="slug"
                    type="text"
                    placeholder="your-company"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="pr-20"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2"
                    onClick={copySlugToClipboard}
                  >
                    {copiedSlug ? (
                      <CheckIcon className="h-3 w-3" />
                    ) : (
                      <CopyIcon className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your organization will be accessible at: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">my.cadetai.com/{formData.slug || 'your-company'}</span>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg disabled:opacity-50"
                disabled={isCreating || !formData.name.trim() || !formData.slug.trim()}
              >
                {isCreating ? (
                  <>
                    <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                    Creating Organization...
                  </>
                ) : (
                  <>
                    Create Organization
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Info Section */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🔒 Your organization will be secure and private
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            🏢 Enterprise-grade organization management
          </p>
        </div>
      </div>
    </div>
  )
}
