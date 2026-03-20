import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

const ROUTE_RELATIONSHIPS: Record<string, string[]> = {
  '/': ['/calculators', '/services', '/auth/login', '/experts'],
  '/calculators': ['/calculators/income-tax', '/calculators/sip', '/calculators/hra', '/calculators/emi', '/calculators/hsn-finder'],
  '/services': ['/services/gst-registration', '/services/company-registration', '/services/itr-filing', '/experts'],
  '/auth/login': ['/auth/register', '/dashboard'],
  '/auth/register': ['/auth/login', '/dashboard'],
  '/dashboard': ['/profiles', '/documents', '/settings', '/experts', '/itr/form-selector'],
  '/itr': ['/itr/filing', '/itr/status-tracker', '/itr/form-selector'],
  '/itr/form-selector': ['/itr/form-recommender', '/itr/filing'],
  '/experts': ['/experts/ca-rahul-sharma', '/experts/ca-priya-nair'],
};

const preloadedRoutes = new Set<string>();

const preloadRoute = (path: string) => {
  if (preloadedRoutes.has(path)) return;
  
  const importMap: Record<string, () => Promise<unknown>> = {
    '/calculators': () => import('@/features/calculators/pages/index.page'),
    '/calculators/income-tax': () => import('@/features/calculators/pages/income-tax.page'),
    '/calculators/sip': () => import('@/features/calculators/pages/sip.page'),
    '/calculators/hra': () => import('@/features/calculators/pages/hra.page'),
    '/calculators/emi': () => import('@/features/calculators/pages/emi.page'),
    '/services': () => import('@/pages/services.page'),
    '/services/gst-registration': () => import('@/pages/services/gst-registration.page'),
    '/services/company-registration': () => import('@/pages/services/company-registration.page'),
    '/auth/login': () => import('@/pages/auth/login.page'),
    '/auth/register': () => import('@/pages/auth/register.page'),
    '/dashboard': () => import('@/pages/user-dashboard.page'),
    '/profiles': () => import('@/pages/profiles.page'),
    '/documents': () => import('@/pages/documents.page'),
    '/settings': () => import('@/pages/settings.page'),
    '/itr': () => import('@/features/itr/pages/filing.page'),
    '/itr/filing': () => import('@/features/itr/pages/filing.page'),
    '/itr/status-tracker': () => import('@/features/itr/pages/status-tracker.page'),
    '/itr/form-selector': () => import('@/features/itr/pages/form-selector.page'),
    '/itr/form-recommender': () => import('@/features/itr/pages/form-recommender.page'),
    '/experts': () => import('@/pages/experts/index.page'),
    '/experts/ca-rahul-sharma': () => import('@/pages/experts/profile.page'),
    '/experts/ca-priya-nair': () => import('@/pages/experts/profile.page'),
    '/calculators/hsn-finder': () => import('@/features/calculators/pages/hsn-finder.page'),
  };

  const loader = importMap[path];
  if (loader) {
    preloadedRoutes.add(path);
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => loader(), { timeout: 5000 });
    } else {
      setTimeout(() => loader(), 100);
    }
  }
};

export function useRoutePreload() {
  const [location] = useLocation();

  useEffect(() => {
    const relatedRoutes = ROUTE_RELATIONSHIPS[location] || [];
    
    const timer = setTimeout(() => {
      relatedRoutes.forEach(route => preloadRoute(route));
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  const preloadOnHover = useCallback((path: string) => {
    preloadRoute(path);
  }, []);

  return { preloadOnHover };
}

export default useRoutePreload;
