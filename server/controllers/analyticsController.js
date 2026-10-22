const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { calculateRoadScores } = require('../services/roadScoreService');

// @desc    Admin Analytics summary dashboard
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
const getAdminDashboardAnalytics = async (req, res, next) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({
      status: { $in: ['SUBMITTED', 'UNDER REVIEW', 'VERIFIED'] },
    });
    const inProgressComplaints = await Complaint.countDocuments({
      status: { $in: ['ASSIGNED', 'WORK IN PROGRESS'] },
    });
    const completedComplaints = await Complaint.countDocuments({
      status: { $in: ['REPAIRED', 'COMPLETED'] },
    });
    const rejectedComplaints = await Complaint.countDocuments({
      status: 'REJECTED',
    });
    const reopenedComplaints = await Complaint.countDocuments({
      status: 'REOPENED',
    });
    const criticalComplaints = await Complaint.countDocuments({
      priority: 'CRITICAL',
    });
    const highPriorityComplaints = await Complaint.countDocuments({
      priority: 'HIGH',
    });

    // Damage type breakdown
    const damageTypeStats = await Complaint.aggregate([
      { $group: { _id: '$damageType', count: { $sum: 1 } } },
    ]);

    // Status breakdown
    const statusStats = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Severity breakdown
    const severityStats = await Complaint.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    // Area-wise breakdown
    const areaStats = await Complaint.aggregate([
      { $group: { _id: '$area', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Average resolution time in days
    const completedWithDates = await Complaint.find({
      completedAt: { $ne: null },
      submittedAt: { $ne: null },
    });

    let avgResolutionDays = 0;
    if (completedWithDates.length > 0) {
      const totalDays = completedWithDates.reduce((acc, c) => {
        const diff =
          (new Date(c.completedAt) - new Date(c.submittedAt)) /
          (1000 * 60 * 60 * 24);
        return acc + diff;
      }, 0);
      avgResolutionDays = (totalDays / completedWithDates.length).toFixed(1);
    }

    res.json({
      summary: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        completedComplaints,
        rejectedComplaints,
        reopenedComplaints,
        criticalComplaints,
        highPriorityComplaints,
        avgResolutionDays,
      },
      charts: {
        damageTypeStats,
        statusStats,
        severityStats,
        areaStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Road condition scores
// @route   GET /api/analytics/roads
// @access  Private (Admin)
const getRoadConditionScores = async (req, res, next) => {
  try {
    const scores = await calculateRoadScores();
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminDashboardAnalytics, getRoadConditionScores };
