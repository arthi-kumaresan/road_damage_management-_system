const Complaint = require('../models/Complaint');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const { calculatePriority } = require('../services/priorityService');
const { detectDuplicates } = require('../services/duplicateService');
const { createNotification } = require('../services/notificationService');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
const createComplaint = async (req, res, next) => {
  try {
    const {
      roadName,
      area,
      description,
      damageType,
      severity,
      latitude,
      longitude,
    } = req.body;

    if (!roadName || !area || !description || !damageType || !severity) {
      return res.status(400).json({ message: 'Please provide all mandatory details' });
    }

    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one road photograph is required' });
    }

    // Generate unique complaint ID
    const count = await Complaint.countDocuments();
    const complaintId = `RPT-${new Date().getFullYear()}-${(count + 1)
      .toString()
      .padStart(4, '0')}`;

    // Auto priority calculation
    const { priorityScore, priority } = calculatePriority(severity, damageType);

    // Duplicate detection check
    const existingDuplicates = await detectDuplicates(roadName, area, damageType);
    const isDuplicate = existingDuplicates.length > 0;

    const complaint = await Complaint.create({
      complaintId,
      citizen: req.user._id,
      roadName,
      area,
      description,
      damageType,
      severity,
      priority,
      priorityScore,
      images,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      status: 'SUBMITTED',
      isDuplicate,
      timeline: [
        {
          status: 'SUBMITTED',
          message: 'Complaint submitted by citizen',
          updatedBy: req.user._id,
        },
      ],
    });

    // Notify citizen
    await createNotification(
      req.user._id,
      `Your complaint #${complaintId} for ${roadName} has been submitted successfully.`,
      'SUBMITTED',
      complaint._id
    );

    res.status(201).json({
      message: 'Complaint registered successfully',
      complaint,
      duplicateWarning: isDuplicate
        ? `Note: Found ${existingDuplicates.length} potential duplicate complaint(s) in this area.`
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (Filterable, Searchable, Paginatable)
// @route   GET /api/complaints
// @access  Private (Citizen sees own, Admin sees all, Maintenance sees assigned)
const getComplaints = async (req, res, next) => {
  try {
    const {
      status,
      severity,
      priority,
      damageType,
      area,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Role filtering
    if (req.user.role === 'CITIZEN') {
      query.citizen = req.user._id;
    } else if (req.user.role === 'MAINTENANCE_TEAM') {
      // Find team linked to this user
      const team = await MaintenanceTeam.findOne({ teamLeader: req.user._id });
      if (team) {
        query.assignedTeam = team._id;
      } else {
        return res.json({ complaints: [], totalPages: 0, currentPage: 1, total: 0 });
      }
    }

    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (priority) query.priority = priority;
    if (damageType) query.damageType = damageType;
    if (area) query.area = new RegExp(area, 'i');

    if (search) {
      query.$or = [
        { complaintId: new RegExp(search, 'i') },
        { roadName: new RegExp(search, 'i') },
        { area: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('citizen', 'name email phone')
      .populate('assignedTeam', 'teamName contactPhone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      complaints,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint details
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name email phone address')
      .populate('assignedTeam', 'teamName teamLeader contactPhone assignedArea')
      .populate('additionalReporters.user', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Role check for citizens
    if (
      req.user.role === 'CITIZEN' &&
      complaint.citizen._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized to view this complaint' });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status (Admin / Authority)
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin)
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, adminRemarks, rejectionReason } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    if (adminRemarks) complaint.adminRemarks = adminRemarks;
    if (rejectionReason) complaint.rejectionReason = rejectionReason;

    if (status === 'VERIFIED') complaint.verifiedAt = new Date();
    if (status === 'COMPLETED') complaint.completedAt = new Date();

    complaint.timeline.push({
      status,
      message:
        status === 'REJECTED'
          ? `Complaint rejected: ${rejectionReason || 'No reason provided'}`
          : `Status updated to ${status}. ${adminRemarks || ''}`,
      updatedBy: req.user._id,
    });

    await complaint.save();

    // Send notification
    await createNotification(
      complaint.citizen,
      `Your complaint #${complaint.complaintId} status changed to ${status}.`,
      status,
      complaint._id
    );

    res.json({ message: 'Complaint status updated', complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign Maintenance Team (Admin)
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
const assignMaintenanceTeam = async (req, res, next) => {
  try {
    const { teamId, priority } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const team = await MaintenanceTeam.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Maintenance team not found' });
    }

    complaint.assignedTeam = teamId;
    complaint.status = 'ASSIGNED';
    complaint.assignedAt = new Date();
    if (priority) complaint.priority = priority;

    complaint.timeline.push({
      status: 'ASSIGNED',
      message: `Assigned to maintenance team: ${team.teamName}`,
      updatedBy: req.user._id,
    });

    await complaint.save();

    // Notify citizen
    await createNotification(
      complaint.citizen,
      `Maintenance team "${team.teamName}" has been assigned to #${complaint.complaintId}.`,
      'ASSIGNED',
      complaint._id
    );

    // Notify team leader
    await createNotification(
      team.teamLeader,
      `New maintenance task #${complaint.complaintId} at ${complaint.roadName} assigned to your team.`,
      'ASSIGNED',
      complaint._id
    );

    res.json({ message: 'Team assigned successfully', complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Override complaint priority (Admin)
// @route   PUT /api/complaints/:id/priority
// @access  Private (Admin)
const updatePriority = async (req, res, next) => {
  try {
    const { priority } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.priority = priority;
    complaint.timeline.push({
      status: complaint.status,
      message: `Priority manually set to ${priority} by administrator`,
      updatedBy: req.user._id,
    });

    await complaint.save();
    res.json({ message: 'Priority updated', complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Merge duplicate complaints (Admin)
// @route   POST /api/complaints/:id/merge
// @access  Private (Admin)
const mergeDuplicates = async (req, res, next) => {
  try {
    const { duplicateId } = req.body;
    const primary = await Complaint.findById(req.params.id);
    const secondary = await Complaint.findById(duplicateId);

    if (!primary || !secondary) {
      return res.status(404).json({ message: 'One or both complaints not found' });
    }

    // Link secondary to primary
    secondary.status = 'UNDER REVIEW';
    secondary.isDuplicate = true;
    secondary.duplicateOf = primary._id;
    await secondary.save();

    primary.duplicateCount += 1;
    primary.additionalReporters.push({
      user: secondary.citizen,
      reportedAt: secondary.submittedAt,
    });

    // Re-evaluate priority score with additional reporters
    const { priorityScore, priority } = calculatePriority(
      primary.severity,
      primary.damageType,
      primary.duplicateCount,
      primary.submittedAt
    );
    primary.priorityScore = priorityScore;
    primary.priority = priority;

    await primary.save();

    res.json({ message: 'Complaints linked successfully', primary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignMaintenanceTeam,
  updatePriority,
  mergeDuplicates,
};
