"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RFPGPTPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">RFP GPT</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered Request for Proposal generation and analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate RFP</CardTitle>
            <CardDescription>Create comprehensive RFPs with AI assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use AI to draft requirements, scope, and evaluation criteria
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyze Responses</CardTitle>
            <CardDescription>Evaluate vendor proposals efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Compare and score responses against your criteria
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Access industry-standard RFP templates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Start with proven templates for common procurement scenarios
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
