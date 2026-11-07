const {
  User,
  Job,
  Application,
  RecruiterProfile,
  CandidateProfile,
  ActivityLog,
  Resume,
} = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const logActivity = require('../utils/activityLogger');

/**
 * Super Admin Dashboard Analytics
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobSeekers = await User.countDocuments({ role: 'jobseeker' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const verifiedRecruiters = await RecruiterProfile.countDocuments({ verificationStatus: 'verified' });
    const pendingRecruiters = await RecruiterProfile.countDocuments({ verificationStatus: 'pending' });

    // Recent user signups
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    // Recent activity logs
    const recentActivity = await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(10);

    return sendSuccess(res, {
      stats: {
        totalUsers,
        totalJobSeekers,
        totalRecruiters,
        activeJobs,
        totalJobs,
        totalApplications,
        totalResumes,
        verifiedRecruiters,
        pendingRecruiters,
      },
      recentUsers,
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users with search, filtering, and pagination
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { email: new RegExp(search.trim(), 'i') },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(res, users, 'Users retrieved successfully', 200, {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Suspend or activate a user account
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return sendError(res, 'Status must be active or suspended.', 400);
    }

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }

    // Prevent suspending the admin themselves
    if (user._id.toString() === req.user._id.toString()) {
      return sendError(res, 'You cannot modify your own administrative status.', 400);
    }

    user.status = status;
    await user.save();

    await logActivity({
      userId: req.user._id,
      action: status === 'suspended' ? 'USER_SUSPENDED' : 'USER_ACTIVATED',
      resourceType: 'user',
      resourceId: user._id,
      req,
      details: { targetUserId: user._id, newStatus: status },
    });

    return sendSuccess(res, user, `User status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify or reject recruiter profile
 */
const verifyRecruiter = async (req, res, next) => {
  try {
    const { id } = req.params; // Recruiter Profile ID or User ID
    const { verificationStatus, notes } = req.body;

    if (!['verified', 'rejected', 'pending'].includes(verificationStatus)) {
      return sendError(res, 'Invalid verification status.', 400);
    }

    const recruiterProfile = await RecruiterProfile.findOne({
      $or: [{ _id: id }, { user: id }],
    }).populate('user', 'name email');

    if (!recruiterProfile) {
      return sendError(res, 'Recruiter profile not found.', 404);
    }

    recruiterProfile.verificationStatus = verificationStatus;
    recruiterProfile.verificationNotes = notes || '';
    if (verificationStatus === 'verified') {
      recruiterProfile.verifiedAt = new Date();
      recruiterProfile.verifiedBy = req.user._id;
    }
    await recruiterProfile.save();

    await logActivity({
      userId: req.user._id,
      action: 'RECRUITER_VERIFICATION_UPDATED',
      resourceType: 'user',
      resourceId: recruiterProfile.user?._id,
      req,
      details: { verificationStatus },
    });

    return sendSuccess(res, recruiterProfile, `Recruiter status updated to ${verificationStatus}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all platform jobs (Admin overview)
 */
const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { title: new RegExp(search.trim(), 'i') },
        { company: new RegExp(search.trim(), 'i') },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(res, jobs, 'Jobs fetched successfully', 200, {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get platform activity logs
 */
const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await ActivityLog.countDocuments();
    const logs = await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(res, logs, 'Activity logs fetched', 200, {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
  verifyRecruiter,
  getAllJobsAdmin,
  getActivityLogs,
};
