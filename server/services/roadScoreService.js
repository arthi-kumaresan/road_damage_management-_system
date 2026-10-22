const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');

/**
 * Calculate Road Condition Score (0 - 100)
 * 0 - 30 = Good
 * 31 - 60 = Moderate
 * 61 - 80 = Poor
 * 81 - 100 = Critical
 */
const calculateRoadScores = async () => {
  const complaints = await Complaint.find();

  const roadMap = {};

  complaints.forEach((c) => {
    const key = `${c.roadName} (${c.area})`;
    if (!roadMap[key]) {
      roadMap[key] = {
        roadName: c.roadName,
        area: c.area,
        totalComplaints: 0,
        activeComplaints: 0,
        criticalSeverityCount: 0,
        reopenedCount: 0,
        score: 0,
      };
    }

    roadMap[key].totalComplaints += 1;
    if (!['COMPLETED', 'REJECTED'].includes(c.status)) {
      roadMap[key].activeComplaints += 1;
    }
    if (c.severity === 'Critical') {
      roadMap[key].criticalSeverityCount += 1;
    }
    if (c.status === 'REOPENED') {
      roadMap[key].reopenedCount += 1;
    }
  });

  // Calculate score for each road
  const roadStats = Object.values(roadMap).map((item) => {
    let score =
      item.activeComplaints * 15 +
      item.criticalSeverityCount * 25 +
      item.reopenedCount * 20;

    score = Math.min(score, 100);

    let status = 'GOOD';
    if (score >= 81) status = 'CRITICAL';
    else if (score >= 61) status = 'POOR';
    else if (score >= 31) status = 'MODERATE';

    return {
      ...item,
      score,
      conditionStatus: status,
    };
  });

  return roadStats;
};

module.exports = { calculateRoadScores };
