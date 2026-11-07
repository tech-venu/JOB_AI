const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    storedFileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx'],
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    rawText: {
      type: String,
      default: '',
    },
    parsedData: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      technicalSkills: [{ type: String }],
      softSkills: [{ type: String }],
      education: [
        {
          degree: String,
          institution: String,
          year: String,
          details: String,
        },
      ],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      projects: [
        {
          title: String,
          technologies: [String],
          description: String,
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          year: String,
        },
      ],
      keywords: [{ type: String }],
    },
    analysisResult: {
      completenessScore: { type: Number, default: 0 },
      formattingScore: { type: Number, default: 0 },
      overallScore: { type: Number, default: 0 },
      detectedSections: [{ type: String }],
      missingSections: [{ type: String }],
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      suggestedImprovements: [{ type: String }],
      measurableAchievementsFound: { type: Boolean, default: false },
    },
    isPrimary: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
