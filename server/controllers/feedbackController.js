const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');
const { createNotification } = require('../services/notificationService');

// @desc    Submit feedback on resolved repair
// @route   POST /api/feedback/:complaintId
// @access  Private (Citizen)
const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment, isSatisfied, reopenComplaint } = req.body;
    const complaint = await Complaint.findById(req.params.complaintId);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.citizen.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to review this complaint' });
    }

    const feedback = await Feedback.create({
      complaint: complaint._id,
      citizen: req.user._id,
      rating,
      comment: comment || '',
      isSatisfied: Boolean(isSatisfied),
      reopened: Boolean(reopenComplaint),
    });

    if (reopenComplaint) {
      complaint.status = 'REOPENED';
      complaint.reopenedAt = new Date();
      complaint.timeline.push({
        status: 'REOPENED',
        message: `Citizen reported unsatisfied repair: ${comment || 'Issue persists'}`,
        updatedBy: req.user._id,
      });
      await complaint.save();
    }

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback for a complaint
// @route   GET /api/feedback/:complaintId
// @access  Private
const getComplaintFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({
      complaint: req.params.complaintId,
    }).populate('citizen', 'name email');

    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

module.exports = { submitFeedback, getComplaintFeedback };
