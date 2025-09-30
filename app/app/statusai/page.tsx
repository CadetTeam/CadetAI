"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StatusAIPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">StatusAI</h1>
        <p className="text-muted-foreground mt-2">
          Intelligent project status tracking and reporting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Project Dashboard</CardTitle>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <CardDescription>Real-time project status overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor all project metrics and milestones in one place
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Auto-Reports</CardTitle>
              <Badge className="bg-blue-500">Beta</Badge>
            </div>
            <CardDescription>AI-generated status reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automatically generate comprehensive status reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis</CardTitle>
            <CardDescription>Predictive risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AI-powered risk identification and mitigation strategies
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
