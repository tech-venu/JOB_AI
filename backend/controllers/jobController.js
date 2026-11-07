const { Job, RecruiterProfile, SavedJob, Application } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const logActivity = require('../utils/activityLogger');

/**
 * Get all jobs with search, filtering, sorting, and pagination
 */
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      workplaceType,
      employmentType,
      experienceMin,
      experienceMax,
      salaryMin,
      skills,
      sortBy = 'latest',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'active' };

    // Text / keyword search
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex },
        { requiredSkills: searchRegex },
      ];
    }

    if (location) {
      query.location = new RegExp(location.trim(), 'i');
    }

    if (workplaceType && workplaceType !== 'all') {
      query.workplaceType = workplaceType;
    }

    if (employmentType && employmentType !== 'all') {
      query.employmentType = employmentType;
    }

    if (experienceMin !== undefined && experienceMin !== '') {
      query.experienceMin = { $gte: Number(experienceMin) };
    }

    if (experienceMax !== undefined && experienceMax !== '') {
      query.experienceMax = { $lte: Number(experienceMax) };
    }

    if (salaryMin) {
      query.salaryMax = { $gte: Number(salaryMin) };
    }

    if (skills) {
      const skillList = skills.split(',').map((s) => s.trim().toLowerCase());
      query.requiredSkills = { $in: skillList };
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (sortBy === 'salary_high') {
      sort = { salaryMax: -1 };
    } else if (sortBy === 'salary_low') {
      sort = { salaryMin: 1 };
    } else if (sortBy === 'experience') {
      sort = { experienceMin: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiter', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalJobs / limitNum);

    return sendSuccess(
      res,
      jobs,
      'Jobs retrieved successfully',
      200,
      {
        total: totalJobs,
        page: pageNum,
        totalPages,
        limit: limitNum,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get single job by ID
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email');
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    // Fetch recruiter's company details
    const companyProfile = await RecruiterProfile.findOne({ user: job.recruiter?._id });

    // Check if current user has applied or saved this job
    let hasApplied = false;
    let isSaved = false;

    if (req.user && req.user.role === 'jobseeker') {
      const existingApp = await Application.findOne({ job: job._id, candidate: req.user._id });
      hasApplied = Boolean(existingApp);
      const saved = await SavedJob.findOne({ job: job._id, user: req.user._id });
      isSaved = Boolean(saved);
    }

    return sendSuccess(res, {
      ...job.toObject(),
      companyProfile,
      hasApplied,
      isSaved,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new job posting (Recruiter only)
 */
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      requiredSkills,
      preferredSkills,
      qualification,
      experienceMin,
      experienceMax,
      salaryMin,
      salaryMax,
      currency,
      location,
      employmentType,
      workplaceType,
      applicationDeadline,
    } = req.body;

    if (!title || !description || !location) {
      return sendError(res, 'Title, description, and location are required fields.', 400);
    }

    // Format skills
    const formatSkills = (skills) => {
      if (Array.isArray(skills)) return skills.map((s) => s.trim().toLowerCase());
      if (typeof skills === 'string') return skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
      return [];
    };

    // Determine company name from RecruiterProfile if not given
    let companyName = company;
    if (!companyName) {
      const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
      companyName = recruiterProfile?.companyName || `${req.user.name}'s Company`;
    }

    const job = await Job.create({
      title,
      company: companyName,
      recruiter: req.user._id,
      description,
      requiredSkills: formatSkills(requiredSkills),
      preferredSkills: formatSkills(preferredSkills),
      qualification: qualification || "Bachelor's Degree",
      experienceMin: Number(experienceMin) || 0,
      experienceMax: Number(experienceMax) || 5,
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      currency: currency || 'USD',
      location,
      employmentType: employmentType || 'Full-time',
      workplaceType: workplaceType || 'on-site',
      applicationDeadline: applicationDeadline || null,
      status: 'active',
    });

    await logActivity({
      userId: req.user._id,
      action: 'JOB_CREATED',
      resourceType: 'job',
      resourceId: job._id,
      req,
      details: { title: job.title, company: job.company },
    });

    return sendSuccess(res, job, 'Job posting published successfully!', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update job posting
 */
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return sendError(res, 'Job posting not found.', 404);
    }

    // Verify ownership or admin privileges
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to modify this job posting.', 403);
    }

    const updates = { ...req.body };
    if (updates.requiredSkills && typeof updates.requiredSkills === 'string') {
      updates.requiredSkills = updates.requiredSkills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    }
    if (updates.preferredSkills && typeof updates.preferredSkills === 'string') {
      updates.preferredSkills = updates.preferredSkills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    await logActivity({
      userId: req.user._id,
      action: 'JOB_UPDATED',
      resourceType: 'job',
      resourceId: job._id,
      req,
    });

    return sendSuccess(res, updatedJob, 'Job posting updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete job posting
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return sendError(res, 'Job posting not found.', 404);
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to delete this job posting.', 403);
    }

    // Soft delete or hard delete: we delete job and associated applications
    await Job.deleteOne({ _id: job._id });
    await Application.deleteMany({ job: job._id });
    await SavedJob.deleteMany({ job: job._id });

    await logActivity({
      userId: req.user._id,
      action: 'JOB_DELETED',
      resourceType: 'job',
      resourceId: job._id,
      req,
    });

    return sendSuccess(res, null, 'Job posting deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Save or Unsave a job for current candidate
 */
const toggleSaveJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const existing = await SavedJob.findOne({ user: req.user._id, job: jobId });

    if (existing) {
      await SavedJob.deleteOne({ _id: existing._id });
      return sendSuccess(res, { isSaved: false }, 'Job removed from saved list');
    } else {
      await SavedJob.create({ user: req.user._id, job: jobId });
      return sendSuccess(res, { isSaved: true }, 'Job saved successfully');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get all saved jobs for current candidate
 */
const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ user: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    const jobs = saved.filter((s) => s.job !== null).map((s) => s.job);
    return sendSuccess(res, jobs, 'Saved jobs fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getSavedJobs,
};

