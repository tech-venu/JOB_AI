const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { calculateJobCompatibility } = require('../services/recommendation/matchingEngine');
const { analyzeSkillGap } = require('../services/recommendation/skillGapAnalyzer');
const { extractSkills } = require('../services/resume/resumeParser');

describe('HireMatch AI - Comprehensive Backend & AI Unit Tests', () => {
  beforeAll(async () => {
    // Ensure DB is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hirematch_ai');
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    try {
      const { getMySQLPool } = require('../config/mysql');
      const pool = getMySQLPool();
      if (pool) await pool.end();
    } catch (e) {}
  });

  describe('1. Health Check & Public Endpoints', () => {
    it('GET /api/health should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.application).toBe('VJOBAI Backend by Venu');
    });

    it('GET /api/jobs should return a paginated list of active jobs', async () => {
      const res = await request(app).get('/api/jobs');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toHaveProperty('total');
    });

    it('GET /api/jobs with search query should filter results', async () => {
      const res = await request(app).get('/api/jobs?search=Google');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('2. Authentication & Authorization Security', () => {
    const testCandidateEmail = `test.user.${Date.now()}@example.com`;

    it('POST /api/auth/register should successfully register a new job seeker', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Automated Test Candidate',
        email: testCandidateEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'jobseeker',
        primarySkills: 'react, node.js, mongodb',
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testCandidateEmail);
    });

    it('POST /api/auth/register should reject duplicate email', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Duplicate User',
        email: testCandidateEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'jobseeker',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/register should forbid self-registration as admin', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Fake Admin',
        email: `fake.admin.${Date.now()}@example.com`,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'admin',
      });
      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/login should authenticate valid candidate and return JWT', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'venu@example.com',
        password: 'CandidatePassword123!',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.role).toBe('jobseeker');
    });

    it('POST /api/auth/login should reject invalid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'venu@example.com',
        password: 'WrongPassword999!',
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/auth/me should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('3. AI Engine: NLP, Skill Extraction & Matching', () => {
    it('should accurately extract technical and soft skills from resume text', () => {
      const sampleResumeText = `
        Experienced Full-Stack Engineer with 3+ years building responsive SPAs using React.js and Tailwind CSS.
        Proficient in Node.js, Express, MongoDB, Docker containerization, and AWS Lambda microservices.
        Possesses strong analytical problem solving and leadership capabilities.
      `;

      const { technicalSkills, softSkills } = extractSkills(sampleResumeText);

      expect(technicalSkills).toContain('react');
      expect(technicalSkills).toContain('node.js');
      expect(technicalSkills).toContain('mongodb');
      expect(technicalSkills).toContain('docker');
      expect(technicalSkills).toContain('aws');
      expect(softSkills).toContain('problem solving');
      expect(softSkills).toContain('leadership');
    });

    it('should compute weighted compatibility score between resume and job description', () => {
      const candidateData = {
        technicalSkills: ['react', 'node.js', 'mongodb', 'javascript'],
        skills: ['react', 'node.js', 'mongodb'],
        totalYearsExperience: 3,
        education: [{ degree: 'Master of Computer Applications (MCA)' }],
        rawText: 'React developer proficient in Node.js, Express, and MongoDB database architecture.',
      };

      const jobData = {
        title: 'Senior MERN Developer',
        description: 'Looking for a senior MERN developer with React, Node.js, and MongoDB experience.',
        requiredSkills: ['react', 'node.js', 'mongodb'],
        preferredSkills: ['docker'],
        experienceMin: 2,
        experienceMax: 5,
        qualification: 'Bachelor or Master in Computer Science',
      };

      const result = calculateJobCompatibility(candidateData, jobData);

      expect(result).toHaveProperty('overallScore');
      expect(result.overallScore).toBeGreaterThanOrEqual(75);
      expect(result.breakdown.matchingSkills).toContain('react');
      expect(result.breakdown.matchingSkills).toContain('node.js');
      expect(result.breakdown.matchingSkills).toContain('mongodb');
      expect(result.disclaimer).toBeDefined();
    });

    it('should analyze skill gaps and produce customized learning roadmap', () => {
      const candidateSkills = ['Python', 'SQL', 'HTML', 'CSS', 'JavaScript'];
      const requiredSkills = ['Python', 'SQL', 'React', 'Node.js', 'MongoDB'];

      const gapResult = analyzeSkillGap(candidateSkills, requiredSkills);

      expect(gapResult.matchPercentage).toBe(40);
      expect(gapResult.matchedSkills).toEqual(expect.arrayContaining(['python', 'sql']));
      expect(gapResult.missingSkills).toEqual(expect.arrayContaining(['react', 'node.js', 'mongodb']));
      expect(gapResult.learningRoadmaps.length).toBe(3);
      expect(gapResult.learningRoadmaps[0]).toHaveProperty('topics');
      expect(gapResult.learningRoadmaps[0]).toHaveProperty('resources');
    });
  });

  describe('4. Recruiter & Admin Operations', () => {
    let recruiterToken;
    let adminToken;

    beforeAll(async () => {
      // Recruiter login
      const recLogin = await request(app).post('/api/auth/login').send({
        email: 'recruiter@google.com',
        password: 'RecruiterPassword123!',
      });
      recruiterToken = recLogin.body.data.token;

      // Admin login
      const admLogin = await request(app).post('/api/auth/login').send({
        email: 'admin@hirematch.ai',
        password: 'AdminPassword123!',
      });
      adminToken = admLogin.body.data.token;
    });

    it('GET /api/recruiters/dashboard should return metrics for authenticated recruiter', async () => {
      const res = await request(app)
        .get('/api/recruiters/dashboard')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('overview');
      expect(res.body.data).toHaveProperty('scoreBuckets');
    });

    it('GET /api/admin/dashboard should return platform-wide statistics for super admin', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stats).toHaveProperty('totalUsers');
      expect(res.body.data.stats).toHaveProperty('totalJobs');
    });

    it('GET /api/admin/dashboard should deny non-admin access', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});

