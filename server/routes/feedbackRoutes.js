const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getComplaintFeedback,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router
  .route('/:complaintId')
  .post(protect, submitFeedback)
  .get(protect, getComplaintFeedback);

module.exports = router;
