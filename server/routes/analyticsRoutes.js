const express = require('express');
const router = express.Router();
const {
  getAdminDashboardAnalytics,
  getRoadConditionScores,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('ADMIN'));
router.get('/dashboard', getAdminDashboardAnalytics);
router.get('/roads', getRoadConditionScores);

module.exports = router;
