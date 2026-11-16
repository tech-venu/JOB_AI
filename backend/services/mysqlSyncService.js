const { getMySQLPool } = require('../config/mysql');

/**
 * Helper to ensure a user exists in MySQL JOB_AI.users table
 * and returns their MySQL numeric ID
 */
const getOrCreateMySQLUserId = async (mongoUser, plainPassword = '') => {
  const pool = getMySQLPool();
  const email = (mongoUser.email || '').toLowerCase().trim();
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return existing[0].id;
  }

  const name = mongoUser.name || 'User';
  const password = mongoUser.password || plainPassword || '$2a$10$fFakeHashForSyncPlaceholderOnly00000000000000000000000';
  const role = ['jobseeker', 'recruiter', 'admin'].includes(mongoUser.role) ? mongoUser.role : 'jobseeker';
  const phone = mongoUser.phone || '';
  const isVerified = mongoUser.isVerified ? 1 : 0;
  const status = mongoUser.status || 'active';

  const [res] = await pool.query(
    `INSERT INTO users (name, email, password, role, phone, is_verified, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, password, role, phone, isVerified, status]
  );
  return res.insertId;
};

const mapExperienceLevel = (level) => {
  const norm = (level || '').toLowerCase().trim();
  if (!norm) return 'entry';
  return norm;
};

/**
 * Synchronize a user registration to XAMPP MySQL JOB_AI
 */
const syncUserRegistration = async ({ user, plainPassword = '', profileData = {}, req = null }) => {
  try {
    const pool = getMySQLPool();
    const userId = await getOrCreateMySQLUserId(user, plainPassword);

    // Sync candidate profile if jobseeker
    if (user.role === 'jobseeker') {
      const headline = profileData.headline || 'Job Seeker Candidate';
      const bio = profileData.bio || '';
      const location = profileData.location || '';
      const experienceLevel = mapExperienceLevel(profileData.experienceLevel);
      const primarySkills = JSON.stringify(profileData.primarySkills || []);
      const education = JSON.stringify(profileData.education || []);

      const [prof] = await pool.query('SELECT id FROM candidate_profiles WHERE user_id = ?', [userId]);
      if (prof.length === 0) {
        await pool.query(
          `INSERT INTO candidate_profiles (user_id, headline, bio, location, experience_level, primary_skills, education)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [userId, headline, bio, location, experienceLevel, primarySkills, education]
        );
      }
    }

    // Sync recruiter profile if recruiter
    if (user.role === 'recruiter') {
      const companyName = profileData.companyName || `${user.name}'s Company`;
      const companyWebsite = profileData.companyWebsite || '';
      const companyDescription = profileData.companyDescription || '';
      const industry = profileData.industry || 'Technology';

      const [rec] = await pool.query('SELECT id FROM recruiter_profiles WHERE user_id = ?', [userId]);
      if (rec.length === 0) {
        await pool.query(
          `INSERT INTO recruiter_profiles (user_id, company_name, company_website, company_description, industry, verification_status)
           VALUES (?, ?, ?, ?, ?, 'verified')`,
          [userId, companyName, companyWebsite, companyDescription, industry]
        );
      }
    }

    // Log registration in MySQL activity_logs
    const ip = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    await pool.query(
      `INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details, ip_address)
       VALUES (?, 'USER_REGISTERED', 'auth', ?, ?, ?)`,
      [userId, String(user._id || userId), JSON.stringify({ email: user.email, role: user.role, name: user.name }), String(ip).slice(0, 50)]
    );

    console.log(`[MySQL Sync] Successfully synced registered user '${user.email}' into JOB_AI.users (ID: ${userId})`);
    return userId;
  } catch (err) {
    console.error(`[MySQL Sync Error - Registration] ${err.message}`);
    return null;
  }
};

/**
 * Synchronize a user login event to XAMPP MySQL JOB_AI
 */
const syncUserLogin = async ({ user, req = null }) => {
  try {
    const pool = getMySQLPool();
    const userId = await getOrCreateMySQLUserId(user);

    // Update user timestamp
    await pool.query('UPDATE users SET updated_at = NOW() WHERE id = ?', [userId]);

    // Record login in activity_logs
    const ip = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    await pool.query(
      `INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details, ip_address)
       VALUES (?, 'USER_LOGIN', 'auth', ?, ?, ?)`,
      [userId, String(user._id || userId), JSON.stringify({ email: user.email, role: user.role }), String(ip).slice(0, 50)]
    );

    console.log(`[MySQL Sync] Recorded login for '${user.email}' into JOB_AI (User ID: ${userId})`);
  } catch (err) {
    console.error(`[MySQL Sync Error - Login] ${err.message}`);
  }
};

/**
 * Synchronize a resume upload to XAMPP MySQL JOB_AI.resumes
 */
const syncResumeUpload = async ({ user, resume }) => {
  try {
    const pool = getMySQLPool();
    const userId = await getOrCreateMySQLUserId(user);

    const fileName = resume.fileName || resume.originalName || 'Resume.pdf';
    const fileUrl = resume.fileUrl || resume.filePath || '';
    const fileSize = resume.fileSize || 0;
    const fileType = resume.fileType || 'pdf';
    const rawText = (resume.rawText || '').slice(0, 65000);
    const parsedData = JSON.stringify(resume.parsedData || {});
    const completeness = resume.completenessScore || 85;

    const [res] = await pool.query(
      `INSERT INTO resumes (candidate_id, file_name, file_url, file_size, file_type, raw_text, parsed_data, completeness_score, is_primary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [userId, fileName, fileUrl, fileSize, fileType, rawText, parsedData, completeness]
    );

    console.log(`[MySQL Sync] Synced resume for '${user.email}' into JOB_AI.resumes (ID: ${res.insertId})`);
  } catch (err) {
    console.error(`[MySQL Sync Error - Resume] ${err.message}`);
  }
};

/**
 * Synchronize all existing MongoDB users, profiles, and data into MySQL JOB_AI
 */
const syncAllExistingMongoData = async (mongoModels) => {
  try {
    const pool = getMySQLPool();
    const { User, CandidateProfile, RecruiterProfile, Resume, Job, Application } = mongoModels;

    console.log('[MySQL Sync] Scanning MongoDB to sync all records into XAMPP MySQL JOB_AI...');

    // 1. Sync Users
    const users = await User.find().select('+password');
    for (const u of users) {
      await getOrCreateMySQLUserId(u);
    }

    // 2. Sync Candidate Profiles
    const candidates = await CandidateProfile.find().populate('user');
    for (const cp of candidates) {
      if (!cp.user) continue;
      const [uRows] = await pool.query('SELECT id FROM users WHERE email = ?', [cp.user.email]);
      if (uRows.length > 0) {
        const uId = uRows[0].id;
        const [existing] = await pool.query('SELECT id FROM candidate_profiles WHERE user_id = ?', [uId]);
        if (existing.length === 0) {
          await pool.query(
            `INSERT INTO candidate_profiles (user_id, headline, bio, location, experience_level, primary_skills, education)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              uId,
              cp.headline || 'Full-Stack Developer',
              cp.bio || '',
              cp.location || '',
              mapExperienceLevel(cp.experienceLevel),
              JSON.stringify(cp.primarySkills || []),
              JSON.stringify(cp.education || []),
            ]
          );
        }
      }
    }

    // 3. Sync Recruiter Profiles
    const recruiters = await RecruiterProfile.find().populate('user');
    for (const rp of recruiters) {
      if (!rp.user) continue;
      const [uRows] = await pool.query('SELECT id FROM users WHERE email = ?', [rp.user.email]);
      if (uRows.length > 0) {
        const uId = uRows[0].id;
        const [existing] = await pool.query('SELECT id FROM recruiter_profiles WHERE user_id = ?', [uId]);
        if (existing.length === 0) {
          await pool.query(
            `INSERT INTO recruiter_profiles (user_id, company_name, company_website, company_description, industry, verification_status)
             VALUES (?, ?, ?, ?, ?, 'verified')`,
            [uId, rp.companyName || 'Tech Corp', rp.companyWebsite || '', rp.companyDescription || '', rp.industry || 'Technology']
          );
        }
      }
    }

    // 4. Sync Resumes
    const resumes = await Resume.find().populate('user');
    for (const r of resumes) {
      if (!r.user) continue;
      const [uRows] = await pool.query('SELECT id FROM users WHERE email = ?', [r.user.email]);
      if (uRows.length > 0) {
        const uId = uRows[0].id;
        const [existing] = await pool.query('SELECT id FROM resumes WHERE candidate_id = ? AND file_name = ?', [uId, r.fileName]);
        if (existing.length === 0) {
          await pool.query(
            `INSERT INTO resumes (candidate_id, file_name, file_url, file_size, file_type, raw_text, parsed_data, completeness_score, is_primary)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [
              uId,
              r.fileName || 'Resume.pdf',
              r.filePath || '',
              r.fileSize || 0,
              r.fileType || 'pdf',
              (r.rawText || '').slice(0, 65000),
              JSON.stringify(r.parsedData || {}),
              r.completenessScore || 85,
            ]
          );
        }
      }
    }

    const [userCount] = await pool.query('SELECT COUNT(*) AS c FROM users');
    console.log(`[MySQL Sync] Sync completed! Total users in XAMPP MySQL JOB_AI: ${userCount[0].c}`);
  } catch (err) {
    console.error(`[MySQL Sync Error - Bulk] ${err.message}`);
  }
};

module.exports = {
  getOrCreateMySQLUserId,
  syncUserRegistration,
  syncUserLogin,
  syncResumeUpload,
  syncAllExistingMongoData,
};
