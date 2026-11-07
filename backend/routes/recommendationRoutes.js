const express = require('express');
const router = express.Router();
const {
  getRecommendedJobs,
  getSkillGap,
  analyzeCompatibility,
  careerAssistantChat,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

// Personalized recommendations for logged in jobseeker
router.get('/jobs', protect, getRecommendedJobs);

// Skill gap analysis
router.post('/skills', protect, getSkillGap);
router.get('/skills', protect, getSkillGap);

// On-demand job-resume compatibility analysis
router.post('/analyze', protect, analyzeCompatibility);

// AI Career Assistant Interactive chat
router.post('/assistant', protect, careerAssistantChat);

module.exports = router;
