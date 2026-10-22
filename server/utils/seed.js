const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      tlsAllowInvalidCertificates: true,
    });
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    await MaintenanceTeam.deleteMany();
    await Notification.deleteMany();
    await Feedback.deleteMany();
    console.log('Cleared previous database entries.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@roadcare.gov',
      phone: '9876543210',
      password: 'password123',
      address: 'Municipal Civic Center, Central HQ',
      role: 'ADMIN',
    });

    const citizenUser = await User.create({
      name: 'John Citizen',
      email: 'citizen@example.com',
      phone: '9123456780',
      password: 'password123',
      address: 'Flat 4B, Green Meadows, North Sector',
      role: 'CITIZEN',
    });

    const teamLeadUser = await User.create({
      name: 'Robert Fixer (Lead)',
      email: 'teamlead@roadcare.gov',
      phone: '9988776655',
      password: 'password123',
      address: 'Works Yard 3, Industrial Area',
      role: 'MAINTENANCE_TEAM',
    });

    console.log('Demo Users Created:');
    console.log('- Admin: admin@roadcare.gov / password123');
    console.log('- Citizen: citizen@example.com / password123');
    console.log('- Maintenance Team: teamlead@roadcare.gov / password123');

    // 2. Create Maintenance Team
    const maintenanceTeam = await MaintenanceTeam.create({
      teamName: 'Rapid Asphalt Taskforce #1',
      teamLeader: teamLeadUser._id,
      contactPhone: '9988776655',
      assignedArea: 'North Sector',
      members: [
        { name: 'Alex Patel', phone: '9000000001', role: 'Roller Operator' },
        { name: 'David Lee', phone: '9000000002', role: 'Paving Specialist' },
      ],
      status: 'ACTIVE',
    });

    // 3. Create Sample Complaints
    const complaint1 = await Complaint.create({
      complaintId: 'RPT-2026-0001',
      citizen: citizenUser._id,
      roadName: 'Grand Trunk Link Road',
      area: 'North Sector',
      description: 'Massive pothole in the central lane causing vehicular slow-downs and risk of accidents.',
      damageType: 'Pothole',
      severity: 'Critical',
      priority: 'CRITICAL',
      priorityScore: 85,
      images: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600'],
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'ASSIGNED',
      assignedTeam: maintenanceTeam._id,
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      timeline: [
        { status: 'SUBMITTED', message: 'Report submitted by citizen', updatedBy: citizenUser._id },
        { status: 'VERIFIED', message: 'Verified by road authority engineer', updatedBy: adminUser._id },
        { status: 'ASSIGNED', message: 'Assigned to Rapid Asphalt Taskforce #1', updatedBy: adminUser._id },
      ],
    });

    const complaint2 = await Complaint.create({
      complaintId: 'RPT-2026-0002',
      citizen: citizenUser._id,
      roadName: 'Market Avenue 5th Cross',
      area: 'Downtown Commercial',
      description: 'Severe waterlogging and edge breakdown blocking shop entryways.',
      damageType: 'Waterlogging',
      severity: 'High',
      priority: 'HIGH',
      priorityScore: 65,
      images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600'],
      status: 'SUBMITTED',
      timeline: [
        { status: 'SUBMITTED', message: 'Report submitted by citizen', updatedBy: citizenUser._id },
      ],
    });

    const complaint3 = await Complaint.create({
      complaintId: 'RPT-2026-0003',
      citizen: citizenUser._id,
      roadName: 'Station Bypass Flyover',
      area: 'East Sector',
      description: 'Complete road resurfacing finished after asphalt cracked due to monsoon runoff.',
      damageType: 'Road crack',
      severity: 'Medium',
      priority: 'MEDIUM',
      priorityScore: 45,
      images: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600'],
      beforeRepairImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600',
      afterRepairImage: 'https://images.unsplash.com/photo-1578874691223-a4958a699c35?w=600',
      status: 'COMPLETED',
      assignedTeam: maintenanceTeam._id,
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      timeline: [
        { status: 'SUBMITTED', message: 'Submitted', updatedBy: citizenUser._id },
        { status: 'VERIFIED', message: 'Verified', updatedBy: adminUser._id },
        { status: 'ASSIGNED', message: 'Assigned', updatedBy: adminUser._id },
        { status: 'WORK IN PROGRESS', message: 'Resurfacing commenced', updatedBy: teamLeadUser._id },
        { status: 'REPAIRED', message: 'Asphalt layering complete', updatedBy: teamLeadUser._id },
        { status: 'COMPLETED', message: 'Authority inspected and closed complaint', updatedBy: adminUser._id },
      ],
    });

    // 4. Create Feedback for Completed Complaint
    await Feedback.create({
      complaint: complaint3._id,
      citizen: citizenUser._id,
      rating: 5,
      comment: 'Very rapid response! Road looks great now.',
      isSatisfied: true,
      reopened: false,
    });

    // 5. Create Initial Notification
    await Notification.create({
      user: citizenUser._id,
      message: 'Your report RPT-2026-0003 has been verified and repaired by city authorities.',
      type: 'COMPLETED',
      relatedComplaint: complaint3._id,
    });

    console.log('Database successfully seeded with realistic initial records!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
