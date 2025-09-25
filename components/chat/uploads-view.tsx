"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  UploadIcon,
  FileTextIcon,
  ImageIcon,
  FileIcon,
  VideoIcon,
  ArchiveIcon,
  TrashIcon,
  DownloadIcon,
  EyeOpenIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  type: 'image' | 'document' | 'video' | 'archive' | 'other'
  size: string
  uploadDate: Date
  status: 'processed' | 'processing' | 'failed'
  url?: string
}

interface UploadsViewProps {
  collapsed: boolean
}

// Mock uploaded files data
const mockFiles: UploadedFile[] = [
  {
    id: "1",
    name: "compliance-report.pdf",
    type: 'document',
    size: "2.3 MB",
    uploadDate: new Date(Date.now() - 1000 * 60 * 30),
    status: 'processed'
  },
  {
    id: "2",
    name: "team-structure-diagram.png",
    type: 'image',
    size: "1.8 MB", 
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'processed'
  },
  {
    id: "3",
    name: "security-audit.docx",
    type: 'document',
    size: "4.1 MB",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'processed'
  },
  {
    id: "4",
    name: "training-video.mp4",
    type: 'video',
    size: "125 MB",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: 'processing'
  },
  {
    id: "5",
    name: "project-backup.zip",
    type: 'archive',
    size: "45.2 MB",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    status: 'failed'
  }
]

export function UploadsView({ collapsed }: UploadsViewProps) {
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles)
  const [dragOver, setDragOver] = useState(false)

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />
      case 'document': return <FileIcon className="h-5 w-5" />
      case 'video': return <VideoIcon className="h-5 w-5" />
      case 'archive': return <ArchiveIcon className="h-5 w-5" />
      default: return <FileTextIcon className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    // TODO: Handle file upload
    console.log('Files dropped:', e.dataTransfer.files)
  }

  if (collapsed) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <UploadIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Uploads</h2>
            <p className="text-muted-foreground">Manage your uploaded files and documents</p>
          </div>
          <Button className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700">
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <div 
        className={cn(
          "mx-6 mt-6 p-8 border-2 border-dashed border-border rounded-lg transition-colors",
          dragOver && "border-primary bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Drop files here</h3>
          <p className="text-muted-foreground mb-4">
            Upload documents, images, videos, and other files to chat with Cadet
          </p>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Files</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{files.length} files</Badge>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {files.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{file.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{formatDate(file.uploadDate)}</span>
                          <Badge className={getStatusColor(file.status)}>
                            {file.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <EyeOpenIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
