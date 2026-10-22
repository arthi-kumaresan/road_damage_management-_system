const Notification = require('../models/Notification');

const createNotification = async (userId, message, type, complaintId = null) => {
  try {
    await Notification.create({
      user: userId,
      message,
      type,
      relatedComplaint: complaintId,
    });
  } catch (error) {
    console.error('Failed to dispatch notification:', error.message);
  }
};

module.exports = { createNotification };
