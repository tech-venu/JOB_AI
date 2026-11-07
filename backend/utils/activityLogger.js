const { ActivityLog } = require('../models');

const logActivity = async ({ userId = null, action, resourceType, resourceId = null, req = null, details = {} }) => {
  try {
    let ipAddress = '';
    let userAgent = '';
    if (req) {
      ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
      userAgent = req.headers['user-agent'] || '';
    }

    await ActivityLog.create({
      user: userId,
      action,
      resourceType,
      resourceId,
      ipAddress,
      userAgent,
      details,
    });
  } catch (err) {
    // Non-blocking error for activity logs
    console.error('[ActivityLog Error]', err.message);
  }
};

module.exports = logActivity;

