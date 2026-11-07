const fs = require('fs');
const path = require('path');
const { Resume, CandidateProfile } = require('../models');
const { parseResume } = require('../services/resume/resumeParser');
const { analyzeResumeQuality } = require('../services/ai/resumeAnalyzer');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const logActivity = require('../utils/activityLogger');

/**
 * Upload and parse resume (PDF or DOCX)
 */
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'Please upload a PDF or DOCX resume file.', 400);
    }

    const { originalname, filename, path: filePath, size } = req.file;
    const ext = path.extname(originalname).toLowerCase().replace('.', '');
    const fileType = ext === 'docx' || ext === 'doc' ? 'docx' : 'pdf';

    // Parse text and extract entities
    let parsingResult;
    try {
      parsingResult = await parseResume(filePath, fileType);
    } catch (parseError) {
      console.error('[Resume Parser Error]', parseError);
      return sendError(res, `Failed to parse document text: ${parseError.message}`, 422);
    }

    const { rawText, parsedData } = parsingResult;

    // AI Quality Analysis
    const analysisResult = analyzeResumeQuality(rawText, parsedData);

    // Save Resume document
    const resume = await Resume.create({
      user: req.user._id,
      originalFileName: originalname,
      storedFileName: filename,
      filePath,
      fileType,
      fileSize: size,
      rawText,
      parsedData,
      analysisResult,
      isPrimary: true,
    });

    // Update candidate profile with parsed skills and set primary resume
    const candidateProfile = await CandidateProfile.findOne({ user: req.user._id });
    if (candidateProfile) {
      candidateProfile.primaryResume = resume._id;
      if (parsedData.technicalSkills && parsedData.technicalSkills.length > 0) {
        // Merge without duplicates
        const existingSet = new Set(candidateProfile.primarySkills || []);
        parsedData.technicalSkills.forEach((s) => existingSet.add(s));
        candidateProfile.primarySkills = Array.from(existingSet);
      }
      if (parsedData.location && !candidateProfile.location) {
        candidateProfile.location = parsedData.location;
      }
      await candidateProfile.save();
    }

    await logActivity({
      userId: req.user._id,
      action: 'RESUME_UPLOADED',
      resourceType: 'resume',
      resourceId: resume._id,
      req,
      details: { fileName: originalname, skillsFound: parsedData.technicalSkills.length },
    });

    return sendSuccess(
      res,
      resume,
      'Resume uploaded, parsed and analyzed successfully!',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all resumes for authenticated candidate
 */
const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, resumes, 'Resumes fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get single resume by ID
 */
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return sendError(res, 'Resume not found.', 404);
    }

    // Authorization: owner, admin, or recruiter can view
    if (
      resume.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'recruiter'
    ) {
      return sendError(res, 'You are not authorized to view this resume.', 403);
    }

    return sendSuccess(res, resume, 'Resume fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete resume
 */
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return sendError(res, 'Resume not found.', 404);
    }

    if (resume.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to delete this resume.', 403);
    }

    // Remove file from disk
    if (fs.existsSync(resume.filePath)) {
      try {
        fs.unlinkSync(resume.filePath);
      } catch (err) {
        console.warn('[File Unlink Warning]', err.message);
      }
    }

    await Resume.deleteOne({ _id: resume._id });

    // Clean up reference in CandidateProfile
    await CandidateProfile.updateOne(
      { user: resume.user, primaryResume: resume._id },
      { $unset: { primaryResume: 1 } }
    );

    await logActivity({
      userId: req.user._id,
      action: 'RESUME_DELETED',
      resourceType: 'resume',
      resourceId: resume._id,
      req,
    });

    return sendSuccess(res, null, 'Resume deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * On-demand re-analyze resume
 */
const analyzeResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return sendError(res, 'Resume not found.', 404);
    }

    if (resume.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to analyze this resume.', 403);
    }

    const analysisResult = analyzeResumeQuality(resume.rawText, resume.parsedData);
    resume.analysisResult = analysisResult;
    await resume.save();

    return sendSuccess(res, analysisResult, 'Resume analysis refreshed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Manual correction of extracted parsed data
 * Enables candidate to refine auto-extracted skills, experience, or details
 */
const updateParsedData = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return sendError(res, 'Resume not found.', 404);
    }

    if (resume.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to update this resume.', 403);
    }

    const { parsedData } = req.body;
    if (!parsedData) {
      return sendError(res, 'Please provide updated parsedData object.', 400);
    }

    resume.parsedData = { ...resume.parsedData.toObject(), ...parsedData };
    // Recalculate quality analysis with corrected data
    resume.analysisResult = analyzeResumeQuality(resume.rawText, resume.parsedData);
    await resume.save();

    // Also synchronize candidate profile primary skills
    if (parsedData.technicalSkills) {
      await CandidateProfile.updateOne(
        { user: req.user._id },
        { $set: { primarySkills: parsedData.technicalSkills } }
      );
    }

    return sendSuccess(res, resume, 'Resume details manually updated and re-calibrated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
  analyzeResume,
  updateParsedData,
};

