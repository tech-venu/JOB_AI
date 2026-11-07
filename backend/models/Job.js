const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: 120,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      minlength: [20, 'Job description must be at least 20 characters'],
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    preferredSkills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    qualification: {
      type: String,
      default: "Bachelor's Degree",
    },
    experienceMin: {
      type: Number,
      default: 0,
      min: 0,
    },
    experienceMax: {
      type: Number,
      default: 5,
      min: 0,
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    workplaceType: {
      type: String,
      enum: ['remote', 'hybrid', 'on-site'],
      default: 'on-site',
    },
    applicationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
      index: true,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance search, filter, and sort
jobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  requiredSkills: 'text',
});
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ workplaceType: 1 });
jobSchema.index({ employmentType: 1 });
jobSchema.index({ location: 1 });

module.exports = mongoose.model('Job', jobSchema);
