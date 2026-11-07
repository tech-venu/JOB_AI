const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getApplicationById,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// Candidate routes
router.post('/', protect, authorize('jobseeker', 'admin'), applyForJob);
router.get('/my', protect, authorize('jobseeker', 'admin'), getMyApplications);

// Recruiter routes
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

// Single application details
router.get('/:id', protect, getApplicationById);

module.exports = router;

