import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
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
} from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CalculatorChart } from "@/components/ui/calculator-chart";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceUploader } from "@/components/dashboard/ServiceUploader";
import { ITRServiceCard } from "@/components/dashboard/ITRServiceCard";
import { GSTServiceCard } from "@/components/dashboard/GSTServiceCard";
import { CompanyRegServiceCard } from "@/components/dashboard/CompanyRegServiceCard";

export default function UserDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/auth/login';
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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mye_active_services') || "[]");
    setMockServices(saved);
  }, [dashboardData]); // Refresh when dashboard data changes

  const activeServices = [...apiActiveServices, ...mockServices];

  const getExpectedDocs = (serviceType: string) => {
    switch (serviceType) {
      case 'ITR':
        return [
          { id: 'form16', name: 'Form 16 / Salary Certificate', required: true },
          { id: 'bank_stmt', name: 'Bank Statement (12 Months)', required: true },
          { id: 'investment_proof', name: '80C Investment Proofs', required: false },
        ];
      case 'GST_REGISTRATION':
        return [
          { id: 'pan_card', name: 'PAN Card of Business', required: true },
          { id: 'aadhaar', name: 'Aadhaar of Promoter', required: true },
          { id: 'address_proof', name: 'Electricity Bill / Rent Agreement', required: true },
        ];
      case 'COMPANY_REG':
        return [
          { id: 'noc', name: 'NOC from Property Owner', required: true },
          { id: 'dir_pan', name: 'Director PAN Card', required: true },
          { id: 'dir_photo', name: 'Director Passport Photo', required: true },
        ];
      default:
        return [];
    }
  };

  if (isError) {
    const is401 = error instanceof Error && error.message.includes('401');
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="rounded-[32px] border-0 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500/10">
              <div className="h-full bg-red-500 w-1/3" />
            </div>
            
            <CardContent className="p-10 text-center space-y-8">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-sm ring-4 ring-red-50/50">
                <AlertCircle className="h-10 w-10" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {is401 ? "Session Expired" : "Connection Error"}
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {is401 
                    ? "Your authentication has expired for security reasons. Please try logging in again to access your financial cockpit."
                    : "We encountered a temporary hiccup while fetching your dashboard data. Let's try to get you back on track."}
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 font-mono text-sm text-slate-600 break-words">
                <div className="flex items-center justify-center gap-2 mb-1 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <ShieldAlert className="w-3 h-3" />
                  Technical Details
                </div>
                {error instanceof Error ? error.message : "401: {\"error\":\"Not authenticated\"}"}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  size="lg"
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Try Again
                </Button>
                <Link href="/auth/login" className="w-full">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full h-14 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-lg font-bold transition-all"
                  >
                    Go to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
            <motion.div
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
            </motion.div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative dark:border-gray-700 dark:text-gray-300">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Link href="/itr/form-selector">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
                  <Zap className="mr-2 h-4 w-4" />
                  File New Return
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dynamic Document Hub - ONLY FOR SELECTED SERVICES */}
        {activeServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Required Documents</h2>
                  <p className="text-slate-500 text-sm">Upload these to start your selected services</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-red-50 border-red-100 text-red-600 px-3 py-1 rounded-full">
                {activeServices.reduce((acc, s) => acc + getExpectedDocs(s.serviceType).length, 0)} Pending
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeServices.map((service) => (
                getExpectedDocs(service.serviceType).map((doc) => (
                  <div 
                    key={`${service.id}-${doc.id}`}
                    className="p-6 rounded-[24px] bg-white border border-slate-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <Upload className="h-5 w-5" />
                      </div>
                      <Badge className="bg-slate-100 text-slate-500 border-0 rounded-lg text-[10px] uppercase tracking-tighter">
                        {service.title?.split(' ')[0] || "Service"}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 tracking-tight">{doc.name}</h4>
                    <p className="text-xs text-slate-400 mb-5">Accepted formats: PDF, JPG, PNG</p>
                    <Button variant="outline" className="w-full rounded-xl border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 text-slate-600 hover:text-blue-600 font-bold group">
                      Upload Document
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                ))
              ))}
            </div>
          </motion.div>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <Badge className="bg-white/20 text-white border-0">All Time</Badge>
                </div>
                <p className="text-3xl font-bold">{stats.totalReturns}</p>
                <p className="text-blue-100 text-sm mt-1">Returns Filed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Upload className="h-5 w-5" />
                  </div>
                  <Badge className="bg-white/20 text-white border-0">Secure</Badge>
                </div>
                <p className="text-3xl font-bold">{stats.documentsUploaded}</p>
                <p className="text-emerald-100 text-sm mt-1">Documents Uploaded</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Clock className="h-5 w-5" />
                  </div>
                  <Badge className="bg-white/20 text-white border-0">Action</Badge>
                </div>
                <p className="text-3xl font-bold">{stats.pendingTasks}</p>
                <p className="text-amber-100 text-sm mt-1">Pending Tasks</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0 shadow-lg shadow-violet-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <Badge className="bg-white/20 text-white border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Saved
                  </Badge>
                </div>
                <p className="text-3xl font-bold">{"\u20B9"}{(stats.savedAmount || 0).toLocaleString()}</p>
                <p className="text-violet-100 text-sm mt-1">Tax Saved This Year</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400 rounded-lg">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="returns" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400 rounded-lg">
              <FileText className="h-4 w-4 mr-2" />
              Returns
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400 rounded-lg">
              <Star className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400 rounded-lg">
              <Clock className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                  <motion.div
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
                      <Card className="rounded-[24px] bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200/60 hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start mb-2">
                            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                              <Sparkles className="h-6 w-6" />
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 rounded-full">New</Badge>
                          </div>
                          <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">{service.title || "Selected Service"}</CardTitle>
                          <CardDescription className="text-slate-500">Recently added to your dashboard</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button size="sm" variant="outline" className="w-full h-11 rounded-xl border-slate-200 hover:bg-slate-50 font-bold text-slate-700">View Details</Button>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}

                {/* Always-visible Add Service Card */}
                <Link href="/services">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                  >
                    <Card className="h-full rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center py-10 group">
                      <div className="p-4 rounded-2xl bg-white shadow-sm mb-4 group-hover:bg-blue-50 group-hover:scale-110 transition-all">
                        <Zap className="h-8 w-8 text-slate-400 group-hover:text-blue-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Add New Service</h3>
                      <p className="text-sm text-slate-500">Explore more expert CA services</p>
                    </Card>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Static Content and Marketplace (Moved down as suggestions) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-[24px] bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200/60 transition-all duration-300 overflow-hidden">
                <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-800 p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Your Expert CA</CardTitle>
                      <CardDescription className="text-slate-500">Direct support from a qualified professional</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {user?.assignedCaName ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                          {user.assignedCaName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{user.assignedCaName}</p>
                          <p className="text-sm text-gray-500">{user.assignedCaEmail || "Contact person"}</p>
                        </div>
                        <Badge className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200">Online</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full h-10 gap-2 border-gray-200 dark:border-gray-700 dark:text-gray-300">
                          <Mail className="h-4 w-4" /> Message
                        </Button>
                        <Button className="w-full h-10 gap-2 bg-blue-600 hover:bg-blue-700">
                          <Phone className="h-4 w-4" /> Call
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800 inline-block">
                        <Star className="h-6 w-6 text-amber-500" />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Expert Help Available</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 px-4">
                        You don't have a dedicated CA assigned yet. Get priority filing and tax advice from our top experts.
                      </p>
                      <Link href="/services">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">
                          Connect with a CA
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions - Enhanced */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">Common tasks and services</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Link href="/itr/form-selector">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-700 dark:border-gray-700 dark:text-gray-300 transition-all">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>File ITR</span>
                    </Button>
                  </Link>
                  <Link href="/tax-optimizer">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20 dark:hover:border-purple-700 dark:border-gray-700 dark:text-gray-300 transition-all">
                      <Target className="h-5 w-5 text-purple-600" />
                      <span>Tax Optimizer</span>
                    </Button>
                  </Link>
                  <Link href="/calculators/income-tax">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20 dark:hover:border-green-700 dark:border-gray-700 dark:text-gray-300 transition-all">
                      <Calculator className="h-5 w-5 text-green-600" />
                      <span>Calculator</span>
                    </Button>
                  </Link>
                  <Link href="/documents">
                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:border-amber-700 dark:border-gray-700 dark:text-gray-300 transition-all">
                      <Upload className="h-5 w-5 text-amber-600" />
                      <span>Upload Docs</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Usage Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>Historical usage and activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <CalculatorChart
                  data={[
                    { year: "Jan", investment: 10, value: 20 },
                    { year: "Feb", investment: 15, value: 30 },
                    { year: "Mar", investment: 20, value: 25 },
                    { year: "Apr", investment: 18, value: 35 },
                    { year: "May", investment: 22, value: 40 },
                    { year: "Jun", investment: 28, value: 45 },
                  ]}
                  type="line"
                  title="Monthly Activity"
                  height={280}
                />
              </CardContent>
            </Card>

            {/* Service Marketplace */}
            <Card>
              <CardHeader>
                <CardTitle>Service Marketplace</CardTitle>
                <CardDescription>Upgrade and subscribe to premium services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg hover:shadow-sm transition">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Priority Filing</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Get faster processing with dedicated support.</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{"\u20B9"}999</span>
                      <Link href="/pricing">
                        <Button size="sm" variant="outline">Upgrade</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg hover:shadow-sm transition">
                    <div className="flex items-center gap-3 mb-2">
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Expert Consultation</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Talk to a CA for personalized tax advice.</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{"\u20B9"}1,499</span>
                      <Link href="/services">
                        <Button size="sm" variant="outline">Subscribe</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg hover:shadow-sm transition">
                    <div className="flex items-center gap-3 mb-2">
                      <Calculator className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Advanced Tools</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Access premium calculators and analytics.</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{"\u20B9"}499</span>
                      <Link href="/calculators">
                        <Button size="sm" variant="outline">Add</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Upload Form 16</p>
                      <p className="text-sm text-gray-500">Required for ITR filing</p>
                    </div>
                    <Link href="/documents">
                      <Button size="sm">Upload</Button>
                    </Link>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Complete Personal Details</p>
                      <p className="text-sm text-gray-500">Update your profile information</p>
                    </div>
                    <Link href="/profiles">
                      <Button size="sm">Update</Button>
                    </Link>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Review Investment Proofs</p>
                      <p className="text-sm text-gray-500">For 80C deductions</p>
                    </div>
                    <Link href="/documents">
                      <Button size="sm" variant="outline">Review</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="returns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Returns History</CardTitle>
                <CardDescription>Your filed returns and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxReturns.length > 0 ? (
                    taxReturns.map((taxReturn: any) => (
                      <div key={taxReturn.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">AY {taxReturn.assessmentYear}</p>
                            <p className="text-sm text-gray-500">Filed on {taxReturn.filedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <StatusChip status={taxReturn.status} size="sm" />
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No returns filed yet</p>
                      <Link href="/itr/form-selector">
                        <Button className="mt-4">File Your First Return</Button>
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
                    <span className="text-2xl font-bold">{"\u20B9"}999</span>
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
                    <span className="text-2xl font-bold">{"\u20B9"}7,999</span>
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
                    <span className="text-2xl font-bold">{"\u20B9"}2,999</span>
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
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-100' : 
                          activity.type === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                        }`}>
                          {activity.type === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : activity.type === 'warning' ? (
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No recent activity</p>
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