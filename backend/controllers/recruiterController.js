const {
  Job,
  Application,
  CandidateProfile,
  RecruiterProfile,
} = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Recruiter Dashboard Metrics
 */
const getRecruiterDashboard = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    // Get all jobs posted by this recruiter
    const jobs = await Job.find({ recruiter: recruiterId });
    const jobIds = jobs.map((j) => j._id);

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'active').length;

    // Get all applications for recruiter's jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'name email phone')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    const totalApplicants = applications.length;
    const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
    const pendingCount = applications.filter((a) => a.status === 'applied' || a.status === 'under_review').length;
    const selectedCount = applications.filter((a) => a.status === 'selected').length;
    const interviewCount = applications.filter((a) => a.status === 'interview_scheduled').length;

    // Average match score
    const avgMatchScore =
      totalApplicants > 0
        ? Math.round(applications.reduce((acc, a) => acc + (a.matchScore || 0), 0) / totalApplicants)
        : 0;

    // Score distribution
    const scoreBuckets = {
      excellent: applications.filter((a) => a.matchScore >= 80).length,
      good: applications.filter((a) => a.matchScore >= 60 && a.matchScore < 80).length,
      moderate: applications.filter((a) => a.matchScore >= 40 && a.matchScore < 60).length,
      low: applications.filter((a) => a.matchScore < 40).length,
    };

    // Recent applications (last 5)
    const recentApplications = applications.slice(0, 5);

    // Job performance breakdown
    const jobPerformance = jobs.map((job) => {
      const jobApps = applications.filter((a) => a.job?._id?.toString() === job._id.toString());
      return {
        id: job._id,
        title: job.title,
        status: job.status,
        applicantsCount: jobApps.length,
        shortlistedCount: jobApps.filter((a) => a.status === 'shortlisted').length,
        avgScore:
          jobApps.length > 0
            ? Math.round(jobApps.reduce((acc, a) => acc + (a.matchScore || 0), 0) / jobApps.length)
            : 0,
        createdAt: job.createdAt,
      };
    });

    const recruiterProfile = await RecruiterProfile.findOne({ user: recruiterId });

    return sendSuccess(res, {
      profile: recruiterProfile,
      overview: {
        totalJobs,
        activeJobs,
        totalApplicants,
        shortlistedCount,
        pendingCount,
        selectedCount,
        interviewCount,
        avgMatchScore,
      },
      scoreBuckets,
      recentApplications,
      jobPerformance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Filter Candidates by skills, experience, and education
 */
const getCandidates = async (req, res, next) => {
  try {
    const { skills, experienceLevel, location, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (experienceLevel && experienceLevel !== 'all') {
      query.experienceLevel = experienceLevel;
    }

    if (location) {
      query.location = new RegExp(location.trim(), 'i');
    }

    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim().toLowerCase());
      query.primarySkills = { $in: skillArray };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await CandidateProfile.countDocuments(query);
    const candidates = await CandidateProfile.find(query)
      .populate('user', 'name email phone avatar')
      .populate('primaryResume', 'analysisResult parsedData')
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(
      res,
      candidates,
      'Candidates retrieved successfully',
      200,
      {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Recruitment Funnel Analytics
 */
const getRecruiterAnalytics = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds } });

    // Funnel stages
    const funnel = [
      { stage: 'Applied', count: applications.length },
      {
        stage: 'Under Review',
        count: applications.filter((a) =>
          ['under_review', 'shortlisted', 'interview_scheduled', 'selected'].includes(a.status)
        ).length,
      },
      {
        stage: 'Shortlisted',
        count: applications.filter((a) =>
          ['shortlisted', 'interview_scheduled', 'selected'].includes(a.status)
        ).length,
      },
      {
        stage: 'Interview Scheduled',
        count: applications.filter((a) =>
          ['interview_scheduled', 'selected'].includes(a.status)
        ).length,
      },
      {
        stage: 'Hired / Selected',
        count: applications.filter((a) => a.status === 'selected').length,
      },
    ];

    // Status distribution
    const statusCounts = {
      applied: applications.filter((a) => a.status === 'applied').length,
      under_review: applications.filter((a) => a.status === 'under_review').length,
      shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
      interview_scheduled: applications.filter((a) => a.status === 'interview_scheduled').length,
      selected: applications.filter((a) => a.status === 'selected').length,
      rejected: applications.filter((a) => a.status === 'rejected').length,
    };

    return sendSuccess(res, { funnel, statusCounts, totalApplications: applications.length });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecruiterDashboard,
  getCandidates,
  getRecruiterAnalytics,
};
