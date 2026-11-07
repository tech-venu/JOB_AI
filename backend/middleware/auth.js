const { User, RecruiterProfile } = require('../models');
const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/responseHandler');

// Protect routes: verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendError(res, 'Authentication required. No token provided.', 401);
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 'User no longer exists.', 401);
    }

    if (user.status === 'suspended') {
      return sendError(res, 'Your account has been suspended. Please contact support.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token. Please log in again.', 401, error);
  }
};

// Authorize roles (e.g. 'admin', 'recruiter', 'jobseeker')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized access.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
        403
      );
    }

    next();
  };
};

// Check if recruiter is verified before sensitive actions
const checkRecruiterVerified = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next(); // Admins bypass
    }

    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    if (!recruiterProfile) {
      return sendError(res, 'Recruiter profile not found.', 404);
    }

    if (recruiterProfile.verificationStatus !== 'verified') {
      return sendError(
        res,
        'Your recruiter account is pending verification by an administrator. Job posting is restricted until verified.',
        403
      );
    }

    req.recruiterProfile = recruiterProfile;
    next();
  } catch (err) {
    return sendError(res, 'Failed to verify recruiter status.', 500, err);
  }
};

module.exports = {
  protect,
  authorize,
  checkRecruiterVerified,
};
