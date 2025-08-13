"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  BarChart3,
  Home,
  Database,
  TrendingUp,
  FileOutput,
  Settings,
  FileText,
  Download,
  Eye,
  Printer,
  Share,
  Calendar,
  User,
} from "lucide-react"
import Link from "next/link"

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: "statistical" | "analytical" | "summary" | "technical"
  format: "pdf" | "html" | "both"
  sections: string[]
}

interface GeneratedReport {
  id: string
  title: string
  template: string
  generatedAt: string
  status: "generating" | "completed" | "failed"
  formats: ("pdf" | "html")[]
  size: string
}

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("statistical-summary")
  const [reportTitle, setReportTitle] = useState("Quarterly Survey Analysis Report")
  const [reportAuthor, setReportAuthor] = useState("StatSense AI Analytics Team")
  const [reportPeriod, setReportPeriod] = useState("Q4 2023")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "executive-summary",
    "methodology",
    "key-findings",
    "statistical-tables",
    "visualizations",
    "conclusions",
  ])

  const reportTemplates: ReportTemplate[] = [
    {
      id: "statistical-summary",
      name: "Statistical Summary Report",
      description: "Comprehensive statistical analysis with key findings and population estimates",
      type: "statistical",
      format: "both",
      sections: [
        "Executive Summary",
        "Methodology",
        "Key Findings",
        "Statistical Tables",
        "Confidence Intervals",
        "Conclusions",
      ],
    },
    {
      id: "analytical-brief",
      name: "Analytical Brief",
      description: "Concise analysis focusing on trends and insights",
      type: "analytical",
      format: "pdf",
      sections: ["Executive Summary", "Key Insights", "Trend Analysis", "Recommendations"],
    },
    {
      id: "technical-report",
      name: "Technical Report",
      description: "Detailed technical documentation with methodology and validation",
      type: "technical",
      format: "both",
      sections: ["Introduction", "Data Sources", "Methodology", "Quality Assessment", "Results", "Technical Appendix"],
    },
    {
      id: "dashboard-summary",
      name: "Dashboard Summary",
      description: "Visual dashboard-style report with charts and key metrics",
      type: "summary",
      format: "html",
      sections: ["Key Metrics", "Visualizations", "Trend Charts", "Distribution Analysis"],
    },
  ]

  const [generatedReports] = useState<GeneratedReport[]>([
    {
      id: "1",
      title: "Q3 2023 Household Survey Analysis",
      template: "Statistical Summary Report",
      generatedAt: "2023-12-15T10:30:00Z",
      status: "completed",
      formats: ["pdf", "html"],
      size: "2.4 MB",
    },
    {
      id: "2",
      title: "Employment Trends Analysis",
      template: "Analytical Brief",
      generatedAt: "2023-12-10T14:20:00Z",
      status: "completed",
      formats: ["pdf"],
      size: "1.8 MB",
    },
  ])

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 300)
  }

  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const selectedTemplateData = reportTemplates.find((t) => t.id === selectedTemplate)

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
            <Link href="/analyze">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <TrendingUp className="w-4 h-4" />
                Analyze Trends
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <FileOutput className="w-4 h-4" />
              Generate Reports
            </Button>
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
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="font-heading font-bold text-2xl text-foreground mb-2">Generate Reports</h1>
              <p className="text-muted-foreground">
                Create standardized PDF/HTML reports for official statistical releases with automated formatting and
                professional templates.
              </p>
            </div>

            <Tabs defaultValue="create" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="create">Create Report</TabsTrigger>
                <TabsTrigger value="templates">Report Templates</TabsTrigger>
                <TabsTrigger value="history">Report History</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6">
                {/* Report Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Report Configuration</CardTitle>
                    <CardDescription>Configure your report settings and content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="report-title">Report Title</Label>
                        <Input
                          id="report-title"
                          value={reportTitle}
                          onChange={(e) => setReportTitle(e.target.value)}
                          placeholder="Enter report title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="report-period">Reporting Period</Label>
                        <Input
                          id="report-period"
                          value={reportPeriod}
                          onChange={(e) => setReportPeriod(e.target.value)}
                          placeholder="e.g., Q4 2023"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="report-author">Author/Organization</Label>
                      <Input
                        id="report-author"
                        value={reportAuthor}
                        onChange={(e) => setReportAuthor(e.target.value)}
                        placeholder="StatSense AI Analytics Team"
                      />
                    </div>

                    <div>
                      <Label htmlFor="template-select">Report Template</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedTemplateData && (
                        <p className="text-sm text-muted-foreground mt-1">{selectedTemplateData.description}</p>
                      )}
                    </div>

                    <div>
                      <Label>Report Sections</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {selectedTemplateData?.sections.map((section, index) => {
                          const sectionId = section.toLowerCase().replace(/\s+/g, "-")
                          return (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox
                                id={sectionId}
                                checked={selectedSections.includes(sectionId)}
                                onCheckedChange={() => toggleSection(sectionId)}
                              />
                              <Label htmlFor={sectionId} className="text-sm">
                                {section}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="executive-summary">Executive Summary</Label>
                      <Textarea
                        id="executive-summary"
                        placeholder="Enter a brief executive summary for your report..."
                        className="min-h-20"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Generation Progress */}
                {isGenerating && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading">Generating Report</CardTitle>
                      <CardDescription>Creating your standardized statistical report</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={generationProgress} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {Math.round(generationProgress)}% complete - Compiling statistical data and formatting report...
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Generate Button */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Button onClick={handleGenerateReport} disabled={isGenerating} className="gap-2">
                        {isGenerating ? (
                          <FileText className="w-4 h-4 animate-pulse" />
                        ) : (
                          <FileOutput className="w-4 h-4" />
                        )}
                        {isGenerating ? "Generating..." : "Generate Report"}
                      </Button>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <Eye className="w-4 h-4" />
                        Preview Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reportTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="font-heading text-lg">{template.name}</CardTitle>
                            <CardDescription className="mt-1">{template.description}</CardDescription>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {template.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Sections Included:</p>
                            <div className="flex flex-wrap gap-1">
                              {template.sections.map((section, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {section}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Format:</span>
                              <Badge variant="outline" className="text-xs uppercase">
                                {template.format}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedTemplate(template.id)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Use Template
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Generated Reports</CardTitle>
                    <CardDescription>View and download your previously generated reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedReports.map((report) => (
                        <div key={report.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <FileText className="w-5 h-5 text-primary mt-0.5" />
                              <div>
                                <h4 className="font-medium">{report.title}</h4>
                                <p className="text-sm text-muted-foreground">Template: {report.template}</p>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(report.generatedAt)}
                                  </span>
                                  <span>{report.size}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={report.status === "completed" ? "secondary" : "outline"}
                                className="capitalize"
                              >
                                {report.status}
                              </Badge>
                            </div>
                          </div>

                          {report.status === "completed" && (
                            <div className="flex items-center gap-2 pt-3 border-t">
                              {report.formats.includes("pdf") && (
                                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                                  <Download className="w-3 h-3" />
                                  PDF
                                </Button>
                              )}
                              {report.formats.includes("html") && (
                                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                                  <Eye className="w-3 h-3" />
                                  HTML
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="gap-1">
                                <Share className="w-3 h-3" />
                                Share
                              </Button>
                              <Button size="sm" variant="ghost" className="gap-1">
                                <Printer className="w-3 h-3" />
                                Print
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Report Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Total Reports</span>
                      </div>
                      <div className="text-2xl font-heading font-bold">12</div>
                      <p className="text-xs text-muted-foreground">Generated this month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Download className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Downloads</span>
                      </div>
                      <div className="text-2xl font-heading font-bold">47</div>
                      <p className="text-xs text-muted-foreground">Total downloads</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Most Used</span>
                      </div>
                      <div className="text-lg font-heading font-bold">Statistical Summary</div>
                      <p className="text-xs text-muted-foreground">Template preference</p>
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
