const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
  verifyRecruiter,
  getAllJobsAdmin,
  getActivityLogs,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/recruiters/:id/verify', verifyRecruiter);
router.get('/jobs', getAllJobsAdmin);
router.get('/activity', getActivityLogs);

module.exports = router;
