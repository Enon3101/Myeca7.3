import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users, FileText, Clock, CheckCircle, AlertCircle,
  TrendingUp, Search, Eye, Briefcase, LayoutDashboard,
  FolderOpen, ArrowRight, ChevronRight, Loader2
} from "lucide-react";
import { m } from "framer-motion";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

export default function CADashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  /* useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user)) {
      window.location.href = '/auth/login';
    }
  }, [isAuthenticated, authLoading, user]); */

  // Fetch CA stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/ca/stats"],
    enabled: isAuthenticated && (user?.role === 'ca' || user?.role === 'admin'),
  });

  // Fetch assigned clients
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/ca/clients"],
    enabled: isAuthenticated && (user?.role === 'ca' || user?.role === 'admin'),
  });

  const stats = (statsData as any)?.data || {
    totalClients: 0,
    totalFilings: 0,
    pendingFilings: 0,
    completedFilings: 0,
  };

  const clients = ((clientsData as any)?.data?.clients || []).filter((client: any) =>
    searchTerm === "" ||
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading CA Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header - Unified with User Dashboard aesthetic */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200/50">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/50 opacity-70"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white rounded-[22px] shadow-xl shadow-emerald-900/5 border border-emerald-50">
                  <Briefcase className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Expert CA Dashboard</h1>
                  <p className="text-slate-500 mt-1 font-medium text-lg">
                    Welcome back, <span className="text-emerald-600 font-bold">{user?.firstName || 'Expert'}</span>! Your client workspace is ready.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" className="rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-emerald-200 hover:text-emerald-700 transition-all font-bold">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    My Personal Portal
                  </Button>
                </Link>
              </div>
            </div>
          </m.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        {/* Stats Cards */}
        {/* Stats Cards - Using Refined StatCard style logic but custom here to match the grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 -mt-20">
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white/90 backdrop-blur-xl border border-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
              <CardContent className="p-7">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Users className="h-6 w-6" />
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-0 font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">Active</Badge>
                </div>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{stats.totalClients}</p>
                <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wide">Assigned Clients</p>
              </CardContent>
            </Card>
          </m.div>

          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/90 backdrop-blur-xl border border-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
              <CardContent className="p-7">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-0 font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">Done</Badge>
                </div>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{stats.completedFilings}</p>
                <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wide">Returns Filed</p>
              </CardContent>
            </Card>
          </m.div>

          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/90 backdrop-blur-xl border border-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
              <CardContent className="p-7">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                    <Clock className="h-6 w-6" />
                  </div>
                  <Badge className="bg-amber-50 text-amber-700 border-0 font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">Urgent</Badge>
                </div>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{stats.pendingFilings}</p>
                <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wide">Pending Filings</p>
              </CardContent>
            </Card>
          </m.div>

          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/90 backdrop-blur-xl border border-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
              <CardContent className="p-7">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-violet-50 rounded-2xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <Badge className="bg-violet-50 text-violet-700 border-0 font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">Total</Badge>
                </div>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{stats.totalFilings}</p>
                <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wide">Annual Projects</p>
              </CardContent>
            </Card>
          </m.div>
        </div>

        {/* Clients Table - Enhanced Tabs */}
        <Tabs defaultValue="clients" className="space-y-8">
          <TabsList className="inline-flex h-14 items-center justify-start bg-slate-100/50 p-1.5 rounded-[20px] border border-slate-200/50 gap-1">
            <TabsTrigger value="clients" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-[14px] px-8 h-full font-bold transition-all text-slate-500">
              <Users className="h-4 w-4 mr-2" />
              Active Clients
            </TabsTrigger>
            <TabsTrigger value="filings" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-[14px] px-8 h-full font-bold transition-all text-slate-500">
              <FileText className="h-4 w-4 mr-2" />
              Filing History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-6 outline-none">
            <Card className="bg-white border-none shadow-[0_8px_40px_rgba(0,0,0,0.03)] rounded-[32px] overflow-hidden">
              <CardHeader className="p-10 pb-6 border-b border-slate-50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Assigned Client Portfolios</CardTitle>
                    <CardDescription className="text-slate-500 font-medium text-[15px] mt-1">Manage and track documentation and filings for your assigned clients.</CardDescription>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Find client by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none font-medium"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {clientsLoading ? (
                  <div className="p-10 text-center">
                     <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
                     <p className="text-slate-500 font-medium">Loading your client portfolio...</p>
                  </div>
                ) : !clients || clients.length === 0 ? (
                  <div className="text-center py-20 px-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Assign Clients to Begin</h3>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium">
                      {searchTerm 
                        ? "We couldn't find any clients matching your search criteria." 
                        : "You don't have any clients assigned yet. Contact your administrator to get started."}
                    </p>
                  </div>
                ) : (
                  <div className="px-10 pb-10 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-100/50">
                          <TableHead className="py-6 px-4 text-slate-400 font-bold uppercase text-[11px] tracking-[0.1em]">Client Profile</TableHead>
                          <TableHead className="py-6 px-4 text-slate-400 font-bold uppercase text-[11px] tracking-[0.1em]">Communication</TableHead>
                          <TableHead className="py-6 px-4 text-slate-400 font-bold uppercase text-[11px] tracking-[0.1em] text-center">Portfolio Stats</TableHead>
                          <TableHead className="py-6 px-4 text-slate-400 font-bold uppercase text-[11px] tracking-[0.1em]">Operational Status</TableHead>
                          <TableHead className="py-6 px-4 text-slate-400 font-bold uppercase text-[11px] tracking-[0.1em] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.map((client: any) => (
                          <TableRow key={client.id} className="group hover:bg-slate-50/50 border-slate-50 transition-all duration-300">
                            <TableCell className="py-6 px-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[18px] bg-white shadow-sm flex items-center justify-center font-black text-blue-600 border border-slate-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                  {client.firstName?.[0]}{client.lastName?.[0]}
                                </div>
                                <div>
                                  <span className="block font-bold text-slate-900 text-[16px]">
                                    {client.firstName} {client.lastName}
                                  </span>
                                  <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter">Premium Client</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-6 px-4 font-semibold text-slate-500 text-[14px]">
                              {client.email || "No email available"}
                            </TableCell>
                            <TableCell className="py-6 px-4">
                               <div className="flex items-center justify-center gap-3">
                                  {client.filingCount > 0 && (
                                    <div className="flex flex-col items-center">
                                      <span className="text-xl font-black text-slate-900 leading-none">{client.filingCount}</span>
                                      <span className="text-[10px] font-bold text-emerald-600 uppercase mt-1">Filed</span>
                                    </div>
                                  )}
                                  {client.pendingCount > 0 && (
                                    <div className="flex flex-col items-center">
                                      <span className="text-xl font-black text-orange-600 leading-none">{client.pendingCount}</span>
                                      <span className="text-[10px] font-bold text-orange-400 uppercase mt-1">Pending</span>
                                    </div>
                                  )}
                                  {!client.filingCount && !client.pendingCount && (
                                    <span className="text-slate-300 text-[13px] font-bold">New Portfolio</span>
                                  )}
                               </div>
                            </TableCell>
                            <TableCell className="py-6 px-4">
                              <Badge className={cn(
                                "rounded-full px-4 py-1.5 text-[11px] font-extrabold shadow-sm tracking-wide",
                                client.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              )}>
                                {client.status?.toUpperCase() || 'ACTIVE'}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-6 px-4">
                              <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                <Link href={`/ca/clients/${client.id}/documents`}>
                                  <Button size="sm" variant="ghost" className="h-11 rounded-2xl hover:bg-white hover:text-blue-600 font-bold border border-transparent hover:border-slate-100 px-6">
                                    <FolderOpen className="h-4 w-4 mr-2" />
                                    Docs
                                  </Button>
                                </Link>
                                <Link href={`/ca/clients/${client.id}/filings`}>
                                  <Button size="sm" className="h-11 w-11 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-bold p-0 shadow-lg shadow-black/10">
                                    <ArrowRight className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filings" className="space-y-4">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">All Client Filings</CardTitle>
                <CardDescription className="dark:text-gray-400">Overview of all filings across your assigned clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Filing overview coming soon</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Use the "My Clients" tab to view individual client filings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
