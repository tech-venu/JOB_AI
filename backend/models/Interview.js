const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roundTitle: {
      type: String,
      default: 'Technical Interview',
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    meetingLink: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Virtual Meeting',
    },
    feedback: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'rescheduled', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ candidate: 1, scheduledAt: 1 });
interviewSchema.index({ recruiter: 1, scheduledAt: 1 });

module.exports = mongoose.model('Interview', interviewSchema);

