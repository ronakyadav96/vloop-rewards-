import { Router } from 'express';
import {
  claimDailyStreakReward,
  getDailyStreak,
  getDailyStreakHistory,
} from '../controllers/dailyStreakController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', getDailyStreak);
router.get('/status', getDailyStreak);
router.post('/claim', claimDailyStreakReward);
router.get('/history', getDailyStreakHistory);

export default router;

