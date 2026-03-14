import { Router, Request, Response } from "express";
import { requireAuth, requireCA, AuthRequest } from "../middleware/auth";
import { db } from "../db";
import { users, profiles, taxReturns, documents } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/express";

const router = Router();

// GET /api/ca/clients — List all users assigned to the logged-in CA
router.get("/clients", requireAuth, requireCA, async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const caId = auth.userId;

    // Get all users assigned to this CA
    const clients = await (db as any)
      .select()
      .from(users)
      .where(eq(users.assignedCaId, caId));

    // Get filing counts for each client
    const clientsWithStats = await Promise.all(
      clients.map(async (client: any) => {
        const clientProfiles = await (db as any)
          .select()
          .from(profiles)
          .where(eq(profiles.userId, client.id));

        let filingCount = 0;
        let pendingCount = 0;
        for (const profile of clientProfiles) {
          const filings = await (db as any)
            .select()
            .from(taxReturns)
            .where(eq(taxReturns.profileId, profile.id));
          filingCount += filings.length;
          pendingCount += filings.filter((f: any) => f.status === "draft" || f.status === "pending").length;
        }

        return {
          ...client,
          filingCount,
          pendingCount,
        };
      })
    );

    res.json({
      success: true,
      data: {
        clients: clientsWithStats,
        total: clientsWithStats.length,
      },
    });
  } catch (error: any) {
    console.error("Error fetching CA clients:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch clients" });
  }
});

// GET /api/ca/clients/:userId/documents — View assigned user's documents
router.get("/clients/:userId/documents", requireAuth, requireCA, async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const caId = auth.userId;
    const { userId } = req.params;

    // Verify this user is assigned to this CA
    const [client] = await (db as any)
      .select()
      .from(users)
      .where(and(eq(users.id, userId), eq(users.assignedCaId, caId)));

    if (!client) {
      return res.status(403).json({ error: "This client is not assigned to you." });
    }

    const clientDocs = await (db as any)
      .select()
      .from(documents)
      .where(eq(documents.userId, userId));

    res.json({
      success: true,
      data: { documents: clientDocs, client },
    });
  } catch (error: any) {
    console.error("Error fetching client documents:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch documents" });
  }
});

// GET /api/ca/clients/:userId/filings — View assigned user's tax returns
router.get("/clients/:userId/filings", requireAuth, requireCA, async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const caId = auth.userId;
    const { userId } = req.params;

    // Verify this user is assigned to this CA
    const [client] = await (db as any)
      .select()
      .from(users)
      .where(and(eq(users.id, userId), eq(users.assignedCaId, caId)));

    if (!client) {
      return res.status(403).json({ error: "This client is not assigned to you." });
    }

    // Get all profiles for this user
    const clientProfiles = await (db as any)
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    // Get all filings across profiles
    const filings: any[] = [];
    for (const profile of clientProfiles) {
      const profileFilings = await (db as any)
        .select()
        .from(taxReturns)
        .where(eq(taxReturns.profileId, profile.id));
      filings.push(
        ...profileFilings.map((f: any) => ({
          ...f,
          profileName: profile.name,
        }))
      );
    }

    res.json({
      success: true,
      data: { filings, client },
    });
  } catch (error: any) {
    console.error("Error fetching client filings:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch filings" });
  }
});

// GET /api/ca/stats — CA dashboard statistics
router.get("/stats", requireAuth, requireCA, async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const caId = auth.userId;

    const clients = await (db as any)
      .select()
      .from(users)
      .where(eq(users.assignedCaId, caId));

    let totalFilings = 0;
    let pendingFilings = 0;

    for (const client of clients) {
      const clientProfiles = await (db as any)
        .select()
        .from(profiles)
        .where(eq(profiles.userId, client.id));

      for (const profile of clientProfiles) {
        const filings = await (db as any)
          .select()
          .from(taxReturns)
          .where(eq(taxReturns.profileId, profile.id));
        totalFilings += filings.length;
        pendingFilings += filings.filter((f: any) => f.status === "draft" || f.status === "pending").length;
      }
    }

    res.json({
      success: true,
      data: {
        totalClients: clients.length,
        totalFilings,
        pendingFilings,
        completedFilings: totalFilings - pendingFilings,
      },
    });
  } catch (error: any) {
    console.error("Error fetching CA stats:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch stats" });
  }
});

export default router;
