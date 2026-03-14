import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  user?: any;
  auth?: { userId: string };
}

/**
 * Basic authentication middleware using Clerk
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  if (!auth || !auth.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

export const authenticateToken = requireAuth;

/**
 * Higher-order middleware for role-based access control
 */
export function requireRole(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const localUsers = await (db as any).select().from(users).where(eq(users.id, auth.userId));
      if (localUsers.length === 0) {
        return res.status(404).json({ error: "User profile not found in database. Please sign in again." });
      }
      
      const localUser = localUsers[0];
      if (!allowedRoles.includes(localUser.role)) {
        return res.status(403).json({ error: `Access denied. Required role(s): ${allowedRoles.join(', ')}.` });
      }
      
      (req as AuthRequest).user = localUser; 
      next();
    } catch (error) {
      console.error("Role verification failed:", error);
      return res.status(500).json({ error: "Role verification failed" });
    }
  };
}

// Role-specific middleware helpers
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole(['admin'])(req, res, next);
}

export function requireTeamMember(req: Request, res: Response, next: NextFunction) {
  return requireRole(['admin', 'team_member'])(req, res, next);
}

export function requireCA(req: Request, res: Response, next: NextFunction) {
  return requireRole(['admin', 'ca'])(req, res, next);
}

export function requireAnyAuth(req: Request, res: Response, next: NextFunction) {
  return requireRole(['admin', 'team_member', 'ca', 'user'])(req, res, next);
}