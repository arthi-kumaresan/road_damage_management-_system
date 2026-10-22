const User = require('../models/User');
const Complaint = require('../models/Complaint');
const MaintenanceTeam = require('../models/MaintenanceTeam');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }
    const users = await User.find(query).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User status updated to ${user.isActive ? 'Active' : 'Inactive'}`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get maintenance teams
// @route   GET /api/users/teams
// @access  Private (Admin)
const getTeams = async (req, res, next) => {
  try {
    const teams = await MaintenanceTeam.find().populate('teamLeader', 'name email phone');
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

// @desc    Create maintenance team
// @route   POST /api/users/teams
// @access  Private (Admin)
const createTeam = async (req, res, next) => {
  try {
    const { teamName, teamLeaderId, contactPhone, assignedArea, members } = req.body;

    const team = await MaintenanceTeam.create({
      teamName,
      teamLeader: teamLeaderId,
      contactPhone,
      assignedArea,
      members: members || [],
    });

    res.status(201).json({ message: 'Maintenance team created', team });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, toggleUserStatus, getTeams, createTeam };
