const mongoose = require('mongoose');

const maintenanceTeamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        name: String,
        phone: String,
        role: String,
      },
    ],
    contactPhone: {
      type: String,
      required: true,
    },
    assignedArea: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'BUSY', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MaintenanceTeam', maintenanceTeamSchema);
