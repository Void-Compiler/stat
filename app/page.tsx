import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  BarChart3,
  FileOutput,
  Settings,
  Home,
  Database,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
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
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="font-heading font-bold text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
              Empower Your Insights with StatSense AI
            </h1>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
              Transform your data into actionable insights with our intuitive analysis tools. Streamline survey data
              processing with AI-enhanced automation.
            </p>
            <Link href="/upload">
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Zap className="w-5 h-5" />
                Start Analyzing Now!
              </Button>
            </Link>
          </div>

          {/* Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-lg text-primary">Upload Your Data</CardTitle>
                <CardDescription>
                  Import CSV/Excel survey files with automatic format detection and validation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-info">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mb-3">
                  <Database className="w-6 h-6 text-info" />
                </div>
                <CardTitle className="font-heading text-lg text-info">Clean and Validate</CardTitle>
                <CardDescription>
                  AI-powered data cleaning with outlier detection and intelligent rule validation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-accent">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-heading text-lg text-accent">Analyze Trends</CardTitle>
                <CardDescription>
                  Advanced statistical analysis with design weights and population estimates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-warning">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mb-3">
                  <FileOutput className="w-6 h-6 text-warning" />
                </div>
                <CardTitle className="font-heading text-lg text-warning">Generate Reports</CardTitle>
                <CardDescription>Automated PDF/HTML reports with standardized templates and insights</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <CardTitle className="font-heading text-sm font-medium text-primary">RECENT UPLOADS</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-primary">0</div>
                <p className="text-xs text-muted-foreground">No data uploaded yet</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-success" />
                  <CardTitle className="font-heading text-sm font-medium text-success">PROCESSING STATUS</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-success">Ready</div>
                <p className="text-xs text-muted-foreground">System ready for analysis</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <CardTitle className="font-heading text-sm font-medium text-accent">REPORTS GENERATED</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-accent">0</div>
                <p className="text-xs text-muted-foreground">No reports generated yet</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
