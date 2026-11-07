const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'frontend',
        'backend',
        'database',
        'devops',
        'ai_ml',
        'cloud',
        'mobile',
        'soft_skills',
        'programming_language',
        'testing',
        'other',
      ],
      default: 'other',
    },
    aliases: [{ type: String, lowercase: true, trim: true }],
    learningResources: [
      {
        title: String,
        url: String,
        type: { type: String, enum: ['course', 'documentation', 'video', 'book'] },
      },
    ],
    popularity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

skillSchema.index({ name: 'text', aliases: 'text' });

module.exports = mongoose.model('Skill', skillSchema);
