import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusChip } from "@/components/ui/status-chip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Upload,
  Calculator,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Receipt,
  PiggyBank,
  Calendar,
  HelpCircle,
  ArrowRight,
  Download,
  Star,
  Zap,
  Target,
  Sparkles,
  LayoutDashboard,
  Bell,
  ChevronRight,
  Wallet,
  Mail,
  Phone,
  ShieldAlert,
  RefreshCw,
  Plus
} from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CalculatorChart } from "@/components/ui/calculator-chart";
import { m, AnimatePresence } from "framer-motion";
import { ServiceUploader } from "@/components/dashboard/ServiceUploader";
import { ITRServiceCard } from "@/components/dashboard/ITRServiceCard";
import { GSTServiceCard } from "@/components/dashboard/GSTServiceCard";
import { CompanyRegServiceCard } from "@/components/dashboard/CompanyRegServiceCard";

export default function UserDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  // Redirect if admin
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === 'admin') {
      window.location.href = '/admin/dashboard';
    }
  }, [user, authLoading, isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, authLoading]);

  // Fetch user dashboard data
  const { data: dashboardData, isLoading, isError, error } = useQuery({
    queryKey: ["/api/user/dashboard"],
    enabled: isAuthenticated,
  });

  const stats = (dashboardData as any)?.stats || {
    totalReturns: 0,
    documentsUploaded: 0,
    pendingTasks: 0,
    savedAmount: 0,
  };
  const recentActivity = (dashboardData as any)?.recentActivity || [];
  const taxReturns = (dashboardData as any)?.taxReturns || [];
  const apiActiveServices = (dashboardData as any)?.activeServices || [];
  const [mockServices, setMockServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mye_active_services') || "[]");
    setMockServices(saved);
  }, [dashboardData]); // Refresh when dashboard data changes

  const activeServices = [...apiActiveServices, ...mockServices];


  if (isError) {
    const is401 = error instanceof Error && error.message.includes('401');
    
    // Instead of blocking the whole page, let's log the error and show a less intrusive message if it's not a severe error
    // For now, we'll keep a friendlier error state that doesn't force a login redirect if possible
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="rounded-card border-0 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-500/10">
              <div className="h-full bg-amber-500 w-1/3" />
            </div>
            
            <CardContent className="p-10 text-center space-y-8">
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-sm ring-4 ring-amber-50/50">
                <AlertCircle className="h-10 w-10" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {is401 ? "Session Refresh Required" : "Connection Issue"}
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {is401 
                    ? "Your session needs a quick refresh. We've unlocked the cockpit for you, but some data might need a moment to sync."
                    : "We're having trouble reaching the flight tower. Would you like to try reconnecting?"}
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 font-mono text-sm text-slate-600 break-words">
                <div className="flex items-center justify-center gap-2 mb-1 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <ShieldAlert className="w-3 h-3" />
                  Technical Details
                </div>
                {error instanceof Error ? error.message : JSON.stringify(error)}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="primary"
                  size="xl"
                  className="w-full text-white shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Refresh Session
                </Button>
                <Link href="/" className="w-full">
                  <Button 
                    variant="outline"
                    size="xl"
                    className="w-full border-2 border-slate-200 hover:bg-slate-50 text-slate-700 transition-all"
                  >
                    Go Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </m.div>
      </div>
    );
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Loading Dashboard
            </CardTitle>
            <CardDescription>Fetching your latest data…</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-56" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.firstName || 'User'}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Here's what's happening with your finances
                  </p>
                </div>
              </div>
            </m.div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative dark:border-gray-700 dark:text-gray-300">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Link href="/itr/form-selector">
                <Button variant="brand" className="shadow-lg shadow-brand-500/25">
                  <Zap className="mr-2 h-4 w-4" />
                  File New Return
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-10">
          {/* Modern Animated TabsList */}
          <div className="flex justify-center -mt-2 mb-10">
            <m.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl"
            >
              <TabsList className="relative h-14 p-1.5 bg-slate-50 backdrop-blur-xl border border-slate-200 rounded-card shadow-sm flex items-center gap-1 px-2">
                {[
                  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                  { id: 'returns', icon: FileText, label: 'Returns' },
                  { id: 'services', icon: Star, label: 'Services' },
                  { id: 'activity', icon: Clock, label: 'Activity' }
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      "relative flex-1 h-11 rounded-[22px] text-sm font-bold transition-all duration-300 border-0 shadow-none z-10",
                      "data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {activeTab === tab.id && (
                      <m.div
                        layoutId="active-tab-indicator"
                        className="absolute inset-0 bg-white rounded-[22px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] z-[-1]"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <tab.icon className={cn("w-4 h-4 transition-transform duration-300", activeTab === tab.id && "scale-110")} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </m.div>
          </div>

          <TabsContent value="overview" className="space-y-10 mt-0 focus-visible:outline-none focus-visible:ring-0">
            {/* Enhanced Stats Cards - Compact & Refined */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { 
                  label: 'Returns Filed', 
                  value: stats.totalReturns, 
                  icon: FileText, 
                  color: 'blue', 
                  badge: 'All Time' 
                },
                { 
                  label: 'Documents', 
                  value: stats.documentsUploaded, 
                  icon: Upload, 
                  color: 'emerald', 
                  badge: 'Secure' 
                },
                { 
                  label: 'Pending Tasks', 
                  value: stats.pendingTasks, 
                  icon: Clock, 
                  color: 'amber', 
                  badge: 'Action' 
                },
                { 
                  label: 'Tax Saved', 
                  value: `₹${(stats.savedAmount || 0).toLocaleString()}`, 
                  icon: Wallet, 
                  color: 'violet', 
                  badge: 'Saved' 
                }
              ].map((item, idx) => (
                <m.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Card className={cn(
                    "relative overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md h-full",
                    item.color === 'blue' && "bg-blue-500/10 border-blue-200/50",
                    item.color === 'emerald' && "bg-emerald-500/10 border-emerald-200/50",
                    item.color === 'amber' && "bg-amber-500/10 border-amber-200/50",
                    item.color === 'violet' && "bg-violet-500/10 border-violet-200/50"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={cn(
                          "p-1.5 rounded-lg",
                          item.color === 'blue' && "bg-blue-500/20 text-blue-600",
                          item.color === 'emerald' && "bg-emerald-500/20 text-emerald-600",
                          item.color === 'amber' && "bg-amber-500/20 text-amber-600",
                          item.color === 'violet' && "bg-violet-500/20 text-violet-600"
                        )}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <Badge className={cn(
                          "text-[9px] uppercase tracking-tighter px-1.5 py-0 h-4 border-0 font-bold",
                          item.color === 'blue' && "bg-blue-500/20 text-blue-700",
                          item.color === 'emerald' && "bg-emerald-500/20 text-emerald-700",
                          item.color === 'amber' && "bg-amber-500/20 text-amber-700",
                          item.color === 'violet' && "bg-violet-500/20 text-violet-700"
                        )}>{item.badge}</Badge>
                      </div>
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-xl font-black tracking-tight leading-none",
                          "text-slate-900 dark:text-white"
                        )}>{item.value}</span>
                        <span className={cn(
                          "text-[10px] uppercase font-bold tracking-wider mt-1.5",
                          item.color === 'blue' && "text-brand-600/70",
                          item.color === 'emerald' && "text-emerald-600/70",
                          item.color === 'amber' && "text-amber-600/70",
                          item.color === 'violet' && "text-violet-600/70"
                        )}>{item.label}</span>
                      </div>
                    </CardContent>
                  </Card>
                </m.div>
              ))}

              {/* Add New Service Card - Compact Top Row - Highlighted */}
              <Link href="/services/selection">
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                  }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="h-full"
                >
                  <Card className="h-full relative overflow-hidden border-2 border-blue-200 bg-white hover:bg-blue-50 transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer border-dashed">
                    {/* Pulsing Glow Effect */}
                    <div className="absolute inset-0 bg-blue-400/10 animate-pulse pointer-events-none" />
                    
                    <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center relative z-10">
                      <div className="p-2 rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-500/30 mb-2 group-hover:scale-110 transition-all duration-300">
                        <Plus className="h-5 w-5" />
                      </div>
                      <span className="text-[9px] uppercase font-black tracking-widest text-brand-600 dark:text-brand-400 leading-none mb-1">Add New</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-none">Service</span>
                    </CardContent>
                  </Card>
                </m.div>
              </Link>
            </div>

            {/* Dynamic Active Services Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Active Service Hub
                </h2>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  {activeServices.length} Active
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeServices.map((service: any) => (
                  <m.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {service.serviceType === 'ITR' && (
                      <ITRServiceCard 
                        status={service.status} 
                        progress={60} 
                        assessmentYear="2025-26" 
                        dueDate="July 31, 2025" 
                      />
                    )}
                    {service.serviceType === 'GST_REGISTRATION' && (
                      <GSTServiceCard status={service.status} />
                    )}
                    {service.serviceType === 'COMPANY_REG' && (
                      <CompanyRegServiceCard status={service.status} />
                    )}
                    {!['ITR', 'GST_REGISTRATION', 'COMPANY_REG'].includes(service.serviceType) && (
                      <Card className="group relative overflow-hidden bg-white border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-card">
                        <CardHeader className="pt-8 pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 transition-all duration-500 group-hover:scale-110 shadow-sm">
                              <Sparkles className="h-6 w-6" />
                            </div>
                            <Badge className="rounded-full px-3 py-1 h-7 border-0 font-bold text-[10px] uppercase tracking-wider bg-purple-500/15 text-purple-700">New</Badge>
                          </div>
                          <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">{service.title || "Selected Service"}</CardTitle>
                          <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">Recently added to your personalized dashboard hub</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8">
                          <Button className="w-full h-12 rounded-xl bg-white text-slate-900 border-2 border-slate-100 hover:border-purple-200 hover:bg-slate-50 font-bold transition-all duration-300 gap-2">
                            View Details
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-purple-600" />
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </m.div>
                ))}

              </div>
            </div>

            {/* Static Content and Marketplace (Moved down as suggestions) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <m.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="h-full"
              >
                <Card className="h-full rounded-card bg-white border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden">
                  <CardHeader className="bg-blue-500/5 dark:bg-blue-500/10 border-b border-blue-500/10 p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 shadow-sm">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Your Expert CA</CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Direct Professional Support</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8 pb-8">
                    {user?.assignedCaName ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-5 p-5 bg-white dark:bg-slate-800 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] rounded-3xl border border-slate-100 dark:border-slate-800 group transition-all duration-300 hover:border-blue-200">
                          <div className="relative">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                              {user.assignedCaName.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-800 rounded-full animate-pulse" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{user.assignedCaName}</p>
                            <p className="text-sm font-medium text-slate-500 tracking-wide">{user.assignedCaEmail || "Senior Account Lead"}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="h-14 rounded-2xl gap-2 border-slate-200 hover:bg-slate-50 group transition-all duration-300">
                            <Mail className="h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                            <span className="font-bold">Message</span>
                          </Button>
                          <Button className="h-14 rounded-2xl gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-xl shadow-slate-200/50 group">
                            <Phone className="h-5 w-5 group-hover:animate-bounce" />
                            <span className="font-bold">Call Now</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
                        <div className="mb-6 h-16 w-16 bg-white dark:bg-slate-800 rounded-3xl shadow-sm flex items-center justify-center mx-auto group">
                          <Star className="h-8 w-8 text-amber-500 group-hover:rotate-12 transition-transform" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2 text-center">Expert Help Available</h4>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 text-center px-4">
                          Get priority filing and tax advice from our top experts.
                        </p>
                        <Link href="/services">
                          <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/20 rounded-2xl text-lg font-bold">
                            Connect with a CA
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </m.div>

              {/* Quick Actions - Premium Modern Grid */}
              <m.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="h-full"
              >
                <Card className="h-full rounded-card bg-white border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden">
                  <CardHeader className="bg-amber-500/5 dark:bg-amber-500/10 border-b border-amber-500/10 p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 shadow-sm">
                        <Zap className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Quick Actions</CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Essential Utilities</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8 pb-8 grid grid-cols-2 gap-4">
                    {[
                      { href: '/itr/form-selector', icon: FileText, label: 'File ITR', color: 'blue' },
                      { href: '/tax-optimizer', icon: Target, label: 'Optimization', color: 'purple' },
                      { href: '/calculators/income-tax', icon: Calculator, label: 'Calculators', color: 'emerald' },
                      { href: '/documents', icon: Upload, label: 'Cloud Vault', color: 'amber' }
                    ].map((action, idx) => (
                      <Link href={action.href} key={action.label}>
                        <m.button 
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "w-full p-4 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm group",
                            action.color === 'blue' && "bg-blue-50/50 hover:bg-blue-50 border-blue-100 hover:border-blue-400",
                            action.color === 'purple' && "bg-purple-50/50 hover:bg-purple-50 border-purple-100 hover:border-purple-400",
                            action.color === 'emerald' && "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100 hover:border-emerald-400",
                            action.color === 'amber' && "bg-amber-50/50 hover:bg-amber-50 border-amber-100 hover:border-amber-400"
                          )}
                        >
                          <div className={cn(
                            "p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm transition-all duration-300 group-hover:scale-110",
                            action.color === 'blue' && "text-blue-600",
                            action.color === 'purple' && "text-purple-600",
                            action.color === 'emerald' && "text-emerald-600",
                            action.color === 'amber' && "text-amber-600"
                          )}>
                            <action.icon className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{action.label}</span>
                        </m.button>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </m.div>
            </div>

            {/* Service Marketplace - Premium Carousel-like Layout */}
            <Card className="rounded-card bg-slate-50 border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Service Marketplace</CardTitle>
                    <CardDescription className="text-sm font-bold uppercase tracking-widest text-slate-400 mt-1">Enhance your fiscal potential</CardDescription>
                  </div>
                  <div className="hidden sm:flex gap-2">
                    <Link href="/services">
                      <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50">View All Services <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'priority', title: 'Priority Filing', desc: 'Secure the fastest lane for your tax returns.', price: '999', icon: Star, color: 'amber' },
                    { id: 'expert', title: 'CA Consultation', desc: 'Personalized 1-on-1 strategy sessions.', price: '1,499', icon: HelpCircle, color: 'blue' },
                    { id: 'tools', title: 'Pro Analytics', desc: 'Advanced tax forecasting & wealth tools.', price: '499', icon: Calculator, color: 'emerald' }
                  ].map((service) => (
                    <m.div 
                      key={service.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="p-6 bg-white dark:bg-slate-800 rounded-card border border-slate-100 dark:border-slate-700 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 group"
                    >
                      <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-500 group-hover:rotate-6",
                        service.color === 'amber' && "bg-amber-50 text-amber-500",
                        service.color === 'blue' && "bg-blue-50 text-blue-500",
                        service.color === 'emerald' && "bg-emerald-50 text-emerald-500"
                      )}>
                        <service.icon className="h-7 w-7" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{service.title}</h4>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{service.desc}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">From</span>
                          <span className="text-xl font-black text-slate-900 dark:text-white">{"₹"}{service.price}</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-10 px-5 rounded-xl border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 font-bold transition-all duration-300">Select</Button>
                      </div>
                    </m.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks - Glassmorphic Attention Items */}
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="rounded-card bg-amber-50 border-amber-100 shadow-sm overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 shadow-sm">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Pending Tasks</CardTitle>
                      <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Items requiring your attention</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-4">
                  {[
                    { title: 'Upload Form 16', desc: 'Required for ITR filing', color: 'orange', action: 'Upload', link: '/documents' },
                    { title: 'Complete Profile', desc: 'Update your KYC details', color: 'blue', action: 'Update', link: '/profiles' },
                    { title: 'Review Proofs', desc: 'Verify 80C deductions', color: 'blue', action: 'Review', link: '/documents' }
                  ].map((task, idx) => (
                    <m.div 
                      key={task.title}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 group shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "mt-1 w-2 h-2 rounded-full",
                          task.color === 'orange' ? "bg-orange-500 animate-pulse" : "bg-blue-500"
                        )} />
                        <div>
                          <p className="font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">{task.title}</p>
                          <p className="text-xs font-medium text-slate-500">{task.desc}</p>
                        </div>
                      </div>
                      <Link href={task.link}>
                        <Button size="sm" className={cn(
                          "h-9 px-4 rounded-xl font-bold transition-all",
                          task.action === 'Upload' ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                        )}>
                          {task.action}
                        </Button>
                      </Link>
                    </m.div>
                  ))}
                </CardContent>
              </Card>
            </m.div>
          </TabsContent>

          <TabsContent value="returns" className="space-y-6">
            <Card className="rounded-card bg-white border-slate-200 overflow-hidden shadow-sm">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Tax Returns History</CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Secure record of your filings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="space-y-4">
                  {taxReturns.length > 0 ? (
                    taxReturns.map((taxReturn: any) => (
                      <m.div 
                        key={taxReturn.id}
                        whileHover={{ scale: 1.01, x: 5 }}
                        className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 group shadow-sm transition-all duration-300"
                      >
                        <div className="flex items-center gap-5">
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-colors">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">AY {taxReturn.assessmentYear}</p>
                            <p className="text-xs font-medium text-slate-500">Filed on {taxReturn.filedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <StatusChip status={taxReturn.status} size="sm" />
                          <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Download className="h-5 w-5 text-slate-600" />
                          </Button>
                        </div>
                      </m.div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                      <div className="h-20 w-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 group">
                        <FileText className="h-10 w-10 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">No Returns Yet</h4>
                      <p className="text-sm font-medium text-slate-500 mb-8 max-w-[240px] mx-auto">Your tax history will appear here once you file your returns.</p>
                      <Link href="/itr/form-selector">
                        <Button variant="brand" size="xl" className="shadow-xl shadow-brand-200">File Your First Return</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Receipt className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">GST Registration</CardTitle>
                  <CardDescription>Get your GSTIN in 3-5 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{"₹"}999</span>
                    <Link href="/services/gst-registration">
                      <Button size="sm">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Business Registration</CardTitle>
                  <CardDescription>Start your company today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{"₹"}7,999</span>
                    <Link href="/services/company-registration">
                      <Button size="sm">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Star className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle className="text-lg">Tax Planning</CardTitle>
                  <CardDescription>Optimize your tax savings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{"₹"}2,999</span>
                    <Link href="/services">
                      <Button size="sm">
                        Consult CA
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="rounded-card bg-white border-slate-200 overflow-hidden shadow-sm">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-100 text-slate-700 shadow-sm">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Your latest system interactions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="space-y-6">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity: any, index: number) => (
                      <m.div 
                        key={index} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-5 group"
                      >
                        <div className={cn(
                          "mt-1 p-3 rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-110",
                          activity.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                          activity.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        )}>
                          {activity.type === 'success' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : activity.type === 'warning' ? (
                            <AlertCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 pb-6 border-b border-slate-50 dark:border-slate-800 last:border-0">
                          <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1">{activity.title}</p>
                          <p className="text-sm font-medium text-slate-500 leading-relaxed mb-2">{activity.description}</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-slate-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{activity.time}</span>
                          </div>
                        </div>
                      </m.div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                      <div className="h-20 w-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 group">
                        <Clock className="h-10 w-10 text-slate-300 group-hover:rotate-45 transition-transform" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Clean Slate</h4>
                      <p className="text-sm font-medium text-slate-500 mb-2">No activity recorded in the last 30 days.</p>
                      <p className="text-xs text-slate-400 tracking-wide uppercase font-bold">Ready for launch</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Section - Enhanced */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Need Help?</h3>
                <p className="text-gray-600 dark:text-gray-400">Our expert CAs are here to assist you with any tax-related queries</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/help">
                <Button variant="outline" className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  Visit Help Center
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}