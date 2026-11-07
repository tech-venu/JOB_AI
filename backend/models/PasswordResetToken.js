const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatically delete document upon reaching expiresAt
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

