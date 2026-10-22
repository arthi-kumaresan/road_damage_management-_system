const Complaint = require('../models/Complaint');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const { createNotification } = require('../services/notificationService');

// @desc    Get assigned tasks for the logged in maintenance team
// @route   GET /api/maintenance/tasks
// @access  Private (Maintenance Team)
const getMyTasks = async (req, res, next) => {
  try {
    const team = await MaintenanceTeam.findOne({ teamLeader: req.user._id });
    if (!team) {
      return res.status(404).json({ message: 'No maintenance team linked to this account' });
    }

    const tasks = await Complaint.find({ assignedTeam: team._id })
      .populate('citizen', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ team, tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance task repair status and images
// @route   POST /api/maintenance/tasks/:id/repair
// @access  Private (Maintenance Team)
const updateRepairProgress = async (req, res, next) => {
  try {
    const { status, maintenanceRemarks } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Task/Complaint not found' });
    }

    if (maintenanceRemarks) {
      complaint.maintenanceRemarks = maintenanceRemarks;
    }

    // Process before/after images from files
    if (req.files) {
      if (req.files['beforeRepairImage'] && req.files['beforeRepairImage'][0]) {
        complaint.beforeRepairImage = `/uploads/${req.files['beforeRepairImage'][0].filename}`;
      }
      if (req.files['afterRepairImage'] && req.files['afterRepairImage'][0]) {
        complaint.afterRepairImage = `/uploads/${req.files['afterRepairImage'][0].filename}`;
      }
    }

    if (status) {
      complaint.status = status;
      if (status === 'WORK IN PROGRESS') complaint.startedAt = new Date();
      if (status === 'REPAIRED') complaint.repairedAt = new Date();

      complaint.timeline.push({
        status,
        message: `Maintenance update: ${maintenanceRemarks || status}`,
        updatedBy: req.user._id,
      });

      // Notify citizen of progress
      await createNotification(
        complaint.citizen,
        `Update on #${complaint.complaintId}: ${status}. ${maintenanceRemarks || ''}`,
        status === 'REPAIRED' ? 'REPAIRED' : 'IN_PROGRESS',
        complaint._id
      );
    }

    await complaint.save();
    res.json({ message: 'Repair record updated successfully', complaint });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyTasks, updateRepairProgress };
