"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForeCostPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">ForeCost</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered cost forecasting and budget management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Forecasting</CardTitle>
            <CardDescription>Predict future project costs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use AI to forecast costs based on historical data and trends
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Tracking</CardTitle>
            <CardDescription>Monitor spending in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track actual vs. planned spending with alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variance Analysis</CardTitle>
            <CardDescription>Identify cost overruns early</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyze budget variance and receive recommendations
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
