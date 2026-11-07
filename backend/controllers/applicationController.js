const {
  Application,
  Job,
  Resume,
  CandidateProfile,
  Notification,
} = require('../models');
const { calculateJobCompatibility } = require('../services/recommendation/matchingEngine');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const logActivity = require('../utils/activityLogger');

/**
 * Apply for a Job
 */
const applyForJob = async (req, res, next) => {
  try {
    const { jobId, resumeId, coverLetter } = req.body;

    if (!jobId) {
      return sendError(res, 'Job ID is required.', 400);
    }

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'active') {
      return sendError(res, 'Job posting not found or is no longer accepting applications.', 404);
    }

    // Check duplicate application
    const existing = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existing) {
      return sendError(res, 'You have already submitted an application for this position.', 400);
    }

    // Fetch candidate resume
    let resume = null;
    if (resumeId) {
      resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    }
    if (!resume) {
      resume = await Resume.findOne({ user: req.user._id, isPrimary: true });
    }

    // Fetch candidate profile
    const profile = await CandidateProfile.findOne({ user: req.user._id });

    // Calculate AI match score & breakdown
    const candidateData = {
      technicalSkills: resume?.parsedData?.technicalSkills || profile?.primarySkills || [],
      skills: profile?.primarySkills || [],
      totalYearsExperience: profile?.totalYearsExperience || 0,
      education: resume?.parsedData?.education || profile?.education || [],
      rawText: resume?.rawText || '',
    };

    const compatibility = calculateJobCompatibility(candidateData, job);

    // Create Application
    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resume: resume ? resume._id : null,
      coverLetter: coverLetter || '',
      matchScore: compatibility.overallScore,
      matchBreakdown: compatibility.breakdown,
      status: 'applied',
      statusHistory: [
        {
          status: 'applied',
          comment: 'Application submitted successfully.',
          changedAt: new Date(),
          changedBy: req.user._id,
        },
      ],
    });

    // Increment applicants counter on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

    // Notify Recruiter
    await Notification.create({
      recipient: job.recruiter,
      sender: req.user._id,
      type: 'application_received',
      title: 'New Applicant Received',
      message: `${req.user.name} applied for "${job.title}" with a ${compatibility.overallScore}% AI compatibility match score.`,
      link: `/recruiter/jobs/${job._id}/applicants`,
    });

    await logActivity({
      userId: req.user._id,
      action: 'JOB_APPLIED',
      resourceType: 'application',
      resourceId: application._id,
      req,
      details: { jobId, matchScore: compatibility.overallScore },
    });

    return sendSuccess(res, application, 'Application submitted successfully!', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all applications submitted by authenticated candidate
 */
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job')
      .populate('resume', 'originalFileName analysisResult')
      .sort({ createdAt: -1 });

    return sendSuccess(res, applications, 'Applications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get applicants for a job (Recruiter AI Candidate Ranking)
 */
const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, minScore, sortBy = 'rank' } = req.query;

    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, 'Job not found.', 404);
    }

    // Authorization check
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to view applicants for this job.', 403);
    }

    const query = { job: jobId };
    if (status && status !== 'all') {
      query.status = status;
    }
    if (minScore) {
      query.matchScore = { $gte: Number(minScore) };
    }

    // Sort order: default is AI rank (highest matchScore first)
    let sort = { matchScore: -1, createdAt: -1 };
    if (sortBy === 'latest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    }

    const applications = await Application.find(query)
      .populate('candidate', 'name email phone')
      .populate('resume', 'originalFileName parsedData analysisResult filePath')
      .sort(sort);

    // Fetch candidate profiles to enrich candidate ranking
    const candidateIds = applications.map((app) => app.candidate?._id).filter(Boolean);
    const profiles = await CandidateProfile.find({ user: { $in: candidateIds } });
    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.user.toString()] = p;
    });

    // Annotate with rank index
    const rankedApplicants = applications.map((app, index) => {
      const appObj = app.toObject();
      return {
        ...appObj,
        aiRank: index + 1,
        candidateProfile: profileMap[app.candidate?._id?.toString()] || null,
      };
    });

    return sendSuccess(
      res,
      {
        job,
        totalApplicants: rankedApplicants.length,
        applicants: rankedApplicants,
      },
      'Applicants retrieved with AI ranking'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update application status (Recruiter & Admin)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, comment, recruiterNotes } = req.body;

    const validStatuses = [
      'applied',
      'under_review',
      'shortlisted',
      'interview_scheduled',
      'selected',
      'rejected',
    ];

    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const application = await Application.findById(id).populate('job', 'title recruiter');
    if (!application) {
      return sendError(res, 'Application not found.', 404);
    }

    // Ownership check
    if (
      application.job.recruiter.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return sendError(res, 'Not authorized to update this application status.', 403);
    }

    application.status = status;
    if (recruiterNotes !== undefined) {
      application.recruiterNotes = recruiterNotes;
    }

    // Add status history record
    application.statusHistory.push({
      status,
      comment: comment || `Status updated to ${status.replace('_', ' ').toUpperCase()}`,
      changedAt: new Date(),
      changedBy: req.user._id,
    });

    await application.save();

    // Notify candidate
    await Notification.create({
      recipient: application.candidate,
      sender: req.user._id,
      type: 'application_status',
      title: 'Application Status Update',
      message: `Your application for "${application.job.title}" has been updated to ${status.replace('_', ' ').toUpperCase()}.`,
      link: '/jobseeker/applications',
    });

    await logActivity({
      userId: req.user._id,
      action: 'APPLICATION_STATUS_UPDATED',
      resourceType: 'application',
      resourceId: application._id,
      req,
      details: { newStatus: status, jobId: application.job._id },
    });

    return sendSuccess(res, application, 'Application status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get single application by ID
 */
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'name email phone')
      .populate('resume');

    if (!application) {
      return sendError(res, 'Application not found.', 404);
    }

    // Verify candidate or recruiter or admin
    const isCandidate = application.candidate?._id?.toString() === req.user._id.toString();
    const isRecruiter = application.job?.recruiter?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCandidate && !isRecruiter && !isAdmin) {
      return sendError(res, 'Not authorized to view this application.', 403);
    }

    return sendSuccess(res, application, 'Application retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getApplicationById,
};
