/**
 * Priority Scoring Engine:
 * - Severity: Critical(40), High(30), Medium(20), Low(10)
 * - Damage Type: Road collapse(30), Pothole(25), Waterlogging(20), Broken road edge(20), Damaged road surface(15), Road crack(10), Other(5)
 * - Age: older complaints get extra points
 * - Duplicate count: +10 points for each duplicate reporter (max 30)
 */
const calculatePriority = (severity, damageType, duplicateCount = 0, submittedAt = new Date()) => {
  let score = 0;

  // Severity weights
  const severityWeights = {
    Critical: 40,
    High: 30,
    Medium: 20,
    Low: 10,
  };
  score += severityWeights[severity] || 20;

  // Damage type weights
  const damageWeights = {
    'Road collapse': 30,
    'Pothole': 25,
    'Waterlogging': 20,
    'Broken road edge': 20,
    'Drainage-related road damage': 20,
    'Damaged road surface': 15,
    'Road crack': 10,
    'Other': 5,
  };
  score += damageWeights[damageType] || 15;

  // Duplicate / community multiplier
  score += Math.min(duplicateCount * 10, 30);

  // Age factor: if complaint is older than 3 days, add bonus
  const daysOld = (Date.now() - new Date(submittedAt).getTime()) / (1000 * 3600 * 24);
  if (daysOld > 7) {
    score += 15;
  } else if (daysOld > 3) {
    score += 8;
  }

  // Derive Priority Level
  let level = 'MEDIUM';
  if (score >= 75) {
    level = 'CRITICAL';
  } else if (score >= 55) {
    level = 'HIGH';
  } else if (score >= 35) {
    level = 'MEDIUM';
  } else {
    level = 'LOW';
  }

  return { priorityScore: Math.min(score, 100), priority: level };
};

module.exports = { calculatePriority };
