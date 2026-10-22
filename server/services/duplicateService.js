const Complaint = require('../models/Complaint');

/**
 * Searches for complaints in the same area or road with the same damage type that are still open
 */
const detectDuplicates = async (roadName, area, damageType) => {
  const normalizedRoad = roadName.trim().toLowerCase();
  const normalizedArea = area.trim().toLowerCase();

  const candidates = await Complaint.find({
    status: { $nin: ['COMPLETED', 'REJECTED'] },
    damageType: damageType,
  }).populate('citizen', 'name email');

  const matches = candidates.filter((c) => {
    const cRoad = c.roadName.trim().toLowerCase();
    const cArea = c.area.trim().toLowerCase();
    return (
      cArea.includes(normalizedArea) ||
      normalizedArea.includes(cArea) ||
      cRoad.includes(normalizedRoad) ||
      normalizedRoad.includes(cRoad)
    );
  });

  return matches;
};

module.exports = { detectDuplicates };
