import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth as useMockAuth } from "@/lib/clerk";
import { type User as AppUser } from "@shared/schema";

interface AuthContextType {
  user: AppUser | null;
  clerkUser: any | null; // Mock Clerk User object
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser } = useUser();
  const { role } = useMockAuth();
  
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clerkUser) {
      // Mock an AppUser based on the clerkUser role
      setAppUser({
        id: clerkUser.id,
        email: clerkUser.email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        role: clerkUser.role,
        status: 'active',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: null,
        assignedCaId: null,
        assignedCaName: (clerkUser as any).assignedCaName,
        assignedCaEmail: (clerkUser as any).assignedCaEmail,
        approvedBy: null,
        approvedAt: null,
        rejectedReason: null
      } as AppUser);
    } else {
      setAppUser(null);
    }
    setIsLoading(false);
  }, [clerkUser]);

  const isAuthenticated = true; // Always authenticated in mock mode

  return (
    <AuthContext.Provider
      value={{
        user: appUser,
        clerkUser,
        token: "mock_token",
        isLoading,
        isAuthenticated,
        logout: () => console.log("Mock logout"),
        role: clerkUser?.role || 'user'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

