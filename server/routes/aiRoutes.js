const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @desc    AI Road Damage Detection (Mock/Demo service architecture)
// @route   POST /api/ai/detect-damage
// @access  Private
router.post('/detect-damage', protect, upload.single('image'), (req, res) => {
  // If an actual Python model or service is configured in the future, invoke it here.
  // For demonstration and architecture compliance, we simulate model inference:
  const damageTypes = [
    { type: 'Pothole', confidence: 0.89 },
    { type: 'Road crack', confidence: 0.82 },
    { type: 'Damaged road surface', confidence: 0.78 },
    { type: 'Waterlogging', confidence: 0.91 },
  ];

  // Pick deterministic or sample detection
  const randomDetection = damageTypes[Math.floor(Math.random() * damageTypes.length)];

  res.json({
    status: 'success',
    isAiModelConnected: false, // Explicitly stating demo prediction mode as requested
    mode: 'DEMO_PREDICTION_SERVICE',
    detectedDamage: randomDetection.type,
    confidence: randomDetection.confidence,
    message: 'AI Damage Detection (Simulation/Demo Mode - Ready for real model endpoint)',
  });
});

module.exports = router;
