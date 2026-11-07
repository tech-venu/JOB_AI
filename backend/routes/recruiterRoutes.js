const express = require('express');
const router = express.Router();
const {
  getRecruiterDashboard,
  getCandidates,
  getRecruiterAnalytics,
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('recruiter', 'admin'));

router.get('/dashboard', getRecruiterDashboard);
router.get('/candidates', getCandidates);
router.get('/analytics', getRecruiterAnalytics);

module.exports = router;
