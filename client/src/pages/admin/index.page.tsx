// Admin Dashboard - Simple and Clean

import { Layout } from '@/components/admin/Layout';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStats } from '@/hooks/admin/useStats';
import { RefreshCw, Users, Coins, ShoppingBag, Activity, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/admin/utils';
import { Chart } from '@/components/admin/Chart';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { stats, isLoading, error, refetch } = useStats();

  if (error) {
    return (
      <Layout title="Dashboard">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Error loading dashboard</h3>
                <p className="text-sm text-red-700">{error.message || 'Failed to load data'}</p>
                <Button onClick={() => refetch()} variant="outline" className="mt-2" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header Actions - Premium Light aesthetic */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Panorama</h2>
            <p className="text-[15px] text-slate-500 mt-2 font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Real-time platform insights and operational monitoring
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Systems Live</span>
             </div>
            <Button 
              onClick={() => refetch()} 
              disabled={isLoading} 
              variant="outline"
              className="rounded-[18px] border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold h-12 px-6 transition-all"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Sync Data
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.revenue.total)}
            change={stats.revenue.growth_percent}
            icon={<Coins className="h-5 w-5" />}
          />
          <StatCard
            title="Total Users"
            value={formatNumber(stats.users.total)}
            change={stats.users.growth_percent}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Active Services"
            value={formatNumber(stats.services.active)}
            icon={<ShoppingBag className="h-5 w-5" />}
          />
          <StatCard
            title="Calculations"
            value={formatNumber(stats.calculations.total)}
            icon={<Activity className="h-5 w-5" />}
          />
        </div>

        {/* Revenue Chart and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-2">
            <Card className="h-full bg-white/40 backdrop-blur-xl border-none shadow-[0_8px_40px_rgba(0,0,0,0.02)] rounded-[32px] overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-700">
              <CardHeader className="p-10 pb-4 border-b border-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Financial Velocity</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Estimated monthly growth and revenue performance</CardDescription>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <Chart
                  title=""
                  type="area"
                  data={stats.recent_calculations?.map((item, index) => ({
                    name: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                    value: (item.count || 0) * 1250, // Updated multiplier for better visualization
                  })) || []}
                  height={320}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity - High End List */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-white border-none shadow-[0_8px_40px_rgba(0,0,0,0.02)] rounded-[32px] overflow-hidden flex flex-col group hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-700">
              <CardHeader className="p-10 pb-6 border-b border-slate-50">
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  Event Stream
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                {isLoading ? (
                  <div className="flex flex-col justify-center items-center h-64 gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-200" />
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Awaiting Pulse</p>
                  </div>
                ) : stats.recent_activity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-300">
                    <Activity className="h-12 w-12 mb-4 opacity-20" />
                    <p className="font-bold uppercase text-[10px] tracking-widest">No Activity Logged</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {stats.recent_activity.slice(0, 7).map((activity, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={activity.id} 
                        className="p-5 rounded-2xl hover:bg-slate-50 transition-all duration-300 flex items-start gap-4 border border-transparent hover:border-slate-100 group/item"
                      >
                        <div className="mt-1 h-10 w-10 rounded-[14px] bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-500">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-slate-800 leading-tight mb-1">{activity.action}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-tighter">{activity.user}</span>
                            <span className="text-[10px] font-medium text-slate-400">
                              {new Date(activity.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
              <div className="p-6 bg-slate-50/50 border-t border-slate-50">
                  <Button variant="ghost" className="w-full rounded-xl text-slate-500 font-bold hover:text-blue-600 group">
                    View Complete Audit Trail
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}

