"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Home,
  Database,
  TrendingUp,
  FileOutput,
  Settings,
} from "lucide-react"
import Link from "next/link"

interface UploadedFile {
  file: File
  id: string
  status: "uploading" | "success" | "error"
  progress: number
  preview?: any[]
  fileName?: string
  fileSize?: number
  fullData?: any[]
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    JSON.parse(localStorage.getItem("uploadedFiles") || "[]"),
  )
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]
      return (
        validTypes.includes(file.type) ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")
      )
    })

    validFiles.forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9)
      const newFile: UploadedFile = {
        file,
        id: fileId,
        status: "uploading",
        progress: 0,
      }

      setUploadedFiles((prev) => [...prev, newFile])

      // Simulate progress while reading
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileId && f.status === "uploading") {
              const newProgress = Math.min(f.progress + Math.random() * 30, 90)
              return { ...f, progress: newProgress }
            }
            return f
          }),
        )
      }, 200)

      setTimeout(() => {
        clearInterval(interval)
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          let preview: any[] = []
          let fullData: any[] = []

          if (file.name.endsWith(".csv")) {
            // Parse CSV
            const lines = text.split("\n").filter((line) => line.trim())
            if (lines.length > 0) {
              const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

              fullData = lines.slice(1).map((line) => {
                const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
                const row: any = {}
                headers.forEach((header, idx) => {
                  row[header] = values[idx] || ""
                })
                return row
              })

              preview = fullData.slice(0, 3) // Just first 3 for preview
            }
          }

          const updatedFile = {
            ...newFile,
            status: "success" as const,
            progress: 100,
            preview,
            fileName: file.name,
            fileSize: file.size,
            fullData, // Store complete dataset
          }

          setUploadedFiles((prev) => {
            const updated = prev.map((f) => {
              if (f.id === fileId) {
                return updatedFile
              }
              return f
            })

            const filesToSave = updated
              .filter((f) => f.status === "success")
              .map((f) => ({
                id: f.id,
                fileName: f.fileName || f.file.name,
                fileSize: f.fileSize || f.file.size,
                preview: f.preview,
                fullData: f.fullData,
                uploadedAt: new Date().toISOString(),
              }))

            localStorage.setItem("uploadedFiles", JSON.stringify(filesToSave))

            return updated
          })
        }

        reader.onerror = () => {
          setUploadedFiles((prev) =>
            prev.map((f) => {
              if (f.id === fileId) {
                return { ...f, status: "error" as const, progress: 0 }
              }
              return f
            }),
          )
        }

        reader.readAsText(file)
      }, 1000)
    })
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId)
      localStorage.setItem("uploadedFiles", JSON.stringify(updated.filter((f) => f.status === "success")))
      return updated
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-xl text-foreground">StatSense AI</h1>
                  <p className="text-xs text-muted-foreground">Intelligent Statistical Data Processing</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              AI-Powered
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-73px)] bg-sidebar border-r">
          <nav className="p-4 space-y-2">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <Upload className="w-4 h-4" />
              Upload Data
            </Button>
            <Link href="/clean">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Database className="w-4 h-4" />
                Clean & Validate
              </Button>
            </Link>
            <Link href="/analyze">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <TrendingUp className="w-4 h-4" />
                Analyze Trends
              </Button>
            </Link>
            <Link href="/reports">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <FileOutput className="w-4 h-4" />
                Generate Reports
              </Button>
            </Link>
            <div className="pt-4 border-t border-sidebar-border">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="font-heading font-bold text-2xl text-foreground mb-2">Upload Survey Data</h1>
              <p className="text-muted-foreground">
                Upload your CSV or Excel files to begin the data processing workflow. Files will be automatically
                validated and prepared for analysis.
              </p>
            </div>

            {/* Upload Area */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-2">Drop your files here</h3>
                      <p className="text-muted-foreground mb-4">Supports CSV, XLS, and XLSX files up to 50MB each</p>
                      <input
                        type="file"
                        multiple
                        accept=".csv,.xls,.xlsx"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button asChild className="cursor-pointer">
                          <span>Choose Files</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Requirements */}
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>File Requirements:</strong> Please ensure your data format is correct before uploading. Files
                should contain survey data with proper column headers and consistent data types.
              </AlertDescription>
            </Alert>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Uploaded Files</CardTitle>
                  <CardDescription>Track the progress of your file uploads and validation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {uploadedFiles.map((uploadedFile) => (
                    <div key={uploadedFile.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">{uploadedFile.fileName || uploadedFile.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(uploadedFile.fileSize || uploadedFile.file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploadedFile.status === "success" && (
                            <Badge variant="secondary" className="gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Ready
                            </Badge>
                          )}
                          {uploadedFile.status === "uploading" && <Badge variant="outline">Processing...</Badge>}
                          <Button variant="ghost" size="sm" onClick={() => removeFile(uploadedFile.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {uploadedFile.status === "uploading" && (
                        <Progress value={uploadedFile.progress} className="mb-3" />
                      )}

                      {uploadedFile.status === "success" && uploadedFile.preview && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium mb-2">Data Preview:</p>
                          <div className="text-xs text-muted-foreground">
                            <div className="grid grid-cols-3 gap-2">
                              {Object.keys(uploadedFile.preview[0]).map((key) => (
                                <div key={key} className="font-medium">
                                  {key}
                                </div>
                              ))}
                            </div>
                            {uploadedFile.preview.slice(0, 2).map((row, idx) => (
                              <div key={idx} className="grid grid-cols-3 gap-2 mt-1">
                                {Object.values(row).map((value, i) => (
                                  <div key={i}>{String(value)}</div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {uploadedFiles.some((f) => f.status === "success") && (
                    <div className="pt-4 border-t">
                      <Link href="/clean">
                        <Button className="w-full">Proceed to Data Cleaning</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
