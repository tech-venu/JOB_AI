const { Job, Resume, CandidateProfile } = require('../models');
const { calculateJobCompatibility } = require('../services/recommendation/matchingEngine');
const { analyzeSkillGap } = require('../services/recommendation/skillGapAnalyzer');
const { askCareerAssistant } = require('../services/ai/careerAssistant');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Intelligent Job Recommendation Engine for Candidate
 */
const getRecommendedJobs = async (req, res, next) => {
  try {
    // Fetch candidate resume and profile
    const resume = await Resume.findOne({ user: req.user._id, isPrimary: true });
    const profile = await CandidateProfile.findOne({ user: req.user._id });

    const candidateSkills = [
      ...(resume?.parsedData?.technicalSkills || []),
      ...(profile?.primarySkills || []),
    ];

    const candidateData = {
      technicalSkills: Array.from(new Set(candidateSkills)),
      skills: candidateSkills,
      totalYearsExperience: profile?.totalYearsExperience || 0,
      education: resume?.parsedData?.education || profile?.education || [],
      rawText: resume?.rawText || '',
    };

    // Fetch all active jobs
    const activeJobs = await Job.find({ status: 'active' }).populate('recruiter', 'name email');

    // Score each job against candidate
    const scoredJobs = activeJobs.map((job) => {
      const match = calculateJobCompatibility(candidateData, job);
      return {
        ...job.toObject(),
        matchScore: match.overallScore,
        matchBreakdown: match.breakdown,
        matchDisclaimer: match.disclaimer,
      };
    });

    // Best Matches (>= 65% match, sorted descending)
    const bestMatches = scoredJobs
      .filter((j) => j.matchScore >= 65)
      .sort((a, b) => b.matchScore - a.matchScore);

    // Recommended (sorted descending)
    const recommendedJobs = [...scoredJobs].sort((a, b) => b.matchScore - a.matchScore);

    // Recent Jobs
    const recentJobs = [...activeJobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

    // Remote Opportunities
    const remoteJobs = scoredJobs.filter((j) => j.workplaceType === 'remote');

    // Internship Opportunities
    const internshipJobs = scoredJobs.filter((j) => j.employmentType === 'Internship');

    return sendSuccess(
      res,
      {
        bestMatches,
        recommendedJobs,
        recentJobs,
        remoteJobs,
        internshipJobs,
        candidateSkills: candidateData.technicalSkills,
      },
      'Job recommendations generated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Skill Gap Analysis
 */
const getSkillGap = async (req, res, next) => {
  try {
    const { jobId, customCandidateSkills, customTargetSkills } = req.body;

    let candidateSkills = customCandidateSkills || [];
    let targetSkills = customTargetSkills || [];

    // If candidate logged in and no custom skills provided, fetch from profile/resume
    if (req.user && candidateSkills.length === 0) {
      const resume = await Resume.findOne({ user: req.user._id, isPrimary: true });
      const profile = await CandidateProfile.findOne({ user: req.user._id });
      candidateSkills = Array.from(
        new Set([
          ...(resume?.parsedData?.technicalSkills || []),
          ...(profile?.primarySkills || []),
        ])
      );
    }

    // If target jobId provided, fetch required skills from job
    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        targetSkills = [
          ...(job.requiredSkills || []),
          ...(job.preferredSkills || []),
        ];
      }
    }

    // Default sample if empty to provide immediate demonstrable value
    if (candidateSkills.length === 0 && targetSkills.length === 0) {
      candidateSkills = ['python', 'sql', 'html', 'css', 'javascript'];
      targetSkills = ['python', 'sql', 'react', 'node.js', 'mongodb'];
    }

    const gapAnalysis = analyzeSkillGap(candidateSkills, targetSkills);

    return sendSuccess(res, gapAnalysis, 'Skill gap analysis generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * On-demand Job vs Resume Compatibility Analysis
 */
const analyzeCompatibility = async (req, res, next) => {
  try {
    const { resumeId, jobId } = req.body;

    if (!jobId) {
      return sendError(res, 'Job ID is required.', 400);
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, 'Job not found.', 404);
    }

    let resume = null;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
    } else if (req.user) {
      resume = await Resume.findOne({ user: req.user._id, isPrimary: true });
    }

    const profile = req.user ? await CandidateProfile.findOne({ user: req.user._id }) : null;

    const candidateData = {
      technicalSkills: resume?.parsedData?.technicalSkills || profile?.primarySkills || [],
      skills: profile?.primarySkills || [],
      totalYearsExperience: profile?.totalYearsExperience || 0,
      education: resume?.parsedData?.education || profile?.education || [],
      rawText: resume?.rawText || '',
    };

    const compatibility = calculateJobCompatibility(candidateData, job);

    return sendSuccess(
      res,
      {
        job: { id: job._id, title: job.title, company: job.company },
        compatibility,
      },
      'Compatibility analysis generated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * AI Career Assistant Chat Endpoint
 */
const careerAssistantChat = async (req, res, next) => {
  try {
    const { message, targetJobTitle } = req.body;

    if (!message || typeof message !== 'string') {
      return sendError(res, 'Please provide a valid question/message.', 400);
    }

    let context = { targetJobTitle };
    if (req.user) {
      const profile = await CandidateProfile.findOne({ user: req.user._id });
      context.role = req.user.role;
      context.skills = profile?.primarySkills || [];
      context.experienceLevel = profile?.experienceLevel || 'entry';
    }

    const response = await askCareerAssistant(message, context);

    return sendSuccess(res, response, 'Career assistant response generated');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendedJobs,
  getSkillGap,
  analyzeCompatibility,
  careerAssistantChat,
};

