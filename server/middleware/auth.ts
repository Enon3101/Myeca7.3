import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../firebase-admin";
import { findOrCreateUserProfile } from "../services/user-accounts";
import { safeError } from "../utils/error-response";
import { getCachedUser, setCachedUser } from "../utils/user-cache";

export { getCachedUser, setCachedUser } from "../utils/user-cache";

export interface AuthRequest extends Request {
  user?: any;
  auth?: {
    userId: string;
    email?: string;
  };
}

async function verifyToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return {
      userId: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error) {
    console.error("[AUTH] Token verification failed:", error);
    return null;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = await verifyToken(req);

  if (!auth) {
    return res.status(401).json({ error: "Authentication required" });
  }

  (req as AuthRequest).auth = auth;
  next();
}

export const authenticateToken = requireAuth;

export function requireRole(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const auth = await verifyToken(req);

    if (!auth) {
      return res.status(401).json({ error: "Authentication required" });
    }

    (req as AuthRequest).auth = auth;

    try {
      let localUser = getCachedUser(auth.userId);

      if (!localUser) {
        const userDoc = await findOrCreateUserProfile(auth);
        localUser = userDoc.exists ? userDoc.data() : null;

        if (localUser) {
          setCachedUser(auth.userId, localUser);
        }
      }

      if (!localUser || !allowedRoles.includes(localUser.role)) {
        console.warn(
          `[AUTH] Access denied for ${auth.email}: Required ${allowedRoles.join(", ")}, found ${localUser?.role}`,
        );
        return res
          .status(403)
          .json({ error: `Access denied. Required role(s): ${allowedRoles.join(", ")}.` });
      }

      (req as AuthRequest).user = { id: auth.userId, ...localUser };
      next();
    } catch (error) {
      return safeError(res, error, "Role verification failed");
    }
  };
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole(["admin"])(req, res, next);
}

export async function requireTeamMember(req: Request, res: Response, next: NextFunction) {
  return requireRole(["admin", "team_member"])(req, res, next);
}

export async function requireCA(req: Request, res: Response, next: NextFunction) {
  return requireRole(["admin", "ca"])(req, res, next);
}

export async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole(["superadmin", "admin"])(req, res, next);
}

export async function requireAnyAuth(req: Request, res: Response, next: NextFunction) {
  return requireRole(["superadmin", "admin", "team_member", "ca", "user"])(req, res, next);
}
