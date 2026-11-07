const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
      default: '',
    },
    companyDescription: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    industry: {
      type: String,
      default: 'Technology',
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      default: '11-50',
    },
    location: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'verified', // Set verified for easy onboarding / seed, can be moderated by admin
    },
    verificationNotes: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

recruiterProfileSchema.index({ companyName: 1 });
recruiterProfileSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
