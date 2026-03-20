import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { adminDb } from "../firebase-admin";

const router = Router();

// Get the current user's local profile
router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const auth = req.auth;
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = auth.userId;
    const userDoc = await adminDb.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      // Check if this is the first user in the system
      const usersSnapshot = await adminDb.collection("users").limit(1).get();
      const isFirstUser = usersSnapshot.empty;

      // Assign roles based on specific emails provided by the user
      let role = "user";
      if (auth.email === "cajsuthar@gmail.com") {
        role = "admin";
      } else if (auth.email === "jitender.kingofcage.suthar@gmail.com") {
        role = "team_member";
      } else if (isFirstUser) {
        role = "admin";
      }

      const newUser: any = {
        id: userId,
        email: auth.email || null,
        firstName: "User",
        lastName: "",
        role: role,
        status: "active",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await adminDb.collection("users").doc(userId).set(newUser);
      console.log(`Auto-synced user: ${userId} (role: ${newUser.role}, email: ${newUser.email})`);
      return res.json({ user: newUser });
    }

    const userData = userDoc.data()!;
    const user: any = { id: userDoc.id, ...userData };

    // If user has an assigned CA, fetch CA details
    if (user.assignedCaId) {
      const caDoc = await adminDb.collection("users").doc(user.assignedCaId).get();
      if (caDoc.exists) {
        const caData = caDoc.data()!;
        user.assignedCaName = `${caData.firstName} ${caData.lastName}`;
        user.assignedCaEmail = caData.email;
      }
    }

    return res.json({ user });
  } catch (error) {
    console.error("Error in /auth/me:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Sync user data from client
router.post("/sync", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const auth = req.auth;
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = auth.userId;
    const { email, firstName, lastName, phoneNumber } = req.body;

    const userRef = adminDb.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const currentData = userDoc.data()!;
      const updatedData = {
        ...currentData,
        email: email || currentData.email,
        firstName: firstName || currentData.firstName,
        lastName: lastName || currentData.lastName,
        phoneNumber: phoneNumber || currentData.phoneNumber,
        updatedAt: new Date(),
      };
      await userRef.update(updatedData);
      return res.json({ message: "User synced", user: { id: userId, ...updatedData } });
    }

    // Create new user if not exists
    const newUser = {
      id: userId,
      email: email || auth.email || null,
      firstName: firstName || "User",
      lastName: lastName || "",
      phoneNumber: phoneNumber || null,
      role: "user",
      status: "active",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await userRef.set(newUser);
    return res.status(201).json({ 
      message: "Sync successful",
      user: newUser 
    });
  } catch (error: any) {
    console.error("Error in /auth/sync:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Temporary endpoint to set specific user roles (should be removed after use)
router.post("/setup-roles", async (_req, res) => {
  try {
    const rolesToSet = [
      { email: "cajsuthar@gmail.com", role: "admin" },
      { email: "jitender.kingofcage.suthar@gmail.com", role: "team_member" }
    ];

    const results = [];
    for (const item of rolesToSet) {
      const snapshot = await adminDb.collection("users")
        .where("email", "==", item.email)
        .get();

      if (snapshot.empty) {
        results.push({ email: item.email, status: "not_found" });
        continue;
      }

      const doc = snapshot.docs[0];
      await doc.ref.update({ role: item.role });
      results.push({ email: item.email, status: "updated", role: item.role });
    }

    return res.json({ success: true, results });
  } catch (error: any) {
    console.error("Error in /setup-roles:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
