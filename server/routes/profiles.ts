import { Router, Response } from "express";
import { z } from "zod";
import { insertProfileSchema } from "../../shared/schema";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { adminDb } from "../firebase-admin";

const router = Router();

// GET /api/profiles - list profiles for current user
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  const auth = req.auth;
  if (!auth?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const snapshot = await adminDb.collection("profiles")
      .where("userId", "==", auth.userId)
      .get();
    
    const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(profiles);
  } catch (error) {
    console.error("[PROFILES] Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
});

// POST /api/profiles - create a new profile for current user
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const auth = req.auth;
    if (!auth?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate body
    const data = insertProfileSchema.parse(req.body);

    const profileRef = adminDb.collection("profiles").doc();
    const newProfile = {
      ...data,
      userId: auth.userId,
      createdAt: new Date(),
    };

    await profileRef.set(newProfile);
    res.json({ id: profileRef.id, ...newProfile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("[PROFILES] Create error:", error);
    res.status(500).json({ error: "Failed to create profile" });
  }
});

// PATCH /api/profiles/:id - update an existing profile
router.patch("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const auth = req.auth;
    if (!auth?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const profileRef = adminDb.collection("profiles").doc(id);
    const doc = await profileRef.get();

    if (!doc.exists || doc.data()?.userId !== auth.userId) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const updateData = insertProfileSchema.partial().parse(req.body);
    await profileRef.update({
      ...updateData,
      updatedAt: new Date(),
    });

    const updatedDoc = await profileRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("[PROFILES] Update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;