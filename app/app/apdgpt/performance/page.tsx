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
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Performance Metrics</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Track KPIs and system performance analytics</p>
        </div>
        <Button onClick={() => setShowAddMetric(true)} size="sm" className="w-full sm:w-auto">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Add Metric</span>
        </Button>
      </div>

      {/* Add Metric Modal */}
      {showAddMetric && (
        <Card>
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base">Add New Metric</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Create a new performance metric to track
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="metric-name" className="text-xs sm:text-sm">Metric Name</Label>
              <Input
                id="metric-name"
                placeholder="Enter metric name..."
                value={newMetricName}
                onChange={(e) => setNewMetricName(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="metric-value" className="text-xs sm:text-sm">Initial Value</Label>
              <Input
                id="metric-value"
                type="number"
                placeholder="Enter initial value..."
                value={newMetricValue}
                onChange={(e) => setNewMetricValue(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <Button onClick={handleAddMetric} size="sm" className="w-full sm:w-auto">
                <span className="text-xs sm:text-sm">Add Metric</span>
              </Button>
              <Button variant="outline" onClick={() => setShowAddMetric(false)} size="sm" className="w-full sm:w-auto">
                <span className="text-xs sm:text-sm">Cancel</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {performanceMetrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader className="p-2 sm:p-3 md:p-4 lg:p-6 pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <metric.icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm md:text-base truncate">{metric.name}</span>
                </div>
                <div className={cn(
                  "flex items-center space-x-0.5 sm:space-x-1 text-xs sm:text-sm",
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                )}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-3 md:p-4 lg:p-6 pt-0 mt-auto">
              <div className="space-y-1 sm:space-y-2">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  {metric.value}{metric.name === "Budget Variance" ? "%" : ""}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {metric.description}
                </p>
                <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                  <div 
                    className={cn(
                      "h-1.5 sm:h-2 rounded-full transition-all duration-300",
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
        <CardHeader className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <CardTitle className="flex items-center space-x-1.5 sm:space-x-2">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-orange-500 flex-shrink-0" />
              <span className="text-sm sm:text-base md:text-lg">Anomaly Detection Alerts</span>
            </CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Export Report</span>
            </Button>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            AI-powered alerts for performance anomalies and trends
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          {anomalyAlerts.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-muted-foreground mb-1 sm:mb-2">No Alerts</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                All systems are operating within normal parameters
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {anomalyAlerts.map((alert) => (
                <div key={alert.id} className={cn(
                  "flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 md:p-4 rounded-lg border",
                  alert.severity === "high" && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
                  alert.severity === "medium" && "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950",
                  alert.severity === "low" && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
                )}>
                  <div className={cn(
                    "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    alert.severity === "high" && "bg-red-500 text-white",
                    alert.severity === "medium" && "bg-orange-500 text-white",
                    alert.severity === "low" && "bg-blue-500 text-white"
                  )}>
                    <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
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
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-sm sm:text-base md:text-lg">Export Performance Data</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Download performance reports and analytics data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Export to CSV</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Export to Excel</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Generate PDF Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
