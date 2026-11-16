const crypto = require('crypto');
const {
  User,
  CandidateProfile,
  RecruiterProfile,
  PasswordResetToken,
} = require('../models');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const logActivity = require('../utils/activityLogger');
const { syncUserRegistration, syncUserLogin } = require('../services/mysqlSyncService');

/**
 * Register a new user (Job Seeker or Recruiter)
 * Admin role is strictly prohibited from self-registration
 */
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role = 'jobseeker',
      phone,
      location,
      education,
      experienceLevel,
      primarySkills,
      companyName,
      companyWebsite,
      companyDescription,
      industry,
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return sendError(res, 'Name, email and password are required.', 400);
    }

    if (password.length < 8) {
      return sendError(res, 'Password must be at least 8 characters long.', 400);
    }

    if (confirmPassword && password !== confirmPassword) {
      return sendError(res, 'Passwords do not match.', 400);
    }

    // Role security check: Never allow users to assign themselves Admin
    if (role === 'admin') {
      return sendError(res, 'Administrative registration is strictly restricted.', 403);
    }

    const assignedRole = role === 'recruiter' ? 'recruiter' : 'jobseeker';

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return sendError(res, 'An account with this email address already exists.', 400);
    }

    // Create User
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
      phone: phone || '',
      isVerified: assignedRole === 'jobseeker', // Jobseekers verified by default, recruiters can be moderated
    });

    // Create linked profile based on role
    if (assignedRole === 'jobseeker') {
      const skillsArray = Array.isArray(primarySkills)
        ? primarySkills
        : typeof primarySkills === 'string'
        ? primarySkills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await CandidateProfile.create({
        user: user._id,
        location: location || '',
        experienceLevel: experienceLevel || 'entry',
        primarySkills: skillsArray,
        education: education
          ? [
              {
                degree: education,
                institution: 'Educational Institute',
              },
            ]
          : [],
      });
    } else if (assignedRole === 'recruiter') {
      await RecruiterProfile.create({
        user: user._id,
        companyName: companyName || `${name}'s Company`,
        companyWebsite: companyWebsite || '',
        companyDescription: companyDescription || '',
        industry: industry || 'Technology',
        verificationStatus: 'verified', // Auto-verified for seamless testing; admin can change
      });
    }

    // Synchronize user & profile into XAMPP MySQL JOB_AI database
    await syncUserRegistration({
      user,
      plainPassword: password,
      profileData: {
        headline: assignedRole === 'jobseeker' ? `${name} - Candidate` : undefined,
        location,
        experienceLevel,
        primarySkills,
        education,
        companyName,
        companyWebsite,
        companyDescription,
        industry,
      },
      req,
    });

    const token = generateToken(user._id);

    await logActivity({
      userId: user._id,
      action: 'USER_REGISTERED',
      resourceType: 'auth',
      resourceId: user._id,
      req,
      details: { role: assignedRole, email: user.email },
    });

    // Send cookie if desired
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
        },
      },
      'Registration successful!',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide both email and password.', 400);
    }

    // Explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    if (user.status === 'suspended') {
      return sendError(res, 'Your account has been suspended. Please contact platform administration.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    // Fetch linked profile
    let profile = null;
    if (user.role === 'jobseeker') {
      profile = await CandidateProfile.findOne({ user: user._id }).populate('primaryResume');
    } else if (user.role === 'recruiter') {
      profile = await RecruiterProfile.findOne({ user: user._id });
    }

    await logActivity({
      userId: user._id,
      action: 'USER_LOGIN',
      resourceType: 'auth',
      resourceId: user._id,
      req,
    });

    // Record login in XAMPP MySQL JOB_AI database
    await syncUserLogin({ user, req });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
          status: user.status,
          profile,
        },
      },
      'Login successful!'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  return sendSuccess(res, null, 'Logged out successfully');
};

/**
 * Get current authenticated user details
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;

    if (user.role === 'jobseeker') {
      profile = await CandidateProfile.findOne({ user: user._id }).populate('primaryResume');
    } else if (user.role === 'recruiter') {
      profile = await RecruiterProfile.findOne({ user: user._id });
    }

    return sendSuccess(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isVerified: user.isVerified,
        status: user.status,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot Password - Generates a secure reset token
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, 'Please provide your account email address.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return success without revealing user existence to prevent enumeration
      return sendSuccess(
        res,
        null,
        'If an account exists with that email, a password reset token has been generated.'
      );
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Remove any existing tokens for this user
    await PasswordResetToken.deleteMany({ user: user._id });

    // Save token with 30-minute expiry
    await PasswordResetToken.create({
      user: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    await logActivity({
      userId: user._id,
      action: 'PASSWORD_RESET_REQUESTED',
      resourceType: 'auth',
      req,
    });

    // In a production app with SMTP, this would be emailed. For developer testing/demo, we return the token in dev mode.
    return sendSuccess(
      res,
      {
        resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
      },
      'Password reset instructions sent. Token valid for 30 minutes.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password using token
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword) {
      return sendError(res, 'Token and new password are required.', 400);
    }

    if (newPassword.length < 8) {
      return sendError(res, 'Password must be at least 8 characters long.', 400);
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return sendError(res, 'Passwords do not match.', 400);
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetDoc = await PasswordResetToken.findOne({
      token: hashedToken,
      expiresAt: { $gt: new Date() },
    });

    if (!resetDoc) {
      return sendError(res, 'Invalid or expired password reset token.', 400);
    }

    const user = await User.findById(resetDoc.user);
    if (!user) {
      return sendError(res, 'User no longer exists.', 404);
    }

    user.password = newPassword;
    await user.save();

    // Clean up used token
    await PasswordResetToken.deleteOne({ _id: resetDoc._id });

    await logActivity({
      userId: user._id,
      action: 'PASSWORD_RESET_COMPLETED',
      resourceType: 'auth',
      req,
    });

    return sendSuccess(res, null, 'Password has been successfully reset. You may now log in.');
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, ...profileData } = req.body;

    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    let profile = null;
    if (user.role === 'jobseeker') {
      profile = await CandidateProfile.findOneAndUpdate(
        { user: user._id },
        { $set: profileData },
        { new: true, upsert: true }
      );
    } else if (user.role === 'recruiter') {
      profile = await RecruiterProfile.findOneAndUpdate(
        { user: user._id },
        { $set: profileData },
        { new: true, upsert: true }
      );
    }

    return sendSuccess(res, { user, profile }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Change current user password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return sendError(res, 'Current password and new password are required.', 400);
    }
    if (newPassword.length < 8) {
      return sendError(res, 'New password must be at least 8 characters long.', 400);
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      return sendError(res, 'New passwords do not match.', 400);
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 'Current password does not match.', 400);
    }

    user.password = newPassword;
    await user.save();

    await logActivity({
      userId: user._id,
      action: 'PASSWORD_CHANGED',
      resourceType: 'auth',
      req,
    });

    return sendSuccess(res, null, 'Password updated successfully!');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
};

