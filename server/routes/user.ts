// User API Routes - User-facing functionality
import { Router, Response } from 'express';
import { adminDb } from '../firebase-admin';
import { requireAnyAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user dashboard data
router.get('/user/dashboard', requireAnyAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found in request' });
    }
    
    // Fetch statistics
    const returnsSnapshot = await adminDb.collection("tax_returns")
      .where("profileId", "==", user.id)
      .get();
    
    const docsSnapshot = await adminDb.collection("documents")
      .where("userId", "==", user.id)
      .get();
    
    // Fetch active services for this user
    const servicesSnapshot = await adminDb.collection("user_services")
      .where("userId", "==", user.id)
      .get();
    const activeServices = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Fetch recent activity (Mocked for now as we don't have an activity collection yet)
    const recentActivity = [
      { id: 1, action: "Logged in", timestamp: new Date(), type: "auth" },
      { id: 2, action: "Viewed dashboard", timestamp: new Date(), type: "view" }
    ];

    // Fetch tax returns
    const userReturns = returnsSnapshot.docs.slice(0, 5).map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
      success: true,
      stats: {
        totalReturns: returnsSnapshot.size,
        documentsUploaded: docsSnapshot.size,
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
router.get('/profile', requireAnyAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
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
router.put('/profile', requireAnyAuth, async (req: AuthRequest, res: Response) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const { firstName, lastName } = req.body;
    
    const userRef = adminDb.collection("users").doc(authUser.id);
    await userRef.update({
      firstName,
      lastName,
      updatedAt: new Date()
    });
    
    const updatedDoc = await userRef.get();
    const { password, ...safeUser } = { id: updatedDoc.id, ...updatedDoc.data() as any };
    
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

// Get all user services
router.get('/user-services', requireAnyAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const snapshot = await adminDb.collection("user_services")
      .where("userId", "==", user.id)
      .get();
    
    const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new user service (Activation)
router.post('/user-services', requireAnyAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { serviceId, serviceTitle, serviceCategory, paymentAmount, paymentStatus, status, metadata } = req.body;

    const newService = {
      userId: user.id,
      serviceId,
      serviceTitle,
      serviceCategory,
      paymentAmount,
      paymentStatus,
      status: status || 'pending',
      metadata: metadata || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await adminDb.collection("user_services").add(newService);
    
    res.json({
      success: true,
      message: 'Service activated successfully',
      id: docRef.id
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
