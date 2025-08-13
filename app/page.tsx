import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, BarChart3, FileOutput, Settings, Home, Database, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
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
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              Empowering Data Insights for a Better Tomorrow
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Streamline your survey data processing with AI-enhanced automation for cleaning, analysis, and reporting.
            </p>
            <Link href="/upload">
              <Button size="lg" className="gap-2">
                <Upload className="w-4 h-4" />
                Start Your Analysis Today
              </Button>
            </Link>
          </div>

          {/* Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="font-heading text-lg">Upload Your Data</CardTitle>
                <CardDescription>Import CSV/Excel survey files with automatic format detection</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="font-heading text-lg">Clean and Validate</CardTitle>
                <CardDescription>AI-powered data cleaning with outlier detection and rule validation</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="font-heading text-lg">Analyze Trends</CardTitle>
                <CardDescription>Statistical analysis with design weights and population estimates</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <FileOutput className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="font-heading text-lg">Generate Reports</CardTitle>
                <CardDescription>Automated PDF/HTML reports with standardized templates</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-sm font-medium text-muted-foreground">RECENT UPLOADS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-heading font-bold">0</div>
                <p className="text-xs text-muted-foreground">No data uploaded yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-sm font-medium text-muted-foreground">
                  PROCESSING STATUS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-heading font-bold">Ready</div>
                <p className="text-xs text-muted-foreground">System ready for analysis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-sm font-medium text-muted-foreground">
                  REPORTS GENERATED
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-heading font-bold">0</div>
                <p className="text-xs text-muted-foreground">No reports generated yet</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
