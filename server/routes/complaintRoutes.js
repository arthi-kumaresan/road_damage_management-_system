const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignMaintenanceTeam,
  updatePriority,
  mergeDuplicates,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .post(protect, upload.array('images', 5), createComplaint)
  .get(protect, getComplaints);

router.route('/:id').get(protect, getComplaintById);

router
  .route('/:id/status')
  .put(protect, authorize('ADMIN'), updateComplaintStatus);

router
  .route('/:id/assign')
  .put(protect, authorize('ADMIN'), assignMaintenanceTeam);

router
  .route('/:id/priority')
  .put(protect, authorize('ADMIN'), updatePriority);

router
  .route('/:id/merge')
  .post(protect, authorize('ADMIN'), mergeDuplicates);

module.exports = router;
