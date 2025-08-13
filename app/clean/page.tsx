"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Database, CheckCircle, AlertTriangle, X, RefreshCw, Eye, Filter, TrendingUp } from "lucide-react"

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
        <aside className="w-64 p-4 bg-sidebar">{/* Sidebar content */}</aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="font-heading font-bold text-2xl text-foreground mb-2">Clean and Validate Data</h1>
              <p className="text-muted-foreground">
                Review and clean your survey data using AI-powered validation and automated cleaning rules.
              </p>
            </div>

            {uploadedFiles.length === 0 ? (
              <Card className="mb-6">
                <CardContent className="p-8 text-center">
                  <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-lg mb-2">No Files Uploaded</h3>
                  <p className="text-muted-foreground mb-4">
                    Please upload your survey data files first to begin the cleaning process.
                  </p>
                  <Link href="/upload">
                    <Button>Upload Data Files</Button>
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
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">Total Records</span>
                          </div>
                          <div className="text-2xl font-heading font-bold">
                            {selectedFileData?.fullData?.length || 0}
                          </div>
                          <p className="text-xs text-muted-foreground">Survey responses</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">Issues Found</span>
                          </div>
                          <div className="text-2xl font-heading font-bold">{dataIssues.length}</div>
                          <p className="text-xs text-muted-foreground">Needs attention</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <X className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">Critical Issues</span>
                          </div>
                          <div className="text-2xl font-heading font-bold">
                            {dataIssues.filter((i) => i.severity === "high").length}
                          </div>
                          <p className="text-xs text-muted-foreground">High priority</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Database className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Columns</span>
                          </div>
                          <div className="text-2xl font-heading font-bold">
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
