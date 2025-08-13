"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  const [selectedDataset, setSelectedDataset] = useState("survey_data_cleaned.csv")
  const [analysisType, setAnalysisType] = useState("descriptive")
  const [targetVariable, setTargetVariable] = useState("income")
  const [weightVariable, setWeightVariable] = useState("design_weight")
  const [confidenceLevel, setConfidenceLevel] = useState("95")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  // Mock statistical results
  const [statisticalResults] = useState<StatisticalResult[]>([
    {
      parameter: "Mean Income",
      estimate: 45250,
      marginOfError: 1850,
      confidenceInterval: [43400, 47100],
      sampleSize: 1847,
      weightedEstimate: 46100,
    },
    {
      parameter: "Median Age",
      estimate: 32.5,
      marginOfError: 1.2,
      confidenceInterval: [31.3, 33.7],
      sampleSize: 1847,
      weightedEstimate: 33.1,
    },
    {
      parameter: "Employment Rate",
      estimate: 0.742,
      marginOfError: 0.028,
      confidenceInterval: [0.714, 0.77],
      sampleSize: 1847,
      weightedEstimate: 0.756,
    },
  ])

  // Mock trend data
  const trendData: TrendData[] = [
    { period: "Q1 2023", value: 42500, weighted_value: 43200, confidence_lower: 41800, confidence_upper: 44600 },
    { period: "Q2 2023", value: 43800, weighted_value: 44500, confidence_lower: 43100, confidence_upper: 45900 },
    { period: "Q3 2023", value: 44200, weighted_value: 45100, confidence_lower: 43500, confidence_upper: 46700 },
    { period: "Q4 2023", value: 45250, weighted_value: 46100, confidence_lower: 44400, confidence_upper: 47800 },
  ]

  // Mock distribution data
  const distributionData = [
    { range: "0-20K", count: 245, percentage: 13.3, weighted_percentage: 12.8 },
    { range: "20-40K", count: 456, percentage: 24.7, weighted_percentage: 23.9 },
    { range: "40-60K", count: 523, percentage: 28.3, weighted_percentage: 29.1 },
    { range: "60-80K", count: 387, percentage: 21.0, weighted_percentage: 21.8 },
    { range: "80K+", count: 236, percentage: 12.8, weighted_percentage: 12.4 },
  ]

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"]

  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
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
            <Link href="/upload">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Upload className="w-4 h-4" />
                Upload Data
              </Button>
            </Link>
            <Link href="/clean">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Database className="w-4 h-4" />
                Clean & Validate
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <TrendingUp className="w-4 h-4" />
              Analyze Trends
            </Button>
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
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="font-heading font-bold text-2xl text-foreground mb-2">Statistical Analysis & Trends</h1>
              <p className="text-muted-foreground">
                Perform statistical analysis with design weights and generate population estimates with confidence
                intervals.
              </p>
            </div>

            {/* Analysis Configuration */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-heading">Analysis Configuration</CardTitle>
                <CardDescription>Configure your statistical analysis parameters and design weights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="dataset">Dataset</Label>
                    <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="survey_data_cleaned.csv">survey_data_cleaned.csv</SelectItem>
                        <SelectItem value="household_survey_cleaned.xlsx">household_survey_cleaned.xlsx</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="analysis-type">Analysis Type</Label>
                    <Select value={analysisType} onValueChange={setAnalysisType}>
                      <SelectTrigger>
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
                    <Label htmlFor="target-variable">Target Variable</Label>
                    <Select value={targetVariable} onValueChange={setTargetVariable}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="age">Age</SelectItem>
                        <SelectItem value="employment_status">Employment Status</SelectItem>
                        <SelectItem value="education_level">Education Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="confidence-level">Confidence Level</Label>
                    <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                      <SelectTrigger>
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
                    <Label htmlFor="use-weights">Apply Design Weights</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="weight-variable">Weight Variable:</Label>
                    <Select value={weightVariable} onValueChange={setWeightVariable}>
                      <SelectTrigger className="w-40">
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

                <Button onClick={handleStartAnalysis} disabled={isAnalyzing} className="gap-2">
                  {isAnalyzing ? <Calculator className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4" />}
                  {isAnalyzing ? "Analyzing..." : "Run Statistical Analysis"}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="font-heading">Processing Analysis</CardTitle>
                  <CardDescription>Computing statistical estimates with design weights</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={analysisProgress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(analysisProgress)}% complete - Calculating population parameters and confidence
                    intervals...
                  </p>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="estimates" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="estimates">Population Estimates</TabsTrigger>
                <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
                <TabsTrigger value="insights">Key Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="estimates" className="space-y-6">
                {/* Statistical Results */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {statisticalResults.map((result, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-primary" />
                          <CardTitle className="font-heading text-lg">{result.parameter}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Weighted Estimate</p>
                          <p className="text-2xl font-heading font-bold">
                            {result.parameter.includes("Income")
                              ? formatCurrency(result.weightedEstimate)
                              : result.parameter.includes("Rate")
                                ? `${(result.weightedEstimate * 100).toFixed(1)}%`
                                : formatNumber(result.weightedEstimate, 1)}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Margin of Error</p>
                            <p className="font-medium">
                              ±
                              {result.parameter.includes("Income")
                                ? formatCurrency(result.marginOfError)
                                : result.parameter.includes("Rate")
                                  ? `${(result.marginOfError * 100).toFixed(1)}%`
                                  : formatNumber(result.marginOfError, 1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Sample Size</p>
                            <p className="font-medium">{formatNumber(result.sampleSize)}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">{confidenceLevel}% Confidence Interval</p>
                          <p className="text-sm font-medium">
                            [
                            {result.parameter.includes("Income")
                              ? `${formatCurrency(result.confidenceInterval[0])} - ${formatCurrency(result.confidenceInterval[1])}`
                              : result.parameter.includes("Rate")
                                ? `${(result.confidenceInterval[0] * 100).toFixed(1)}% - ${(result.confidenceInterval[1] * 100).toFixed(1)}%`
                                : `${formatNumber(result.confidenceInterval[0], 1)} - ${formatNumber(result.confidenceInterval[1], 1)}`}
                            ]
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Trend Analysis - Income Over Time</CardTitle>
                    <CardDescription>
                      Quarterly trends with confidence intervals and design weights applied
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip
                            formatter={(value: number, name: string) => [
                              formatCurrency(value),
                              name === "weighted_value"
                                ? "Weighted Estimate"
                                : name === "confidence_lower"
                                  ? "Lower CI"
                                  : name === "confidence_upper"
                                    ? "Upper CI"
                                    : "Raw Estimate",
                            ]}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="weighted_value"
                            stroke="#8884d8"
                            strokeWidth={3}
                            name="Weighted Estimate"
                          />
                          <Line
                            type="monotone"
                            dataKey="confidence_lower"
                            stroke="#82ca9d"
                            strokeDasharray="5 5"
                            name="Lower CI"
                          />
                          <Line
                            type="monotone"
                            dataKey="confidence_upper"
                            stroke="#82ca9d"
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading">Income Distribution</CardTitle>
                      <CardDescription>Distribution by income ranges with design weights</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={distributionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="percentage" fill="#8884d8" name="Raw %" />
                            <Bar dataKey="weighted_percentage" fill="#82ca9d" name="Weighted %" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading">Weighted Distribution</CardTitle>
                      <CardDescription>Population-weighted income distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading">Key Statistical Insights</CardTitle>
                      <CardDescription>AI-generated insights from your analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium text-blue-900 mb-2">Population Income Estimate</h4>
                        <p className="text-sm text-blue-800">
                          The weighted population mean income is estimated at ₹46,100 with a 95% confidence interval of
                          ₹44,400 - ₹47,800, indicating a statistically significant increase from previous quarters.
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-medium text-green-900 mb-2">Employment Rate</h4>
                        <p className="text-sm text-green-800">
                          The employment rate shows a weighted estimate of 75.6% (±2.8%), suggesting stable employment
                          conditions across the surveyed population with proper design weight adjustments.
                        </p>
                      </div>

                      <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <h4 className="font-medium text-orange-900 mb-2">Demographic Trends</h4>
                        <p className="text-sm text-orange-800">
                          The median age of 33.1 years (weighted) indicates a relatively young population, with
                          implications for policy planning and resource allocation.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading">Statistical Quality Metrics</CardTitle>
                      <CardDescription>Analysis quality and reliability indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Design Effect</span>
                        <Badge variant="secondary">1.23</Badge>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Effective Sample Size</span>
                        <Badge variant="secondary">1,501</Badge>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Response Rate</span>
                        <Badge variant="secondary">87.3%</Badge>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Coefficient of Variation</span>
                        <Badge variant="secondary">4.1%</Badge>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Statistical Power</span>
                        <Badge variant="secondary">95.2%</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
