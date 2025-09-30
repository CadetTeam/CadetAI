"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CodeIcon,
  CopyIcon,
  CheckIcon,
  ReloadIcon
} from "@radix-ui/react-icons"

const apiEndpoints = [
  {
    id: "chat",
    method: "POST",
    endpoint: "/api/v1/chat",
    description: "Send a message to Cadet AI and receive a response",
    params: [
      { name: "message", type: "string", required: true, description: "The user's message" },
      { name: "context", type: "string", required: false, description: "Additional context for the conversation" },
      { name: "model", type: "string", required: false, description: "AI model to use (default: gpt-4)" }
    ],
    example: `{
  "message": "What are the compliance requirements for federal contracts?",
  "context": "APD document analysis",
  "model": "gpt-4"
}`
  },
  {
    id: "documents",
    method: "POST",
    endpoint: "/api/v1/documents/upload",
    description: "Upload and analyze documents",
    params: [
      { name: "file", type: "file", required: true, description: "Document file to upload" },
      { name: "type", type: "string", required: false, description: "Document type (pdf, docx, txt)" },
      { name: "analysis", type: "boolean", required: false, description: "Enable automatic analysis" }
    ],
    example: `FormData {
  file: <binary>,
  type: "pdf",
  analysis: true
}`
  },
  {
    id: "analysis",
    method: "GET",
    endpoint: "/api/v1/analysis/{id}",
    description: "Retrieve document analysis results",
    params: [
      { name: "id", type: "string", required: true, description: "Document analysis ID" },
      { name: "format", type: "string", required: false, description: "Response format (json, markdown)" }
    ],
    example: `GET /api/v1/analysis/abc123?format=json`
  },
  {
    id: "users",
    method: "GET",
    endpoint: "/api/v1/users",
    description: "List organization users",
    params: [
      { name: "page", type: "number", required: false, description: "Page number for pagination" },
      { name: "limit", type: "number", required: false, description: "Results per page (max 100)" },
      { name: "role", type: "string", required: false, description: "Filter by user role" }
    ],
    example: `GET /api/v1/users?page=1&limit=20&role=admin`
  },
  {
    id: "teams",
    method: "POST",
    endpoint: "/api/v1/teams",
    description: "Create a new team",
    params: [
      { name: "name", type: "string", required: true, description: "Team name" },
      { name: "description", type: "string", required: false, description: "Team description" },
      { name: "members", type: "array", required: false, description: "Array of user IDs" }
    ],
    example: `{
  "name": "Contract Review Team",
  "description": "Team for reviewing federal contracts",
  "members": ["user123", "user456"]
}`
  },
  {
    id: "webhooks",
    method: "POST",
    endpoint: "/api/v1/webhooks",
    description: "Register a webhook endpoint",
    params: [
      { name: "url", type: "string", required: true, description: "Webhook URL" },
      { name: "events", type: "array", required: true, description: "Events to subscribe to" },
      { name: "secret", type: "string", required: false, description: "Webhook secret for verification" }
    ],
    example: `{
  "url": "https://your-app.com/webhook",
  "events": ["document.analyzed", "chat.completed"],
  "secret": "your-secret-key"
}`
  }
]

const codeExamples = {
  javascript: `// JavaScript Example
const response = await fetch('https://api.cadetai.com/v1/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'Analyze this contract',
    context: 'Federal procurement'
  })
});

const data = await response.json();
console.log(data);`,
  
  python: `# Python Example
import requests

url = "https://api.cadetai.com/v1/chat"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
payload = {
    "message": "Analyze this contract",
    "context": "Federal procurement"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data)`,

  curl: `# cURL Example
curl -X POST https://api.cadetai.com/v1/chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "message": "Analyze this contract",
    "context": "Federal procurement"
  }'`
}

export default function APIPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeLanguage, setActiveLanguage] = useState<keyof typeof codeExamples>("javascript")

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-500"
      case "POST":
        return "bg-green-500"
      case "PUT":
        return "bg-yellow-500"
      case "DELETE":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">API Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Integrate CadetAI into your applications with our RESTful API
        </p>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CodeIcon className="w-5 h-5" />
            <span>Quick Start</span>
          </CardTitle>
          <CardDescription>Get started with the CadetAI API in minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Get your API Key</h3>
            <p className="text-sm text-muted-foreground">
              Navigate to Settings → API Keys to generate your API key
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Base URL</h3>
            <code className="text-sm bg-muted px-2 py-1 rounded">
              https://api.cadetai.com
            </code>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Include your API key in the Authorization header:
            </p>
            <code className="text-sm bg-muted px-2 py-1 rounded block mt-2">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
        </CardContent>
      </Card>

      {/* API Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>API Version</CardDescription>
            <CardTitle className="text-2xl">v1.0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Endpoints</CardDescription>
            <CardTitle className="text-2xl">{apiEndpoints.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rate Limit</CardDescription>
            <CardTitle className="text-2xl">1000/hr</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Uptime</CardDescription>
            <CardTitle className="text-2xl text-green-600">99.9%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
          <CardDescription>Examples in popular programming languages</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as keyof typeof codeExamples)}>
            <TabsList>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            {Object.entries(codeExamples).map(([lang, code]) => (
              <TabsContent key={lang} value={lang} className="mt-4">
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{code}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(code, lang)}
                  >
                    {copiedCode === lang ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      <CopyIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Endpoints Documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="lg:col-span-1 space-y-2">
          <h2 className="text-xl font-semibold mb-4">Endpoints</h2>
          {apiEndpoints.map((endpoint) => (
            <Card
              key={endpoint.id}
              className={`cursor-pointer transition-colors ${
                selectedEndpoint.id === endpoint.id
                  ? "border-primary bg-accent"
                  : "hover:bg-accent"
              }`}
              onClick={() => setSelectedEndpoint(endpoint)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center space-x-2">
                  <Badge className={`${getMethodColor(endpoint.method)} text-white`}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm">{endpoint.endpoint.split('/').pop()}</code>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Endpoint Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Badge className={`${getMethodColor(selectedEndpoint.method)} text-white`}>
                  {selectedEndpoint.method}
                </Badge>
                <code className="text-lg font-mono">{selectedEndpoint.endpoint}</code>
              </div>
              <CardDescription className="mt-2">{selectedEndpoint.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Parameters */}
              <div>
                <h3 className="font-semibold mb-3">Parameters</h3>
                <div className="space-y-3">
                  {selectedEndpoint.params.map((param) => (
                    <div key={param.name} className="border rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <code className="font-mono text-sm">{param.name}</code>
                        <Badge variant="outline" className="text-xs">{param.type}</Badge>
                        {param.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{param.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Request */}
              <div>
                <h3 className="font-semibold mb-3">Example Request</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{selectedEndpoint.example}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(selectedEndpoint.example, selectedEndpoint.id)}
                  >
                    {copiedCode === selectedEndpoint.id ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      <CopyIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Try it out */}
              <div>
                <Button className="w-full">
                  <ReloadIcon className="w-4 h-4 mr-2" />
                  Try it out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limiting</CardTitle>
          <CardDescription>API usage limits and best practices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Free Tier</h4>
              <p className="text-sm text-muted-foreground">100 requests/hour</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pro Tier</h4>
              <p className="text-sm text-muted-foreground">1,000 requests/hour</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Enterprise</h4>
              <p className="text-sm text-muted-foreground">Custom limits</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Rate limit headers are included in all API responses:
          </p>
          <code className="text-sm bg-muted px-2 py-1 rounded block">
            X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
          </code>
        </CardContent>
      </Card>
    </div>
  )
}
