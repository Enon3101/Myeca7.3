import { useAuth } from "@/components/AuthProvider";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
