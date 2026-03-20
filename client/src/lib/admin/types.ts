// Admin Dashboard TypeScript Types - Simple and Clean

import type { 
  User as SharedUser, 
  ChatSession, 
  ChatMessage, 
  BlogPost, 
  BlogCategory, 
  BlogTag,
  TaxReturn,
  Document
} from '@shared/schema';

// Re-export shared types for admin consumption
export type User = SharedUser;

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  status?: string;
  role?: string;
}

export type PaginationParams = FilterParams;

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DashboardStats {
  users: {
    total: number;
    caCount?: number;
    adminCount?: number;
    regularCount?: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    growthPercent: number;
  };
  calculations: {
    total: number;
    thisMonth: number;
    saved: number;
    trend: 'up' | 'down' | 'stable';
  };
  revenue: {
    total: number;
    pending?: number;
    thisMonth: number;
    growthPercent: number;
  };
  services: {
    total: number;
    active: number;
    popular: string[];
  };
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    database: string;
    uptime: number;
    lastCheck: string;
  };
  workList?: WorkItem[];
  recentActivity: Activity[];
  recentCalculations?: CalculationTrend[];
}

export interface WorkItem {
  id: string;
  type: 'service' | 'tax_return';
  title: string;
  userId: string;
  userName: string;
  assignedCaId?: string;
  assignedCaName?: string;
  status: string;
  price: number;
  createdAt: string;
}

export interface CalculationTrend {
  date: string;
  count: number;
}

export interface Activity {
  id: number;
  action: string;
  user: string;
  timestamp: string;
  resourceType: string;
  resourceId: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
