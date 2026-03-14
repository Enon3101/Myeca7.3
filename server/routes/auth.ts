import { Router, Request, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";

const router = Router();

// Get the current user's local profile
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = auth.userId;
    const localUsers = await (db as any).select().from(users).where(eq(users.id, userId));

    if (localUsers.length === 0) {
      // Auto-create user on first visit with default 'user' role
      // Special case: first user in the system gets admin role
      const allUsers = await (db as any).select().from(users);
      const isFirstUser = allUsers.length === 0;

      const newUser = await (db as any).insert(users).values({
        id: userId,
        email: null,
        firstName: "User",
        lastName: "",
        role: isFirstUser ? "admin" : "user",
        status: "active",
        isVerified: true,
      }).returning();

      console.log(`Auto-synced user: ${userId} (role: ${isFirstUser ? 'admin' : 'user'})`);
      return res.json({ user: newUser[0] });
    }

    // If user has an assigned CA, also return the CA's name
    const localUser = localUsers[0];
    if (localUser.assignedCaId) {
      const [assignedCA] = await (db as any)
        .select()
        .from(users)
        .where(eq(users.id, localUser.assignedCaId));

      if (assignedCA) {
        localUser.assignedCaName = `${assignedCA.firstName} ${assignedCA.lastName}`;
        localUser.assignedCaEmail = assignedCA.email;
      }
    }

    return res.json({ user: localUser });
  } catch (error) {
    console.error("Error in /auth/me:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Sync a new Clerk user to the local database
router.post("/sync", requireAuth, async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = auth.userId;
    const { email, firstName, lastName, phoneNumber } = req.body;

    // Check if user already exists
    const existingUsers = await (db as any).select().from(users).where(eq(users.id, userId));
    
    if (existingUsers.length > 0) {
      // User already synced — update email/name if changed
      const updated = await (db as any).update(users).set({
        email: email || existingUsers[0].email,
        firstName: firstName || existingUsers[0].firstName,
        lastName: lastName || existingUsers[0].lastName,
        updatedAt: new Date(),
      }).where(eq(users.id, userId)).returning();

      return res.json({ message: "User synced", user: updated[0] });
    }

    // Create the new user record — always default to 'user' role
    const newUser = await (db as any).insert(users).values({
      id: userId,
      email: email || null,
      firstName: firstName || "User",
      lastName: lastName || "",
      phoneNumber: phoneNumber || null,
      role: "user",
      status: "active",
      isVerified: true,
    }).returning();

    return res.status(201).json({ 
      message: "Sync successful",
      user: newUser[0] 
    });
  } catch (error: any) {
    console.error("Error in /auth/sync:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

export default router;
