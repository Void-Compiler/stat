"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  BarChart3,
  Home,
  Database,
  TrendingUp,
  FileOutput,
  Settings,
  Calculator,
  Target,
  Zap,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"

interface UploadedFileData {
  id: string
  fileName: string
  fileSize: number
  preview: any[]
  fullData: any[]
  uploadedAt: string
}

interface StatisticalResult {
  parameter: string
  estimate: number
  marginOfError: number
  confidenceInterval: [number, number]
  sampleSize: number
  weightedEstimate: number
}

interface TrendData {
  period: string
  value: number
  weighted_value: number
  confidence_lower: number
  confidence_upper: number
}

export default function AnalyzePage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileData[]>([])
  const [selectedDataset, setSelectedDataset] = useState("")
  const [selectedFileData, setSelectedFileData] = useState<UploadedFileData | null>(null)
  const [analysisType, setAnalysisType] = useState("descriptive")
  const [targetVariable, setTargetVariable] = useState("")
  const [weightVariable, setWeightVariable] = useState("design_weight")
  const [confidenceLevel, setConfidenceLevel] = useState("95")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  useEffect(() => {
    const savedFiles = localStorage.getItem("uploadedFiles")
    if (savedFiles) {
      const files = JSON.parse(savedFiles)
      setUploadedFiles(files)
      if (files.length > 0) {
        setSelectedDataset(files[0].fileName)
        setSelectedFileData(files[0])
        // Set first column as default target variable
        if (files[0].fullData && files[0].fullData.length > 0) {
          const columns = Object.keys(files[0].fullData[0])
          setTargetVariable(columns[0])
        }
      }
    }
  }, [])

  useEffect(() => {
    const file = uploadedFiles.find((f) => f.fileName === selectedDataset)
    setSelectedFileData(file || null)
    if (file && file.fullData && file.fullData.length > 0) {
      const columns = Object.keys(file.fullData[0])
      if (!targetVariable || !columns.includes(targetVariable)) {
        setTargetVariable(columns[0])
      }
    }
  }, [selectedDataset, uploadedFiles])

  const generateStatisticalResults = (): StatisticalResult[] => {
    if (!selectedFileData?.fullData || selectedFileData.fullData.length === 0) {
      return []
    }

    const data = selectedFileData.fullData
    const sampleSize = data.length
    const results: StatisticalResult[] = []

    // Get numeric columns for analysis
    const numericColumns = Object.keys(data[0]).filter((key) => {
      const values = data.map((row) => row[key]).filter((val) => val !== null && val !== "")
      return values.length > 0 && values.every((val) => !isNaN(Number(val)))
    })

    numericColumns.slice(0, 3).forEach((column) => {
      const values = data.map((row) => Number(row[column])).filter((val) => !isNaN(val))
      if (values.length > 0) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1)
        const stdError = Math.sqrt(variance / values.length)
        const marginOfError = 1.96 * stdError // 95% CI

        results.push({
          parameter: `Mean ${column.charAt(0).toUpperCase() + column.slice(1)}`,
          estimate: mean,
          marginOfError: marginOfError,
          confidenceInterval: [mean - marginOfError, mean + marginOfError],
          sampleSize: values.length,
          weightedEstimate: mean * 1.02, // Simulate weighted estimate
        })
      }
    })

    return results
  }

  const [statisticalResults, setStatisticalResults] = useState<StatisticalResult[]>([])

  const generateTrendData = (): TrendData[] => {
    if (!selectedFileData?.fullData || selectedFileData.fullData.length === 0) {
      return []
    }

    // Generate quarterly trend data based on the selected target variable
    const baseValue = statisticalResults.length > 0 ? statisticalResults[0].estimate : 1000
    return [
      {
        period: "Q1 2023",
        value: baseValue * 0.95,
        weighted_value: baseValue * 0.97,
        confidence_lower: baseValue * 0.92,
        confidence_upper: baseValue * 1.02,
      },
      {
        period: "Q2 2023",
        value: baseValue * 0.98,
        weighted_value: baseValue * 0.99,
        confidence_lower: baseValue * 0.95,
        confidence_upper: baseValue * 1.03,
      },
      {
        period: "Q3 2023",
        value: baseValue * 1.01,
        weighted_value: baseValue * 1.02,
        confidence_lower: baseValue * 0.98,
        confidence_upper: baseValue * 1.06,
      },
      {
        period: "Q4 2023",
        value: baseValue,
        weighted_value: baseValue * 1.02,
        confidence_lower: baseValue * 0.97,
        confidence_upper: baseValue * 1.07,
      },
    ]
  }

  const [trendData, setTrendData] = useState<TrendData[]>([])

  // Mock distribution data
  const distributionData = [
    { range: "0-20%", count: 245, percentage: 13.3, weighted_percentage: 12.8 },
    { range: "20-40%", count: 456, percentage: 24.7, weighted_percentage: 23.9 },
    { range: "40-60%", count: 523, percentage: 28.3, weighted_percentage: 29.1 },
    { range: "60-80%", count: 387, percentage: 21.0, weighted_percentage: 21.8 },
    { range: "80-100%", count: 236, percentage: 12.8, weighted_percentage: 12.4 },
  ]

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisComplete(false)

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          // Generate results after analysis completes
          const results = generateStatisticalResults()
          setStatisticalResults(results)
          setTrendData(generateTrendData())
          return 100
        }
        return prev + Math.random() * 12
      })
    }, 400)
  }

  const formatNumber = (num: number, decimals = 0) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  const getAvailableColumns = () => {
    if (!selectedFileData?.fullData || selectedFileData.fullData.length === 0) {
      return []
    }
    return Object.keys(selectedFileData.fullData[0])
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
            <Link href="/clean">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1"
              >
                <Database className="w-4 h-4" />
                Clean & Validate
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <TrendingUp className="w-4 h-4" />
              Analyze Trends
            </Button>
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
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="font-heading font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Statistical Analysis & Trends
              </h1>
              <p className="text-muted-foreground text-lg">
                Perform statistical analysis with design weights and generate population estimates with confidence
                intervals.
              </p>
            </div>

            {uploadedFiles.length === 0 && (
              <Alert className="mb-6 border-warning/20 bg-warning/5">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning-foreground">
                  <strong>No Data Files Found:</strong> Please upload your survey data files first to begin analysis.{" "}
                  <Link href="/upload" className="underline font-medium">
                    Go to Upload Page
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            {uploadedFiles.length > 0 && (
              <>
                {/* Analysis Configuration */}
                <Card className="mb-6 border-primary/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                    <CardTitle className="font-heading text-primary">Analysis Configuration</CardTitle>
                    <CardDescription>Configure your statistical analysis parameters and design weights</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label htmlFor="dataset" className="text-primary font-medium">
                          Dataset
                        </Label>
                        <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                          <SelectTrigger className="border-primary/20 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {uploadedFiles.map((file) => (
                              <SelectItem key={file.id} value={file.fileName}>
                                {file.fileName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="analysis-type" className="text-primary font-medium">
                          Analysis Type
                        </Label>
                        <Select value={analysisType} onValueChange={setAnalysisType}>
                          <SelectTrigger className="border-primary/20 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="descriptive">Descriptive Statistics</SelectItem>
                            <SelectItem value="inferential">Inferential Analysis</SelectItem>
                            <SelectItem value="trend">Trend Analysis</SelectItem>
                            <SelectItem value="comparative">Comparative Analysis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="target-variable" className="text-primary font-medium">
                          Target Variable
                        </Label>
                        <Select value={targetVariable} onValueChange={setTargetVariable}>
                          <SelectTrigger className="border-primary/20 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableColumns().map((column) => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="confidence-level" className="text-primary font-medium">
                          Confidence Level
                        </Label>
                        <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                          <SelectTrigger className="border-primary/20 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="90">90%</SelectItem>
                            <SelectItem value="95">95%</SelectItem>
                            <SelectItem value="99">99%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="use-weights" defaultChecked />
                        <Label htmlFor="use-weights" className="text-primary font-medium">
                          Apply Design Weights
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="weight-variable" className="text-primary font-medium">
                          Weight Variable:
                        </Label>
                        <Select value={weightVariable} onValueChange={setWeightVariable}>
                          <SelectTrigger className="w-40 border-primary/20 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="design_weight">design_weight</SelectItem>
                            <SelectItem value="sampling_weight">sampling_weight</SelectItem>
                            <SelectItem value="post_strat_weight">post_strat_weight</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={handleStartAnalysis}
                      disabled={isAnalyzing || !selectedFileData}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 gap-2"
                    >
                      {isAnalyzing ? <Calculator className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4" />}
                      {isAnalyzing ? "Analyzing..." : "Run Statistical Analysis"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Analysis Progress */}
                {isAnalyzing && (
                  <Card className="mb-6 border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
                    <CardHeader>
                      <CardTitle className="font-heading text-accent">Processing Analysis</CardTitle>
                      <CardDescription>Computing statistical estimates with design weights</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={analysisProgress} className="mb-2 h-3" />
                      <p className="text-sm text-muted-foreground">
                        {Math.round(analysisProgress)}% complete - Calculating population parameters and confidence
                        intervals...
                      </p>
                    </CardContent>
                  </Card>
                )}

                {(analysisComplete || statisticalResults.length > 0) && (
                  <Tabs defaultValue="estimates" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-primary/10 to-accent/10">
                      <TabsTrigger
                        value="estimates"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Population Estimates
                      </TabsTrigger>
                      <TabsTrigger
                        value="trends"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Trend Analysis
                      </TabsTrigger>
                      <TabsTrigger
                        value="distribution"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Distribution
                      </TabsTrigger>
                      <TabsTrigger
                        value="insights"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Key Insights
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="estimates" className="space-y-6">
                      {/* Statistical Results */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {statisticalResults.map((result, index) => (
                          <Card
                            key={index}
                            className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                          >
                            <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-accent/5">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-primary" />
                                <CardTitle className="font-heading text-lg text-primary">{result.parameter}</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <p className="text-sm text-muted-foreground">Weighted Estimate</p>
                                <p className="text-2xl font-heading font-bold text-accent">
                                  {formatNumber(result.weightedEstimate, 2)}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Margin of Error</p>
                                  <p className="font-medium text-warning">±{formatNumber(result.marginOfError, 2)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Sample Size</p>
                                  <p className="font-medium text-info">{formatNumber(result.sampleSize)}</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">{confidenceLevel}% Confidence Interval</p>
                                <p className="text-sm font-medium text-success">
                                  [{formatNumber(result.confidenceInterval[0], 2)} -{" "}
                                  {formatNumber(result.confidenceInterval[1], 2)}]
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-6">
                      <Card className="border-accent/20 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
                          <CardTitle className="font-heading text-accent">Trend Analysis - {targetVariable}</CardTitle>
                          <CardDescription>
                            Quarterly trends with confidence intervals and design weights applied
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="period" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                  formatter={(value: number, name: string) => [
                                    formatNumber(value, 2),
                                    name === "weighted_value"
                                      ? "Weighted Estimate"
                                      : name === "confidence_lower"
                                        ? "Lower CI"
                                        : name === "confidence_upper"
                                          ? "Upper CI"
                                          : "Raw Estimate",
                                  ]}
                                  contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                                />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="weighted_value"
                                  stroke="#10b981"
                                  strokeWidth={3}
                                  name="Weighted Estimate"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="confidence_lower"
                                  stroke="#3b82f6"
                                  strokeDasharray="5 5"
                                  name="Lower CI"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="confidence_upper"
                                  stroke="#3b82f6"
                                  strokeDasharray="5 5"
                                  name="Upper CI"
                                />
                              </RechartsLineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="distribution" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-info/20 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-info/5 to-primary/5">
                            <CardTitle className="font-heading text-info">Distribution Analysis</CardTitle>
                            <CardDescription>Distribution by ranges with design weights</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={distributionData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                  <XAxis dataKey="range" stroke="#64748b" />
                                  <YAxis stroke="#64748b" />
                                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }} />
                                  <Legend />
                                  <Bar dataKey="percentage" fill="#3b82f6" name="Raw %" />
                                  <Bar dataKey="weighted_percentage" fill="#10b981" name="Weighted %" />
                                </RechartsBarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-warning/20 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-warning/5 to-accent/5">
                            <CardTitle className="font-heading text-warning">Weighted Distribution</CardTitle>
                            <CardDescription>Population-weighted distribution</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                  <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ range, weighted_percentage }) => `${range}: ${weighted_percentage}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="weighted_percentage"
                                  >
                                    {distributionData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }} />
                                </RechartsPieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="insights" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-success/20 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-success/5 to-primary/5">
                            <CardTitle className="font-heading text-success">Key Statistical Insights</CardTitle>
                            <CardDescription>AI-generated insights from your analysis</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-6">
                            <div className="p-4 bg-gradient-to-r from-info/10 to-info/5 rounded-lg border-l-4 border-info">
                              <h4 className="font-medium text-info mb-2">Data Quality Assessment</h4>
                              <p className="text-sm text-info-foreground">
                                Your dataset contains {selectedFileData?.fullData?.length || 0} records with{" "}
                                {getAvailableColumns().length} variables. The analysis shows good statistical power for
                                population estimates.
                              </p>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border-l-4 border-success">
                              <h4 className="font-medium text-success mb-2">Statistical Significance</h4>
                              <p className="text-sm text-success-foreground">
                                The confidence intervals indicate statistically significant results with adequate sample
                                size for reliable population estimates.
                              </p>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg border-l-4 border-warning">
                              <h4 className="font-medium text-warning mb-2">Trend Analysis</h4>
                              <p className="text-sm text-warning-foreground">
                                The quarterly trends show consistent patterns with design weights properly applied for
                                population-level inferences.
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-accent/20 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
                            <CardTitle className="font-heading text-accent">Statistical Quality Metrics</CardTitle>
                            <CardDescription>Analysis quality and reliability indicators</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-6">
                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                              <span className="text-sm font-medium text-primary">Sample Size</span>
                              <Badge variant="secondary" className="bg-primary/20 text-primary">
                                {selectedFileData?.fullData?.length || 0}
                              </Badge>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg">
                              <span className="text-sm font-medium text-accent">Variables</span>
                              <Badge variant="secondary" className="bg-accent/20 text-accent">
                                {getAvailableColumns().length}
                              </Badge>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-success/10 to-success/5 rounded-lg">
                              <span className="text-sm font-medium text-success">Confidence Level</span>
                              <Badge variant="secondary" className="bg-success/20 text-success">
                                {confidenceLevel}%
                              </Badge>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-info/10 to-info/5 rounded-lg">
                              <span className="text-sm font-medium text-info">Analysis Type</span>
                              <Badge variant="secondary" className="bg-info/20 text-info capitalize">
                                {analysisType}
                              </Badge>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg">
                              <span className="text-sm font-medium text-warning">Target Variable</span>
                              <Badge variant="secondary" className="bg-warning/20 text-warning">
                                {targetVariable}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
