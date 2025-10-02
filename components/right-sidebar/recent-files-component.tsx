"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  FileTextIcon, 
  DownloadIcon, 
  TrashIcon,
  EyeOpenIcon,
  FileIcon
} from "@radix-ui/react-icons"

interface RecentFile {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'xls' | 'txt' | 'other'
  size: string
  uploadedBy: string
  uploadedAt: string
  url?: string
}

interface RecentFilesComponentProps {
  className?: string
}

export function RecentFilesComponent({ className }: RecentFilesComponentProps) {
  const [files, setFiles] = useState<RecentFile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setFiles([
        {
          id: "1",
          name: "APD_Document_v2.pdf",
          type: "pdf",
          size: "2.4 MB",
          uploadedBy: "Sarah Chen",
          uploadedAt: "2 min ago",
          url: "/files/apd_v2.pdf"
        },
        {
          id: "2",
          name: "Compliance_Report.xlsx",
          type: "xls",
          size: "1.8 MB",
          uploadedBy: "Mike Rodriguez",
          uploadedAt: "15 min ago",
          url: "/files/compliance.xlsx"
        },
        {
          id: "3",
          name: "Meeting_Notes.docx",
          type: "doc",
          size: "456 KB",
          uploadedBy: "Alex Kim",
          uploadedAt: "1 hour ago",
          url: "/files/notes.docx"
        }
      ])
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const getFileIcon = () => {
    return <FileTextIcon className="h-4 w-4" />
  }

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-600 dark:text-red-400'
      case 'doc': return 'text-blue-600 dark:text-blue-400'
      case 'xls': return 'text-green-600 dark:text-green-400'
      case 'txt': return 'text-gray-600 dark:text-gray-400'
      default: return 'text-purple-600 dark:text-purple-400'
    }
  }

  const handlePreview = (file: RecentFile) => {
    console.log('Preview file:', file.name)
    // TODO: Implement file preview
  }

  const handleDownload = (file: RecentFile) => {
    console.log('Download file:', file.name)
    // TODO: Implement file download
    const link = document.createElement('a')
    link.href = file.url || '#'
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId))
    // TODO: Implement server-side delete
  }

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Recent Files</h3>
          <Skeleton className="h-6 w-12" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-3 p-2">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Recent Files</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FileIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">No files yet</p>
          <p className="text-xs text-muted-foreground mt-1">Upload files to see them here</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Recent Files</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          See all
        </Button>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div 
            key={file.id} 
            className="group flex items-start space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getFileColor(file.type)}`}>
              {getFileIcon()}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground truncate">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {file.size} • {file.uploadedBy}
              </p>
              <p className="text-xs text-muted-foreground">
                {file.uploadedAt}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePreview(file)}
                className="h-6 w-6 p-0"
                title="Preview"
              >
                <EyeOpenIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(file)}
                className="h-6 w-6 p-0"
                title="Download"
              >
                <DownloadIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(file.id)}
                className="h-6 w-6 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                title="Delete"
              >
                <TrashIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

