const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
  analyzeResume,
  updateParsedData,
} = require('../controllers/resumeController');

router.post('/upload', protect, authorize('jobseeker', 'admin'), upload.single('resume'), uploadResume);
router.get('/', protect, getMyResumes);
router.get('/:id', protect, getResumeById);
router.delete('/:id', protect, deleteResume);
router.post('/:id/analyze', protect, analyzeResume);
router.put('/:id/parsed-data', protect, updateParsedData);

module.exports = router;

