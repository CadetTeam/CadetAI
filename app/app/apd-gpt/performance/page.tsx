"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  BarChart3, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText,
  Clock,
  DollarSign,
  Download,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock performance data
const performanceMetrics = [
  {
    id: 1,
    name: "People Efficiency",
    value: 87,
    change: 12,
    trend: "up",
    description: "Team productivity and collaboration effectiveness",
    icon: Users
  },
  {
    id: 2,
    name: "Data Integrity Score",
    value: 94,
    change: 3,
    trend: "up",
    description: "Accuracy and completeness of APD data",
    icon: FileText
  },
  {
    id: 3,
    name: "Budget Variance",
    value: -5,
    change: -2,
    trend: "down",
    description: "Deviation from planned budget allocation",
    icon: DollarSign
  },
  {
    id: 4,
    name: "Usage Analytics",
    value: 156,
    change: 23,
    trend: "up",
    description: "Active users and system utilization",
    icon: BarChart3
  },
  {
    id: 5,
    name: "Change Log Activity",
    value: 42,
    change: 8,
    trend: "up",
    description: "Document revisions and updates",
    icon: Clock
  }
]

const anomalyAlerts = [
  {
    id: 1,
    type: "warning",
    message: "Budget variance exceeded 5% threshold",
    timestamp: "2 hours ago",
    severity: "medium"
  },
  {
    id: 2,
    type: "info",
    message: "High usage detected during peak hours",
    timestamp: "4 hours ago",
    severity: "low"
  },
  {
    id: 3,
    type: "success",
    message: "Data integrity score improved to 94%",
    timestamp: "6 hours ago",
    severity: "low"
  }
]

export default function PerformancePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showAddMetric, setShowAddMetric] = useState(false)
  const [newMetricName, setNewMetricName] = useState("")
  const [newMetricValue, setNewMetricValue] = useState("")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleAddMetric = () => {
    if (newMetricName && newMetricValue) {
      // In a real app, this would add to the metrics array
      console.log("Adding metric:", newMetricName, newMetricValue)
      setNewMetricName("")
      setNewMetricValue("")
      setShowAddMetric(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Performance Metrics</h1>
          <p className="text-muted-foreground">Track KPIs and system performance analytics</p>
        </div>
        <Button onClick={() => setShowAddMetric(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Metric
        </Button>
      </div>

      {/* Add Metric Modal */}
      {showAddMetric && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Metric</CardTitle>
            <CardDescription>
              Create a new performance metric to track
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metric-name">Metric Name</Label>
              <Input
                id="metric-name"
                placeholder="Enter metric name..."
                value={newMetricName}
                onChange={(e) => setNewMetricName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metric-value">Initial Value</Label>
              <Input
                id="metric-value"
                type="number"
                placeholder="Enter initial value..."
                value={newMetricValue}
                onChange={(e) => setNewMetricValue(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddMetric}>
                Add Metric
              </Button>
              <Button variant="outline" onClick={() => setShowAddMetric(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <metric.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{metric.name}</span>
                </div>
                <div className={cn(
                  "flex items-center space-x-1 text-sm",
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                )}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {metric.value}{metric.name === "Budget Variance" ? "%" : ""}
                </div>
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      metric.trend === "up" ? "bg-green-500" : "bg-red-500"
                    )}
                    style={{ width: `${Math.min(Math.abs(metric.value), 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Anomaly Detection Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Anomaly Detection Alerts</span>
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
          <CardDescription>
            AI-powered alerts for performance anomalies and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          {anomalyAlerts.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Alerts</h3>
              <p className="text-sm text-muted-foreground">
                All systems are operating within normal parameters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {anomalyAlerts.map((alert) => (
                <div key={alert.id} className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border",
                  alert.severity === "high" && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
                  alert.severity === "medium" && "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950",
                  alert.severity === "low" && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
                )}>
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    alert.severity === "high" && "bg-red-500 text-white",
                    alert.severity === "medium" && "bg-orange-500 text-white",
                    alert.severity === "low" && "bg-blue-500 text-white"
                  )}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Performance Data</CardTitle>
          <CardDescription>
            Download performance reports and analytics data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Generate PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
