// User API Routes - User-facing functionality
import { Router, Request, Response } from 'express';
import { db } from '../db';
import { users, taxReturns, documents, userServices } from '@shared/schema';
import { eq, count } from 'drizzle-orm';
import { requireAnyAuth } from '../middleware/auth';

const router = Router();

// Get user dashboard data
router.get('/user/dashboard', requireAnyAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const dbAny = db as any;
    
    // Fetch statistics
    const [returnsCount] = await dbAny.select({ value: count() }).from(taxReturns).where(eq(taxReturns.profileId, user.id as any));
    const [docsCount] = await dbAny.select({ value: count() }).from(documents).where(eq(documents.userId, user.id));
    
    // Fetch active services for this user
    const activeServices = await dbAny.select().from(userServices).where(eq(userServices.userId, user.id));
    
    // Fetch recent activity
    const recentActivity = [
      { id: 1, action: "Logged in", timestamp: new Date(), type: "auth" },
      { id: 2, action: "Viewed dashboard", timestamp: new Date(), type: "view" }
    ];

    // Fetch tax returns
    const userReturns = await dbAny.select().from(taxReturns).limit(5);

    res.json({
      success: true,
      stats: {
        totalReturns: returnsCount?.value || 0,
        documentsUploaded: docsCount?.value || 0,
        pendingTasks: 1,
        savedAmount: 0,
      },
      activeServices,
      recentActivity,
      taxReturns: userReturns
    });
  } catch (error: any) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data.',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/profile', requireAnyAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { password, ...safeUser } = user;
    
    res.json({
      success: true,
      data: { user: safeUser }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', requireAnyAuth, async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const { firstName, lastName } = req.body;
    
    const [updatedUser] = await db.update(users)
      .set({
        firstName,
        lastName,
        updatedAt: new Date()
      })
      .where(eq(users.id, authUser.id))
      .returning();
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { password, ...safeUser } = updatedUser;
    
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: safeUser }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message
    });
  }
});

export default router;
