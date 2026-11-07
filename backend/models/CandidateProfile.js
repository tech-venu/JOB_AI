const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    fieldOfStudy: { type: String, default: '' },
    startYear: { type: Number },
    endYear: { type: Number },
    grade: { type: String, default: '' },
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: '' },
  },
  { _id: true }
);

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: {
      type: String,
      default: '',
      maxlength: 160,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 1500,
    },
    location: {
      type: String,
      default: '',
    },
    experienceLevel: {
      type: String,
      enum: ['fresher', 'entry', 'mid', 'senior', 'lead', 'executive'],
      default: 'entry',
    },
    totalYearsExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
    primarySkills: [
      {
        type: String,
        trim: true,
      },
    ],
    secondarySkills: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [educationSchema],
    experience: [experienceSchema],
    certifications: [
      {
        name: String,
        issuer: String,
        year: Number,
      },
    ],
    preferredRoles: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredLocations: [
      {
        type: String,
        trim: true,
      },
    ],
    expectedSalary: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' },
    },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    primaryResume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
  },
  {
    timestamps: true,
  }
);

candidateProfileSchema.index({ primarySkills: 1 });
candidateProfileSchema.index({ location: 1 });
candidateProfileSchema.index({ experienceLevel: 1 });

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
