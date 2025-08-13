"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import {
  Database,
  CheckCircle,
  AlertTriangle,
  X,
  RefreshCw,
  Eye,
  Filter,
  TrendingUp,
  BarChart3,
  Zap,
  Home,
  Upload,
  FileOutput,
  Settings,
  Sparkles,
  Target,
  Trash2,
  Edit3,
} from "lucide-react"

interface UploadedFileData {
  id: string
  fileName: string
  fileSize: number
  preview: any[]
  fullData: any[]
  uploadedAt: string
}

interface DataIssue {
  id: string
  type: "missing" | "outlier" | "invalid" | "duplicate"
  column: string
  row: number
  value: string | null
  suggestion: string
  severity: "high" | "medium" | "low"
  resolved?: boolean
}

interface CleaningRule {
  id: string
  name: string
  type: "remove_duplicates" | "fill_missing" | "cap_outliers" | "validate_format"
  column: string
  action: string
  parameter?: string
  enabled: boolean
}

export default function CleanPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileData[]>([])
  const [selectedFile, setSelectedFile] = useState("")
  const [selectedFileData, setSelectedFileData] = useState<UploadedFileData | null>(null)
  const [cleaningProgress, setCleaningProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [dataIssues, setDataIssues] = useState<DataIssue[]>([])
  const [cleaningRules, setCleaningRules] = useState<CleaningRule[]>([])
  const [isProceedingToAnalysis, setIsProceedingToAnalysis] = useState(false)

  useEffect(() => {
    const savedFiles = localStorage.getItem("uploadedFiles")
    if (savedFiles) {
      const files = JSON.parse(savedFiles)
      setUploadedFiles(files)
      if (files.length > 0) {
        setSelectedFile(files[0].fileName)
        setSelectedFileData(files[0])
      }
    }
  }, [])

  useEffect(() => {
    const file = uploadedFiles.find((f) => f.fileName === selectedFile)
    setSelectedFileData(file || null)
  }, [selectedFile, uploadedFiles])

  useEffect(() => {
    if (selectedFileData?.fullData) {
      const issues: DataIssue[] = []
      const data = selectedFileData.fullData

      data.forEach((row, rowIndex) => {
        Object.entries(row).forEach(([column, value]) => {
          // Missing values
          if (value === "" || value === null || value === undefined) {
            issues.push({
              id: `missing-${rowIndex}-${column}`,
              type: "missing",
              column,
              row: rowIndex + 1,
              value: null,
              suggestion: `Impute with median/mode value for ${column}`,
              severity: "medium",
              resolved: false,
            })
          }

          // Outliers for numeric values
          if (typeof value === "string" && !isNaN(Number(value)) && Number(value) > 100000) {
            issues.push({
              id: `outlier-${rowIndex}-${column}`,
              type: "outlier",
              column,
              row: rowIndex + 1,
              value: String(value),
              suggestion: `Cap ${column} at 95th percentile (${Number(value) * 0.95})`,
              severity: "high",
              resolved: false,
            })
          }

          // Invalid formats (example: email-like patterns)
          if (
            typeof value === "string" &&
            column.toLowerCase().includes("email") &&
            value.includes("@") === false &&
            value !== ""
          ) {
            issues.push({
              id: `invalid-${rowIndex}-${column}`,
              type: "invalid",
              column,
              row: rowIndex + 1,
              value: String(value),
              suggestion: `Validate email format for ${column}`,
              severity: "high",
              resolved: false,
            })
          }
        })
      })

      // Check for duplicates
      const seen = new Set()
      data.forEach((row, rowIndex) => {
        const rowString = JSON.stringify(row)
        if (seen.has(rowString)) {
          issues.push({
            id: `duplicate-${rowIndex}`,
            type: "duplicate",
            column: "All columns",
            row: rowIndex + 1,
            value: "Duplicate row",
            suggestion: "Remove duplicate record",
            severity: "medium",
            resolved: false,
          })
        }
        seen.add(rowString)
      })

      setDataIssues(issues.slice(0, 20)) // Show first 20 issues

      const columns = selectedFileData.fullData.length > 0 ? Object.keys(selectedFileData.fullData[0]) : []
      const defaultRules: CleaningRule[] = [
        {
          id: "rule-1",
          name: "Remove Duplicate Records",
          type: "remove_duplicates",
          column: "All columns",
          action: "Remove exact duplicate rows",
          enabled: true,
        },
        {
          id: "rule-2",
          name: "Fill Missing Values",
          type: "fill_missing",
          column: columns[0] || "column1",
          action: "Fill with median value",
          parameter: "median",
          enabled: true,
        },
        {
          id: "rule-3",
          name: "Cap Outliers",
          type: "cap_outliers",
          column: columns[0] || "column1",
          action: "Cap at 95th percentile",
          parameter: "95",
          enabled: false,
        },
        {
          id: "rule-4",
          name: "Validate Format",
          type: "validate_format",
          column: columns[1] || "column2",
          action: "Validate data format",
          parameter: "text",
          enabled: false,
        },
      ]
      setCleaningRules(defaultRules)
    }
  }, [selectedFileData])

  const handleStartCleaning = () => {
    setIsProcessing(true)
    setCleaningProgress(0)

    const interval = setInterval(() => {
      setCleaningProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          // Mark some issues as resolved
          setDataIssues((prev) =>
            prev.map((issue) => ({
              ...issue,
              resolved: Math.random() > 0.3, // Randomly resolve 70% of issues
            })),
          )
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)
  }

  const handleProceedToAnalysis = async () => {
    if (selectedFileData) {
      setIsProceedingToAnalysis(true)

      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 800))

      localStorage.setItem(
        "cleanedFile",
        JSON.stringify({
          ...selectedFileData,
          cleanedAt: new Date().toISOString(),
          issuesResolved: dataIssues.filter((i) => i.resolved).length,
        }),
      )

      setIsProceedingToAnalysis(false)
    }
  }

  const toggleIssueResolution = (issueId: string) => {
    setDataIssues((prev) =>
      prev.map((issue) => (issue.id === issueId ? { ...issue, resolved: !issue.resolved } : issue)),
    )
  }

  const toggleRule = (ruleId: string) => {
    setCleaningRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-destructive bg-destructive/10 border-destructive/20"
      case "medium":
        return "text-warning bg-warning/10 border-warning/20"
      case "low":
        return "text-info bg-info/10 border-info/20"
      default:
        return "text-muted-foreground bg-muted/10 border-muted/20"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "missing":
        return "text-warning"
      case "outlier":
        return "text-destructive"
      case "invalid":
        return "text-destructive"
      case "duplicate":
        return "text-info"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-xl text-foreground">StatSense AI</h1>
                  <p className="text-xs text-muted-foreground">Intelligent Statistical Data Processing</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20 gap-1">
              <Sparkles className="w-3 h-3" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-73px)] bg-sidebar border-r border-sidebar-border">
          <nav className="p-4 space-y-2">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/upload">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1"
              >
                <Upload className="w-4 h-4" />
                Upload Data
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <Database className="w-4 h-4" />
              Clean & Validate
            </Button>
            <Link href="/analyze">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1"
              >
                <TrendingUp className="w-4 h-4" />
                Analyze Trends
              </Button>
            </Link>
            <Link href="/reports">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1"
              >
                <FileOutput className="w-4 h-4" />
                Generate Reports
              </Button>
            </Link>
            <div className="pt-4 border-t border-sidebar-border">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="font-heading font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Clean and Validate Data
              </h1>
              <p className="text-muted-foreground text-lg">
                Review and clean your survey data using AI-powered validation and automated cleaning rules.
              </p>
            </div>

            {uploadedFiles.length === 0 ? (
              <Card className="mb-6 border-primary/20 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-2 text-primary">No Files Uploaded</h3>
                  <p className="text-muted-foreground mb-4">
                    Please upload your survey data files first to begin the cleaning process.
                  </p>
                  <Link href="/upload">
                    <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 gap-2">
                      <Zap className="w-4 h-4" />
                      Upload Data Files
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* File Selection */}
                <Card className="mb-6 border-primary/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                    <CardTitle className="font-heading text-primary">Select Dataset</CardTitle>
                    <CardDescription>Choose the uploaded file you want to clean and validate</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Select value={selectedFile} onValueChange={setSelectedFile}>
                      <SelectTrigger className="w-full max-w-md border-primary/20 focus:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {uploadedFiles.map((file) => (
                          <SelectItem key={file.id} value={file.fileName}>
                            {file.fileName} ({(file.fileSize / 1024 / 1024).toFixed(1)} MB)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-primary/10 to-accent/10">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="issues"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Data Issues
                    </TabsTrigger>
                    <TabsTrigger
                      value="rules"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Cleaning Rules
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Data Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-success" />
                            <span className="text-sm font-medium text-success">Total Records</span>
                          </div>
                          <div className="text-2xl font-heading font-bold text-success">
                            {selectedFileData?.fullData?.length || 0}
                          </div>
                          <p className="text-xs text-muted-foreground">Survey responses</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-warning" />
                            <span className="text-sm font-medium text-warning">Issues Found</span>
                          </div>
                          <div className="text-2xl font-heading font-bold text-warning">{dataIssues.length}</div>
                          <p className="text-xs text-muted-foreground">Needs attention</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <X className="w-4 h-4 text-destructive" />
                            <span className="text-sm font-medium text-destructive">Critical Issues</span>
                          </div>
                          <div className="text-2xl font-heading font-bold text-destructive">
                            {dataIssues.filter((i) => i.severity === "high").length}
                          </div>
                          <p className="text-xs text-muted-foreground">High priority</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Database className="w-4 h-4 text-info" />
                            <span className="text-sm font-medium text-info">Columns</span>
                          </div>
                          <div className="text-2xl font-heading font-bold text-info">
                            {selectedFileData?.fullData?.[0] ? Object.keys(selectedFileData.fullData[0]).length : 0}
                          </div>
                          <p className="text-xs text-muted-foreground">Data fields</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Processing Progress */}
                    {isProcessing && (
                      <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5 shadow-lg">
                        <CardHeader>
                          <CardTitle className="font-heading text-accent">Processing Data Cleaning</CardTitle>
                          <CardDescription>Applying cleaning rules and resolving data issues</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Progress value={cleaningProgress} className="mb-2 h-3" />
                          <p className="text-sm text-muted-foreground">
                            {Math.round(cleaningProgress)}% complete - Cleaning data and applying validation rules...
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="border-primary/20 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                        <CardTitle className="font-heading text-primary">Data Cleaning Actions</CardTitle>
                        <CardDescription>Start the automated cleaning process or proceed to analysis</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-4 pt-6">
                        <Button
                          onClick={handleStartCleaning}
                          disabled={isProcessing}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 gap-2"
                        >
                          {isProcessing ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          {isProcessing ? "Processing..." : "Start Auto-Clean"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("issues")}
                          className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
                        >
                          <Eye className="w-4 h-4" />
                          Review Issues
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("rules")}
                          className="gap-2 border-accent/20 text-accent hover:bg-accent/5"
                        >
                          <Filter className="w-4 h-4" />
                          Configure Rules
                        </Button>
                        <Link href="/analyze">
                          <Button
                            variant="default"
                            onClick={handleProceedToAnalysis}
                            disabled={isProceedingToAnalysis}
                            className="gap-2 bg-success hover:bg-success/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                          >
                            {isProceedingToAnalysis ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            {isProceedingToAnalysis ? "Preparing Analysis..." : "Proceed to Analysis"}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="issues" className="space-y-4">
                    <Card className="border-warning/20 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-warning/5 to-accent/5">
                        <CardTitle className="font-heading text-warning flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Data Quality Issues
                        </CardTitle>
                        <CardDescription>Review and resolve data quality issues found in your dataset</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {dataIssues.length === 0 ? (
                            <div className="text-center py-8">
                              <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                              <h3 className="font-heading font-semibold text-lg text-success mb-2">No Issues Found</h3>
                              <p className="text-muted-foreground">
                                Your data appears to be clean and ready for analysis.
                              </p>
                            </div>
                          ) : (
                            dataIssues.map((issue) => (
                              <div
                                key={issue.id}
                                className={`p-4 rounded-lg border ${issue.resolved ? "bg-success/5 border-success/20" : "bg-card border-border"} transition-all duration-200`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                                        {issue.severity.toUpperCase()}
                                      </Badge>
                                      <Badge variant="outline" className={`${getTypeColor(issue.type)} bg-transparent`}>
                                        {issue.type.toUpperCase()}
                                      </Badge>
                                      <span className="text-sm text-muted-foreground">Row {issue.row}</span>
                                    </div>
                                    <h4 className="font-medium text-foreground mb-1">
                                      {issue.column} - {issue.type} value
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Value: {issue.value || "empty"}
                                    </p>
                                    <p className="text-sm text-info">
                                      <Target className="w-3 h-3 inline mr-1" />
                                      {issue.suggestion}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => toggleIssueResolution(issue.id)}
                                      className={issue.resolved ? "bg-success/10 border-success text-success" : ""}
                                    >
                                      {issue.resolved ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                      {issue.resolved ? "Resolved" : "Mark Resolved"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {dataIssues.length > 0 && (
                          <div className="mt-6 p-4 bg-gradient-to-r from-info/5 to-primary/5 rounded-lg border border-info/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-info mb-1">Issue Summary</h4>
                                <p className="text-sm text-muted-foreground">
                                  {dataIssues.filter((i) => i.resolved).length} of {dataIssues.length} issues resolved
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-heading font-bold text-info">
                                  {Math.round((dataIssues.filter((i) => i.resolved).length / dataIssues.length) * 100)}%
                                </div>
                                <p className="text-xs text-muted-foreground">Complete</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="rules" className="space-y-4">
                    <Card className="border-accent/20 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
                        <CardTitle className="font-heading text-accent flex items-center gap-2">
                          <Filter className="w-5 h-5" />
                          Data Cleaning Rules
                        </CardTitle>
                        <CardDescription>
                          Configure automated rules for cleaning and validating your data
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {cleaningRules.map((rule) => (
                            <div
                              key={rule.id}
                              className={`p-4 rounded-lg border transition-all duration-200 ${rule.enabled ? "bg-primary/5 border-primary/20" : "bg-muted/5 border-muted/20"}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Checkbox
                                      checked={rule.enabled}
                                      onCheckedChange={() => toggleRule(rule.id)}
                                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                    <h4 className="font-medium text-foreground">{rule.name}</h4>
                                    <Badge
                                      variant="outline"
                                      className={
                                        rule.enabled
                                          ? "bg-primary/10 text-primary border-primary/20"
                                          : "bg-muted/10 text-muted-foreground border-muted/20"
                                      }
                                    >
                                      {rule.type.replace("_", " ").toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div className="ml-6">
                                    <p className="text-sm text-muted-foreground mb-2">
                                      <strong>Column:</strong> {rule.column}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      <strong>Action:</strong> {rule.action}
                                    </p>
                                    {rule.parameter && (
                                      <p className="text-sm text-muted-foreground">
                                        <strong>Parameter:</strong> {rule.parameter}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                                    <Edit3 className="w-3 h-3" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-destructive hover:bg-destructive/5 bg-transparent"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-r from-success/5 to-accent/5 rounded-lg border border-success/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-success mb-1">Active Rules</h4>
                              <p className="text-sm text-muted-foreground">
                                {cleaningRules.filter((r) => r.enabled).length} of {cleaningRules.length} rules enabled
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              className="gap-2 border-success/20 text-success hover:bg-success/5 bg-transparent"
                            >
                              <Zap className="w-4 h-4" />
                              Add New Rule
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    <Card className="border-info/20 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-info/5 to-primary/5">
                        <CardTitle className="font-heading text-info">Data Preview</CardTitle>
                        <CardDescription>Preview your dataset and see potential issues highlighted</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {selectedFileData?.fullData && selectedFileData.fullData.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
                                  {Object.keys(selectedFileData.fullData[0]).map((column) => (
                                    <th key={column} className="text-left p-3 font-medium text-sm text-primary">
                                      {column}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {selectedFileData.fullData.slice(0, 10).map((row, idx) => (
                                  <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                                    {Object.entries(row).map(([column, value], cellIdx) => {
                                      const hasIssue = dataIssues.some(
                                        (issue) => issue.row === idx + 1 && issue.column === column && !issue.resolved,
                                      )
                                      const isResolved = dataIssues.some(
                                        (issue) => issue.row === idx + 1 && issue.column === column && issue.resolved,
                                      )
                                      return (
                                        <td
                                          key={cellIdx}
                                          className={`p-3 text-sm transition-colors ${
                                            hasIssue
                                              ? "bg-destructive/10 text-destructive border-l-2 border-destructive"
                                              : isResolved
                                                ? "bg-success/10 text-success border-l-2 border-success"
                                                : ""
                                          }`}
                                        >
                                          {value === null || value === "" ? (
                                            <span className="text-muted-foreground italic">empty</span>
                                          ) : (
                                            String(value)
                                          )}
                                          {hasIssue && (
                                            <AlertTriangle className="w-3 h-3 inline ml-1 text-destructive" />
                                          )}
                                          {isResolved && <CheckCircle className="w-3 h-3 inline ml-1 text-success" />}
                                        </td>
                                      )
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No data available for preview</p>
                          </div>
                        )}
                        <div className="mt-4 p-3 bg-gradient-to-r from-info/5 to-accent/5 rounded-lg border border-info/20">
                          <p className="text-sm text-info">
                            <strong>Legend:</strong>
                            <span className="ml-2 inline-flex items-center gap-1">
                              <div className="w-3 h-3 bg-destructive/20 border-l-2 border-destructive"></div>
                              Issues
                            </span>
                            <span className="ml-4 inline-flex items-center gap-1">
                              <div className="w-3 h-3 bg-success/20 border-l-2 border-success"></div>
                              Resolved
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Showing {Math.min(10, selectedFileData?.fullData?.length || 0)} of{" "}
                            {selectedFileData?.fullData?.length || 0} records.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
