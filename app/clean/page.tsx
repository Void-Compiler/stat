"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
}

export default function CleanPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileData[]>([])
  const [selectedFile, setSelectedFile] = useState("")
  const [selectedFileData, setSelectedFileData] = useState<UploadedFileData | null>(null)
  const [cleaningProgress, setCleaningProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [dataIssues, setDataIssues] = useState<DataIssue[]>([])

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
          if (value === "" || value === null || value === undefined) {
            issues.push({
              id: `missing-${rowIndex}-${column}`,
              type: "missing",
              column,
              row: rowIndex + 1,
              value: null,
              suggestion: `Impute with median/mode value`,
              severity: "medium",
            })
          }

          if (typeof value === "string" && !isNaN(Number(value)) && Number(value) > 100000) {
            issues.push({
              id: `outlier-${rowIndex}-${column}`,
              type: "outlier",
              column,
              row: rowIndex + 1,
              value: String(value),
              suggestion: `Cap at 95th percentile`,
              severity: "high",
            })
          }
        })
      })

      setDataIssues(issues.slice(0, 10))
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
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)
  }

  const handleProceedToAnalysis = () => {
    if (selectedFileData) {
      localStorage.setItem(
        "cleanedFile",
        JSON.stringify({
          ...selectedFileData,
          cleanedAt: new Date().toISOString(),
          issuesResolved: dataIssues.length,
        }),
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 p-4 bg-sidebar border-r border-sidebar-border">
          <nav className="space-y-2">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <Database className="w-4 h-4" />
              Clean & Validate
            </Button>
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
              <Card className="mb-6 border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-2 text-primary">No Files Uploaded</h3>
                  <p className="text-muted-foreground mb-4">
                    Please upload your survey data files first to begin the cleaning process.
                  </p>
                  <Link href="/upload">
                    <Button className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 gap-2">
                      <Zap className="w-4 h-4" />
                      Upload Data Files
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* File Selection */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="font-heading">Select Dataset</CardTitle>
                    <CardDescription>Choose the uploaded file you want to clean and validate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedFile} onValueChange={setSelectedFile}>
                      <SelectTrigger className="w-full max-w-md">
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
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="issues">Data Issues</TabsTrigger>
                    <TabsTrigger value="rules">Cleaning Rules</TabsTrigger>
                    <TabsTrigger value="preview">Data Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
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

                      <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-warning" />
                            <span className="text-sm font-medium text-warning">Issues Found</span>
                          </div>
                          <div className="text-2xl font-heading font-bold text-warning">{dataIssues.length}</div>
                          <p className="text-xs text-muted-foreground">Needs attention</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
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

                      <Card className="bg-gradient-to-br from-info/5 to-info/10 border-info/20">
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

                    <Card>
                      <CardHeader>
                        <CardTitle className="font-heading">Data Cleaning Actions</CardTitle>
                        <CardDescription>Start the automated cleaning process or proceed to analysis</CardDescription>
                      </CardHeader>
                      <CardContent className="flex gap-4">
                        <Button onClick={handleStartCleaning} disabled={isProcessing} className="gap-2">
                          {isProcessing ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          {isProcessing ? "Processing..." : "Start Auto-Clean"}
                        </Button>
                        <Button variant="outline" onClick={() => setActiveTab("issues")} className="gap-2">
                          <Eye className="w-4 h-4" />
                          Review Issues
                        </Button>
                        <Button variant="outline" onClick={() => setActiveTab("rules")} className="gap-2">
                          <Filter className="w-4 h-4" />
                          Configure Rules
                        </Button>
                        <Link href="/analyze">
                          <Button variant="default" onClick={handleProceedToAnalysis} className="gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Proceed to Analysis
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-heading">Data Preview</CardTitle>
                        <CardDescription>Preview your dataset and see potential issues highlighted</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedFileData?.fullData && selectedFileData.fullData.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b">
                                  {Object.keys(selectedFileData.fullData[0]).map((column) => (
                                    <th key={column} className="text-left p-2 font-medium text-sm">
                                      {column}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {selectedFileData.fullData.slice(0, 10).map((row, idx) => (
                                  <tr key={idx} className="border-b hover:bg-muted/50">
                                    {Object.entries(row).map(([column, value], cellIdx) => {
                                      const hasIssue = dataIssues.some(
                                        (issue) => issue.row === idx + 1 && issue.column === column,
                                      )
                                      return (
                                        <td
                                          key={cellIdx}
                                          className={`p-2 text-sm ${hasIssue ? "bg-red-50 text-red-700" : ""}`}
                                        >
                                          {value === null || value === "" ? (
                                            <span className="text-muted-foreground italic">empty</span>
                                          ) : (
                                            String(value)
                                          )}
                                          {hasIssue && <AlertTriangle className="w-3 h-3 inline ml-1 text-red-500" />}
                                        </td>
                                      )
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No data available for preview</p>
                        )}
                        <div className="mt-4 text-sm text-muted-foreground">
                          Showing {Math.min(10, selectedFileData?.fullData?.length || 0)} of{" "}
                          {selectedFileData?.fullData?.length || 0} records. Issues are highlighted in red.
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
