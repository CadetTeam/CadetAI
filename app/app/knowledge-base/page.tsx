"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  UploadIcon, 
  FileTextIcon, 
  QuestionMarkCircledIcon, 
  FileTextIcon as BookOpenIcon,
  MagnifyingGlassIcon as SearchIcon,
  DownloadIcon,
  Share1Icon
} from "@radix-ui/react-icons"

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // Mock data for different content types
  const faqs = [
    {
      id: 1,
      question: "How does the APD system work?",
      answer: "The Acquisition Planning Document (APD) system is designed to streamline government procurement processes by providing structured planning and documentation tools.",
      category: "APD Process",
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      question: "What are the key requirements for government procurement?",
      answer: "Government procurement requires compliance with federal regulations, proper documentation, competitive bidding processes, and adherence to budget constraints.",
      category: "Procurement",
      lastUpdated: "2024-01-14"
    },
    {
      id: 3,
      question: "How do I create a new APD document?",
      answer: "To create a new APD document, navigate to the APD Engine, select 'Create New Document', and follow the guided workflow to input all required information.",
      category: "Getting Started",
      lastUpdated: "2024-01-13"
    }
  ]

  const articles = [
    {
      id: 1,
      title: "Understanding Government Procurement Lifecycle",
      excerpt: "A comprehensive guide to navigating the complex world of government procurement from initial planning to contract execution.",
      category: "Procurement",
      readTime: "8 min read",
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      title: "Best Practices for APD Documentation",
      excerpt: "Learn the essential elements and formatting requirements for creating effective Acquisition Planning Documents.",
      category: "APD Process",
      readTime: "12 min read",
      lastUpdated: "2024-01-14"
    },
    {
      id: 3,
      title: "Compliance and Regulatory Requirements",
      excerpt: "Navigate the complex landscape of federal compliance requirements for government acquisitions.",
      category: "Compliance",
      readTime: "15 min read",
      lastUpdated: "2024-01-13"
    }
  ]

  const blogs = [
    {
      id: 1,
      title: "The Future of Government Procurement",
      excerpt: "Exploring emerging trends and technologies that are reshaping how government agencies approach procurement.",
      author: "Sarah Johnson",
      publishDate: "2024-01-15",
      category: "Industry Insights"
    },
    {
      id: 2,
      title: "Streamlining APD Workflows with AI",
      excerpt: "How artificial intelligence is revolutionizing the creation and management of Acquisition Planning Documents.",
      author: "Michael Chen",
      publishDate: "2024-01-12",
      category: "Technology"
    }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">
            Access documentation, guides, and resources for APD and government procurement
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share1Icon className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Search and Upload */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button asChild variant="outline" size="sm">
            <label htmlFor="file-upload" className="cursor-pointer">
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Documents
            </label>
          </Button>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Uploaded Documents</CardTitle>
            <CardDescription>Documents ready for processing into knowledge base content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileTextIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Process
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="faqs" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faqs" className="flex items-center space-x-2">
            <QuestionMarkCircledIcon className="w-4 h-4" />
            <span>FAQs</span>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center space-x-2">
            <BookOpenIcon className="w-4 h-4" />
            <span>Articles</span>
          </TabsTrigger>
          <TabsTrigger value="blogs" className="flex items-center space-x-2">
            <FileTextIcon className="w-4 h-4" />
            <span>Blogs</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{faq.question}</CardTitle>
                      <CardDescription className="text-base">{faq.answer}</CardDescription>
                    </div>
                    <Badge variant="secondary">{faq.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {faq.lastUpdated}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                      <CardDescription className="text-base mb-3">{article.excerpt}</CardDescription>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>Updated: {article.lastUpdated}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{article.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Blogs Tab */}
        <TabsContent value="blogs" className="space-y-4">
          <div className="grid gap-4">
            {blogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{blog.title}</CardTitle>
                      <CardDescription className="text-base mb-3">{blog.excerpt}</CardDescription>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>By {blog.author}</span>
                        <span>•</span>
                        <span>{blog.publishDate}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{blog.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">
                    Read Blog
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
