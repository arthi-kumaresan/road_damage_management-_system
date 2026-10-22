const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roadName: {
      type: String,
      required: [true, 'Road name is required'],
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'Area/Locality is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    damageType: {
      type: String,
      required: [true, 'Damage type is required'],
      enum: [
        'Pothole',
        'Road crack',
        'Damaged road surface',
        'Road collapse',
        'Waterlogging',
        'Broken road edge',
        'Drainage-related road damage',
        'Other',
      ],
      default: 'Pothole',
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    priorityScore: {
      type: Number,
      default: 50,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: [
        'SUBMITTED',
        'UNDER REVIEW',
        'VERIFIED',
        'ASSIGNED',
        'WORK IN PROGRESS',
        'REPAIRED',
        'COMPLETED',
        'REJECTED',
        'REOPENED',
      ],
      default: 'SUBMITTED',
    },
    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceTeam',
      default: null,
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    maintenanceRemarks: {
      type: String,
      default: '',
    },
    beforeRepairImage: {
      type: String,
      default: '',
    },
    afterRepairImage: {
      type: String,
      default: '',
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null,
    },
    duplicateCount: {
      type: Number,
      default: 0,
    },
    additionalReporters: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reportedAt: { type: Date, default: Date.now },
      },
    ],
    aiDetection: {
      detectedDamage: { type: String, default: null },
      confidence: { type: Number, default: null },
      isAiVerified: { type: Boolean, default: false },
    },
    timeline: [
      {
        status: { type: String, required: true },
        message: { type: String, required: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    repairedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    reopenedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({ roadName: 1, area: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ citizen: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
