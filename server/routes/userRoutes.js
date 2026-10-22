const express = require('express');
const router = express.Router();
const {
  getUsers,
  toggleUserStatus,
  getTeams,
  createTeam,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('ADMIN'));

router.get('/', getUsers);
router.put('/:id/toggle-status', toggleUserStatus);
router.get('/teams', getTeams);
router.post('/teams', createTeam);

module.exports = router;
