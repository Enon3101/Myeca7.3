import { ReactNode, createContext, useContext, useState, useEffect } from "react";

// Types for Mock Auth
export type UserRole = 'user' | 'ca' | 'admin' | 'team_member';

interface MockAuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isSignedIn: boolean;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

// Define default users for each role
const MOCK_USERS = {
  user: { 
    id: "user_mock_1", 
    firstName: "Jane", 
    lastName: "Doe", 
    role: "user", 
    email: "jane@example.com",
    assignedCaName: "CA Ankit Sharma",
    assignedCaEmail: "ankit@myeca.in"
  },
  ca: { id: "ca_mock_1", firstName: "Expert", lastName: "CA", role: "ca", email: "ca@myeca.in" },
  admin: { id: "admin_mock_1", firstName: "System", lastName: "Admin", role: "admin", email: "admin@myeca.in" },
  team_member: { id: "team_mock_1", firstName: "Support", lastName: "Team", role: "team_member", email: "support@myeca.in" }
};

export function ClerkProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('mock_role') as UserRole) || 'user';
  });

  useEffect(() => {
    localStorage.setItem('mock_role', role);
    // Force reload on role change to ensure all components update
    // window.location.reload(); 
  }, [role]);

  return (
    <MockAuthContext.Provider value={{ role, setRole, isSignedIn: true }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(MockAuthContext);
  if (!context) return { isSignedIn: true, isLoaded: true, role: 'user' as UserRole };
  return { ...context, isLoaded: true };
}

export function useUser() {
  const context = useContext(MockAuthContext);
  const role = context?.role || 'user';
  return {
    isSignedIn: true,
    isLoaded: true,
    user: MOCK_USERS[role as keyof typeof MOCK_USERS],
  };
}

export function Show({ when, children }: { when: 'signed-in' | 'signed-out', children: ReactNode }) {
  const { isSignedIn } = useAuth();
  
  if (when === 'signed-in' && isSignedIn) {
    return <>{children}</>;
  }
  
  if (when === 'signed-out' && !isSignedIn) {
    return <>{children}</>;
  }
  
  return null;
}

export function SignInButton({ children, mode }: { children?: ReactNode, mode?: string }) {
  return <>{children || <button>Sign In</button>}</>;
}

export function SignUpButton({ children, mode }: { children?: ReactNode, mode?: string }) {
  return <>{children || <button>Sign Up</button>}</>;
}

export function UserButton() {
  const { user } = useUser();
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white">
        {user.firstName[0]}
      </div>
      <span className="text-xs font-medium">{user.firstName}</span>
    </div>
  );
}
