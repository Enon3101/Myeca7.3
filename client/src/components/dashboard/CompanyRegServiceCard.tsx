import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, ChevronRight, CheckCircle } from "lucide-react";
import { Link } from "wouter";

interface CompanyRegServiceCardProps {
  status: string;
  companyName?: string;
}

export function CompanyRegServiceCard({ status, companyName }: CompanyRegServiceCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden shadow-md hover:shadow-lg transition-all">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-b border-violet-100 dark:border-violet-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-violet-600" />
              Company Incorporation
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Startup Services</CardDescription>
          </div>
          <Badge className={`${
            status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
            'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
          }`}>
            {status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Proposed Company Name</p>
            <p className="font-semibold text-gray-900 dark:text-white">{companyName || "Name Approval Pending"}</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Verification of directors in progress
          </div>

          <Link href="/services/company-registration">
            <Button variant="outline" className="w-full border-violet-200 hover:bg-violet-50 dark:border-violet-800 dark:hover:bg-violet-900/20">
              Manage Application
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
