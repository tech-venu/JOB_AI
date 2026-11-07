const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getSavedJobs,
} = require('../controllers/jobController');
const { protect, authorize, checkRecruiterVerified } = require('../middleware/auth');

// Public route to browse & search jobs
router.get('/', getJobs);

// Saved jobs for logged-in candidate
router.get('/saved', protect, authorize('jobseeker'), getSavedJobs);
router.post('/:id/save', protect, authorize('jobseeker'), toggleSaveJob);

// Single job details
router.get('/:id', getJobById);

// Recruiter operations
router.post('/', protect, authorize('recruiter', 'admin'), checkRecruiterVerified, createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
