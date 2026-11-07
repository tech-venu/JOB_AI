const mongoose = require('mongoose');

const applicationStatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        'applied',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'selected',
        'rejected',
      ],
      required: true,
    },
    comment: {
      type: String,
      default: '',
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    status: {
      type: String,
      enum: [
        'applied',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'selected',
        'rejected',
      ],
      default: 'applied',
      index: true,
    },
    statusHistory: [applicationStatusHistorySchema],
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    matchBreakdown: {
      technicalSkillMatch: { type: Number, default: 0 },
      experienceMatch: { type: Number, default: 0 },
      educationMatch: { type: Number, default: 0 },
      keywordMatch: { type: Number, default: 0 },
      matchingSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      reason: { type: String, default: '' },
    },
    coverLetter: {
      type: String,
      default: '',
    },
    recruiterNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate application from same candidate to same job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ job: 1, matchScore: -1 });

module.exports = mongoose.model('Application', applicationSchema);
