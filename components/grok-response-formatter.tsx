"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  GlobeIcon,
  FileTextIcon,
  DownloadIcon,
  ExternalLinkIcon,
  CheckIcon,
  ClockIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface CrawledContent {
  type: 'link' | 'document' | 'reference'
  title: string
  url?: string
  snippet?: string
  source?: string
  timestamp?: Date
  status: 'browsing' | 'completed' | 'error'
}

interface GrokResponseData {
  title: string
  content: string
  crawledContent: CrawledContent[]
  processingTime?: string
  sources?: string[]
}

interface GrokResponseFormatterProps {
  data: GrokResponseData
  className?: string
}

export function GrokResponseFormatter({ data, className }: GrokResponseFormatterProps) {
  const getStatusIcon = (status: CrawledContent['status']) => {
    switch (status) {
      case 'browsing':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      case 'completed':
        return <CheckIcon className="w-3 h-3 text-green-500" />
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
    }
  }

  const getContentIcon = (type: CrawledContent['type']) => {
    switch (type) {
      case 'link':
        return <GlobeIcon className="w-4 h-4 text-blue-500" />
      case 'document':
        return <FileTextIcon className="w-4 h-4 text-green-500" />
      case 'reference':
        return <FileTextIcon className="w-4 h-4 text-purple-500" />
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with processing time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ClockIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {data.processingTime || "Thought for 1m 13s"}
          </span>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl font-bold text-foreground leading-tight">
        {data.title}
      </h1>

      {/* Crawled Content Section */}
      {data.crawledContent.length > 0 && (
        <Card className="bg-white/5 dark:bg-black/5 border border-white/10 dark:border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Planning document creation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.crawledContent.map((item, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 bg-white/5 dark:bg-black/5 rounded-lg border border-white/10 dark:border-white/10"
              >
                <div className="flex-shrink-0 mt-1">
                  {getContentIcon(item.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {item.title}
                    </span>
                    {getStatusIcon(item.status)}
                  </div>
                  
                  {item.url && (
                    <div className="text-xs text-muted-foreground mb-1">
                      Browsing <code className="bg-white/10 dark:bg-black/10 px-1 rounded text-blue-400">
                        {item.url.length > 60 ? `${item.url.substring(0, 60)}...` : item.url}
                      </code>
                    </div>
                  )}
                  
                  {item.snippet && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.snippet}
                    </p>
                  )}
                  
                  {item.source && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {item.source}
                      </Badge>
                      {item.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <ExternalLinkIcon className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card className="bg-white/5 dark:bg-black/5 border border-white/10 dark:border-white/10">
        <CardContent className="pt-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      {data.sources && data.sources.length > 0 && (
        <Card className="bg-white/5 dark:bg-black/5 border border-white/10 dark:border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <DownloadIcon className="w-4 h-4" />
              <span>Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.sources.map((source, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <a 
                    href={source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 truncate"
                  >
                    {source}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Example usage component
export function ExampleGrokResponse() {
  const exampleData: GrokResponseData = {
    title: "Architecture Planning Document for Government RFP Development",
    content: `This document provides a comprehensive template for an Architecture Planning Document tailored for government use, specifically to inform the development of a Request for Proposal (RFP). It is designed for enterprise IT architecture planning, assuming a focus on aligning IT systems with government mission objectives, regulatory requirements, and procurement processes.

## 1. About This Document

### 1.1 Purpose
Define the role of this Architecture Planning Document in enabling government business plans through systematic IT architecture assessment and planning.

### 1.2 Scope
This document covers the complete architecture planning lifecycle for government RFP development, including:
- Current state assessment
- Future state definition  
- Gap analysis
- Technology roadmap
- Compliance requirements

### 1.3 Methodology
The approach follows enterprise architecture best practices, incorporating:
- TOGAF framework principles
- Federal enterprise architecture guidelines
- NIST cybersecurity framework
- FISMA compliance requirements`,
    crawledContent: [
      {
        type: 'link',
        title: 'IT Procurement Forms & Templates',
        url: 'https://it.nc.gov/resources/statewide-it-procurement/it-procurement-forms-templates',
        status: 'completed',
        source: 'North Carolina IT Procurement'
      },
      {
        type: 'document',
        title: 'Sample RFP Sections L-M',
        url: 'https://www.dau.edu/sites/default/files/Migrated/CopDocuments/Sample-RFP-Sections-L-M',
        status: 'completed',
        source: 'Defense Acquisition University'
      }
    ],
    processingTime: "Thought for 1m 13s",
    sources: [
      "https://it.nc.gov/resources/statewide-it-procurement/it-procurement-forms-templates",
      "https://www.dau.edu/sites/default/files/Migrated/CopDocuments/Sample-RFP-Sections-L-M"
    ]
  }

  return <GrokResponseFormatter data={exampleData} />
}
