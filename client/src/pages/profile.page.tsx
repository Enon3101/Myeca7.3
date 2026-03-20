import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { m } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Shield, 
  Settings, 
  LogOut, 
  ChevronRight, 
  LayoutDashboard,
  Bell,
  Zap,
  Star,
  Clock,
  Briefcase,
  FileText
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  // Fetch user dashboard data to show active services here too
  const { data: dashboardData } = useQuery({
    queryKey: ["/api/user/dashboard"],
  });

  const apiActiveServices = (dashboardData as any)?.activeServices || [];
  
  const getInitials = () => {
    if (!user) return 'U';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) return user.firstName[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Profile Overview */}
          <div className="lg:col-span-4 space-y-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-[32px] border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
                </div>
                <CardContent className="relative px-6 pb-8">
                  <div className="flex flex-col items-center -mt-16">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border-8 border-white shadow-xl flex items-center justify-center text-3xl font-black text-white">
                      {getInitials()}
                    </div>
                    <div className="mt-4 text-center">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className="text-slate-500 font-medium text-sm mt-1">{user?.email}</p>
                      
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0 font-bold px-3 py-1">
                          {user?.role?.toUpperCase() || 'USER'}
                        </Badge>
                        {user?.isVerified && (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 font-bold px-3 py-1 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-2">
                    <Link href="/settings">
                      <Button variant="ghost" className="w-full justify-between h-12 rounded-2xl hover:bg-slate-50 group">
                        <div className="flex items-center gap-3">
                          <Settings className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                          <span className="font-bold text-slate-700 group-hover:text-blue-600">Account Settings</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-between h-12 rounded-2xl hover:bg-slate-50 group">
                        <div className="flex items-center gap-3">
                          <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                          <span className="font-bold text-slate-700 group-hover:text-blue-600">Dashboard</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </Button>
                    </Link>
                    <Link href="/help">
                      <Button variant="ghost" className="w-full justify-between h-12 rounded-2xl hover:bg-slate-50 group">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                          <span className="font-bold text-slate-700 group-hover:text-blue-600">Notifications</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </Button>
                    </Link>
                    
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <Button 
                        onClick={() => logout()}
                        variant="ghost" 
                        className="w-full justify-between h-12 rounded-2xl hover:bg-red-50 text-red-600 group"
                      >
                        <div className="flex items-center gap-3">
                          <LogOut className="w-5 h-5 text-red-500" />
                          <span className="font-bold">Sign Out</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </m.div>

          </div>

          {/* Right Content: Detailed Info */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Personal Details */}
            <m.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="rounded-[32px] border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Personal Details</CardTitle>
                      <CardDescription className="text-slate-500 font-medium">Your account information as per records</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Full Name</label>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 font-black text-slate-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Email Address</label>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 font-black text-slate-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400 underline-offset-4" />
                        {user?.email}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Mobile Number</label>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 font-black text-slate-900 text-slate-400 italic">
                        Not Provided
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Member Since</label>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 font-black text-slate-900">
                        {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 h-12 font-black shadow-lg shadow-blue-200">
                      Edit Profile Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </m.div>

            {/* Active Services */}
            <m.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  Your Active Services
                </h2>
                <Badge variant="outline" className="rounded-full px-3 py-1 font-bold text-blue-600 border-blue-200">
                  {apiActiveServices.length} Records
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {apiActiveServices.length > 0 ? (
                  apiActiveServices.map((service: any) => (
                    <Card key={service.id} className="rounded-3xl border-slate-200/60 bg-white hover:shadow-lg transition-all duration-300 group overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <Badge className="bg-emerald-50 text-emerald-700 border-0 font-bold uppercase text-[9px] tracking-widest px-2 py-0.5">
                            {service.status?.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-6">
                        <h4 className="font-black text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                          {service.title || service.serviceType?.replace('_', ' ')}
                        </h4>
                        <p className="text-xs font-medium text-slate-500 mb-4">Registration & Filing Support</p>
                        <Button variant="outline" className="w-full rounded-xl border-slate-200 hover:bg-slate-50 font-bold flex items-center justify-between h-10 px-4">
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-full rounded-3xl border-dashed border-2 border-slate-200 bg-slate-50/50 p-10 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900">No active services yet</h4>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto font-medium leading-relaxed">
                      You haven't requested any taxation or startup services yet. Discover our marketplace to get started.
                    </p>
                    <Link href="/services">
                      <Button className="mt-6 rounded-2xl bg-blue-600 hover:bg-blue-700 px-10 h-12 font-black shadow-lg shadow-blue-200">
                        Browse Services
                      </Button>
                    </Link>
                  </Card>
                )}
              </div>
            </m.div>

          </div>
        </div>
      </div>
    </div>
  );
}
