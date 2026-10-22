const express = require('express');
const router = express.Router();
const {
  getMyTasks,
  updateRepairProgress,
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/tasks', protect, authorize('MAINTENANCE_TEAM', 'ADMIN'), getMyTasks);

router.post(
  '/tasks/:id/repair',
  protect,
  authorize('MAINTENANCE_TEAM', 'ADMIN'),
  upload.fields([
    { name: 'beforeRepairImage', maxCount: 1 },
    { name: 'afterRepairImage', maxCount: 1 },
  ]),
  updateRepairProgress
);

module.exports = router;
