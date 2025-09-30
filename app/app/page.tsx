"use client"

import { useState, useEffect } from "react"
import { CardSlider } from "@/components/ui/card-slider"
import { EyeOpenIcon, PersonIcon, FileTextIcon, PlusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"
import { useUser } from "@clerk/nextjs"

interface APDFile {
  id: string
  title: string
  description: string
  views: number
  data_size: number
  online_users: number
  team_members: number
  is_active: boolean
  created_at: string
  updated_at: string
  user_id: string
}

interface Template {
  id: string
  title: string
  description: string
  views: number
  clones: number
  is_active: boolean
  created_at: string
  updated_at: string
  user_id: string
}

interface Project {
  id: string
  title: string
  description: string
  views: number
  collaborators: number
  is_active: boolean
  created_at: string
  updated_at: string
  user_id: string
}

interface EmptyStateSectionProps {
  title: string
  description: string
  icon: React.ElementType
  actionText: string
  actionHref: string
  isLoading: boolean
}

function EmptyStateSection({ title, description, icon: Icon, actionText, actionHref, isLoading }: EmptyStateSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No {title.toLowerCase()} yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
          <Button asChild>
            <a href={actionHref}>
              <PlusIcon className="w-4 h-4 mr-2" />
              {actionText}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


export default function AppDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [apdFiles, setApdFiles] = useState<APDFile[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        setError(null)

        // Fetch APD Files
        const { data: apdData, error: apdError } = await supabase
          .from('apd_documents')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5)

        if (apdError) throw apdError
        setApdFiles(apdData || [])

        // Fetch Templates
        const { data: templateData, error: templateError } = await supabase
          .from('templates')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5)

        if (templateError) throw templateError
        setTemplates(templateData || [])

        // Fetch Projects
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5)

        if (projectError) throw projectError
        setProjects(projectData || [])

      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

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
      {apdFiles.length > 0 ? (
        <CardSlider
          title="Recent APD Files"
          seeAllHref="/app/apdgpt/history"
          cards={apdFiles.map(file => ({
            id: file.id,
            title: file.title,
            description: file.description,
            stats: [
              { label: "Views", value: file.views.toLocaleString(), icon: EyeOpenIcon },
              { label: "Data Size", value: `${file.data_size}MB` },
              { label: "Online", value: file.online_users.toLocaleString(), icon: PersonIcon },
              { label: "Members", value: file.team_members.toLocaleString() }
            ],
            isActive: file.is_active,
            isLoading: isLoading
          }))}
        />
      ) : (
        <EmptyStateSection
          title="Recent APD Files"
          description="No APD documents found. Create your first document to get started."
          icon={FileTextIcon}
          actionText="Create APD Document"
          actionHref="/app/apdgpt/engine"
          isLoading={isLoading}
        />
      )}

      {/* New Templates Section */}
      {templates.length > 0 ? (
        <CardSlider
          title="New Templates"
          seeAllHref="/app/apdgpt/templates"
          cards={templates.map(template => ({
            id: template.id,
            title: template.title,
            description: template.description,
            stats: [
              { label: "Views", value: template.views.toLocaleString(), icon: EyeOpenIcon },
              { label: "Clones", value: template.clones.toLocaleString() }
            ],
            isActive: template.is_active,
            isLoading: isLoading
          }))}
        />
      ) : (
        <EmptyStateSection
          title="New Templates"
          description="No templates found. Create templates to streamline your APD processes."
          icon={FileTextIcon}
          actionText="Create Template"
          actionHref="/app/apdgpt/templates"
          isLoading={isLoading}
        />
      )}

      {/* Shared Projects Section */}
      {projects.length > 0 ? (
        <CardSlider
          title="Shared Projects"
          seeAllHref="/app/apdgpt/projects"
          cards={projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            stats: [
              { label: "Views", value: project.views.toLocaleString(), icon: EyeOpenIcon },
              { label: "Collaborators", value: project.collaborators.toLocaleString() }
            ],
            isActive: project.is_active,
            isLoading: isLoading
          }))}
        />
      ) : (
        <EmptyStateSection
          title="Shared Projects"
          description="No shared projects found. Start collaborating with your team."
          icon={PersonIcon}
          actionText="Create Project"
          actionHref="/app/apdgpt/projects"
          isLoading={isLoading}
        />
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200">Error Loading Data</CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
