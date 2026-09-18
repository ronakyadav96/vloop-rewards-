import { Router } from 'express';
import { getActiveStreakConfig } from '../controllers/streakController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/config', requireAuth, getActiveStreakConfig);

export default router;

