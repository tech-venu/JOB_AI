const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const {
  User,
  CandidateProfile,
  RecruiterProfile,
  Job,
  Application,
  Skill,
  ActivityLog,
} = require('../models');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hirematch_ai';
    console.log(`Connecting to MongoDB for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing HireMatch AI demo collections...');
    await User.deleteMany({});
    await CandidateProfile.deleteMany({});
    await RecruiterProfile.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Skill.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('Creating Users...');

    // 1. Super Admin
    const adminUser = await User.create({
      name: 'HireMatch Administrator',
      email: 'admin@hirematch.ai',
      password: 'AdminPassword123!',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      isVerified: true,
      status: 'active',
    });

    // 2. Recruiter 1 - Google
    const recruiterGoogle = await User.create({
      name: 'Alex Rivera',
      email: 'recruiter@google.com',
      password: 'RecruiterPassword123!',
      role: 'recruiter',
      phone: '+1 (650) 253-0000',
      isVerified: true,
      status: 'active',
    });

    await RecruiterProfile.create({
      user: recruiterGoogle._id,
      companyName: 'Google Cloud Platform',
      companyWebsite: 'https://cloud.google.com',
      companyDescription:
        'Google Cloud accelerates organizations ability to digitally transform their business with best-in-class infrastructure and AI solutions.',
      industry: 'Cloud Computing & AI',
      companySize: '1000+',
      location: 'Mountain View, CA (Hybrid / Remote)',
      verificationStatus: 'verified',
      verifiedAt: new Date(),
    });

    // 3. Recruiter 2 - Microsoft
    const recruiterMicrosoft = await User.create({
      name: 'Elena Rostova',
      email: 'recruiter@microsoft.com',
      password: 'RecruiterPassword123!',
      role: 'recruiter',
      phone: '+1 (425) 882-8080',
      isVerified: true,
      status: 'active',
    });

    await RecruiterProfile.create({
      user: recruiterMicrosoft._id,
      companyName: 'Microsoft Corporation',
      companyWebsite: 'https://microsoft.com',
      companyDescription:
        'Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.',
      industry: 'Enterprise Software & Cloud',
      companySize: '1000+',
      location: 'Redmond, WA (Remote available)',
      verificationStatus: 'verified',
      verifiedAt: new Date(),
    });

    // 4. Candidate 1 - Full Stack Developer (Job Seeker)
    const candidateFullStack = await User.create({
      name: 'Venu Gopal',
      email: 'venu@example.com',
      password: 'CandidatePassword123!',
      role: 'jobseeker',
      phone: '+91 98765 43210',
      isVerified: true,
      status: 'active',
    });

    await CandidateProfile.create({
      user: candidateFullStack._id,
      headline: 'Full-Stack Developer | React, Node.js, MongoDB & Cloud Architecture',
      bio: 'Enthusiastic software engineer with experience building full-stack web applications, RESTful APIs, and implementing AI-assisted matching workflows.',
      location: 'Bengaluru, India (Open to Remote)',
      experienceLevel: 'entry',
      totalYearsExperience: 2,
      primarySkills: ['react', 'node.js', 'mongodb', 'javascript', 'express', 'git', 'sql'],
      secondarySkills: ['docker', 'tailwind', 'python'],
      education: [
        {
          degree: 'Master of Computer Applications (MCA)',
          institution: 'Apex Institute of Technology',
          fieldOfStudy: 'Computer Applications & Software Engineering',
          startYear: 2024,
          endYear: 2026,
          grade: '8.8 CGPA',
        },
      ],
      experience: [
        {
          title: 'Associate Full-Stack Developer Intern',
          company: 'Nexus Infotech Solutions',
          location: 'Bengaluru',
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-07-01'),
          isCurrent: false,
          description:
            'Developed high-performance React UI components, integrated Express backend APIs, and optimized MongoDB database queries.',
        },
      ],
      expectedSalary: { min: 65000, max: 95000, currency: 'USD' },
    });

    // 5. Candidate 2 - AI/ML Engineer
    const candidateAI = await User.create({
      name: 'Sophia Chen',
      email: 'sophia@example.com',
      password: 'CandidatePassword123!',
      role: 'jobseeker',
      phone: '+1 (415) 555-8921',
      isVerified: true,
      status: 'active',
    });

    await CandidateProfile.create({
      user: candidateAI._id,
      headline: 'AI/ML Engineer | Python, TensorFlow, NLP & LLM Applications',
      bio: 'Machine learning practitioner specializing in Natural Language Processing, information extraction, and generative AI systems.',
      location: 'San Francisco, CA',
      experienceLevel: 'mid',
      totalYearsExperience: 3,
      primarySkills: ['python', 'machine learning', 'natural language processing', 'tensorflow', 'pytorch', 'sql'],
      secondarySkills: ['docker', 'fastapi', 'git'],
      education: [
        {
          degree: 'M.S. in Computer Science',
          institution: 'University of California, Berkeley',
          fieldOfStudy: 'Artificial Intelligence',
          startYear: 2022,
          endYear: 2024,
          grade: '3.9 GPA',
        },
      ],
      expectedSalary: { min: 110000, max: 150000, currency: 'USD' },
    });

    console.log('Creating Jobs...');

    const job1 = await Job.create({
      title: 'Senior Full-Stack Engineer (MERN)',
      company: 'Google Cloud Platform',
      recruiter: recruiterGoogle._id,
      description:
        'We are seeking an experienced Full-Stack Engineer to build scalable developer consoles and cloud management dashboards. You will architect robust REST/GraphQL APIs, craft intuitive React user interfaces, and collaborate with globally distributed engineering teams.',
      requiredSkills: ['react', 'node.js', 'mongodb', 'javascript', 'docker'],
      preferredSkills: ['typescript', 'kubernetes', 'cloud'],
      qualification: "Bachelor's or Master's degree in Computer Science or related field",
      experienceMin: 2,
      experienceMax: 6,
      salaryMin: 90000,
      salaryMax: 135000,
      currency: 'USD',
      location: 'San Francisco, CA (Hybrid / Remote)',
      employmentType: 'Full-time',
      workplaceType: 'hybrid',
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      applicantsCount: 1,
    });

    const job2 = await Job.create({
      title: 'Frontend React Developer',
      company: 'Microsoft Corporation',
      recruiter: recruiterMicrosoft._id,
      description:
        'Join the Microsoft 365 developer productivity team. We are looking for a passionate Frontend Engineer proficient in React, modern JavaScript/TypeScript, and responsive web performance optimization.',
      requiredSkills: ['react', 'javascript', 'html', 'css', 'tailwind'],
      preferredSkills: ['typescript', 'redux', 'jest'],
      qualification: "Bachelor's Degree in Computer Science / IT / BCA / MCA",
      experienceMin: 1,
      experienceMax: 4,
      salaryMin: 75000,
      salaryMax: 110000,
      currency: 'USD',
      location: 'Redmond, WA (Remote Eligible)',
      employmentType: 'Full-time',
      workplaceType: 'remote',
      applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'active',
      applicantsCount: 1,
    });

    const job3 = await Job.create({
      title: 'AI/ML & NLP Research Engineer',
      company: 'Google Cloud Platform',
      recruiter: recruiterGoogle._id,
      description:
        'Help develop next-generation semantic search and recommendation systems. You will train custom NLP models, implement vector retrieval pipelines, and productionize machine learning workflows.',
      requiredSkills: ['python', 'machine learning', 'natural language processing', 'sql'],
      preferredSkills: ['pytorch', 'tensorflow', 'docker'],
      qualification: "Master's Degree in Computer Science, Data Science, or AI",
      experienceMin: 2,
      experienceMax: 5,
      salaryMin: 120000,
      salaryMax: 165000,
      currency: 'USD',
      location: 'Mountain View, CA',
      employmentType: 'Full-time',
      workplaceType: 'on-site',
      applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active',
      applicantsCount: 1,
    });

    const job4 = await Job.create({
      title: 'Software Engineering Intern (Summer 2026)',
      company: 'Microsoft Corporation',
      recruiter: recruiterMicrosoft._id,
      description:
        'Exciting paid internship opportunity for undergraduate and graduate students in Computer Science, MCA, or software engineering. Learn industry-standard development workflows, participate in code reviews, and ship real-world customer features.',
      requiredSkills: ['javascript', 'python', 'sql', 'git'],
      preferredSkills: ['react', 'node.js'],
      qualification: 'Currently enrolled in BCA, B.Tech, MCA, or M.Tech degree',
      experienceMin: 0,
      experienceMax: 1,
      salaryMin: 45000,
      salaryMax: 65000,
      currency: 'USD',
      location: 'Bengaluru / Remote',
      employmentType: 'Internship',
      workplaceType: 'remote',
      applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'active',
      applicantsCount: 0,
    });

    console.log('Creating Applications with AI Match Scores...');

    // Application 1: Venu applied to Job 1 (Senior Full-Stack Engineer)
    await Application.create({
      job: job1._id,
      candidate: candidateFullStack._id,
      coverLetter:
        'I am excited to apply for the Full-Stack Engineer position. With strong hands-on experience in React, Node.js, Express, and MongoDB, along with active experience deploying containerized microservices, I am confident in delivering high impact.',
      matchScore: 88,
      matchBreakdown: {
        technicalSkillMatch: 92,
        experienceMatch: 85,
        educationMatch: 95,
        keywordMatch: 80,
        matchingSkills: ['react', 'node.js', 'mongodb', 'javascript', 'git'],
        missingSkills: ['docker'],
        reason:
          'Strong overlap in 4 essential skills: react, node.js, mongodb, javascript. Experience level matches 2-6 years criteria. Master of Computer Applications matches target qualification.',
      },
      status: 'shortlisted',
      statusHistory: [
        {
          status: 'applied',
          comment: 'Application submitted online.',
          changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          changedBy: candidateFullStack._id,
        },
        {
          status: 'under_review',
          comment: 'Profile reviewed by Google talent acquisition team.',
          changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          changedBy: recruiterGoogle._id,
        },
        {
          status: 'shortlisted',
          comment: 'Candidate shortlisted for technical screening round.',
          changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          changedBy: recruiterGoogle._id,
        },
      ],
      recruiterNotes: 'Impressive full stack fundamentals and MCA project portfolio. Scheduled for Round 1.',
    });

    // Application 2: Sophia applied to Job 3 (AI/ML Engineer)
    await Application.create({
      job: job3._id,
      candidate: candidateAI._id,
      coverLetter:
        'With a specialized M.S. in Computer Science and rigorous focus on NLP and semantic search architectures, I am eager to contribute to the Google Cloud AI/ML team.',
      matchScore: 94,
      matchBreakdown: {
        technicalSkillMatch: 95,
        experienceMatch: 90,
        educationMatch: 100,
        keywordMatch: 92,
        matchingSkills: ['python', 'machine learning', 'natural language processing', 'sql', 'pytorch'],
        missingSkills: [],
        reason:
          'Exceptional match across all technical requirements and qualifications. M.S. degree directly aligns with job profile.',
      },
      status: 'interview_scheduled',
      statusHistory: [
        {
          status: 'applied',
          comment: 'Application received.',
          changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          changedBy: candidateAI._id,
        },
        {
          status: 'shortlisted',
          comment: 'Candidate verified for exceptional ML track record.',
          changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          changedBy: recruiterGoogle._id,
        },
        {
          status: 'interview_scheduled',
          comment: 'Technical Architecture Interview scheduled with Principal AI Engineer.',
          changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          changedBy: recruiterGoogle._id,
        },
      ],
      recruiterNotes: 'Top 5% candidate match. Fast-track to interview.',
    });

    // Application 3: Venu applied to Job 2 (Frontend React Developer)
    await Application.create({
      job: job2._id,
      candidate: candidateFullStack._id,
      coverLetter:
        'Passionate about UI/UX performance, component architecture, and modern React development at Microsoft.',
      matchScore: 82,
      matchBreakdown: {
        technicalSkillMatch: 85,
        experienceMatch: 90,
        educationMatch: 85,
        keywordMatch: 75,
        matchingSkills: ['react', 'javascript', 'html', 'css'],
        missingSkills: ['tailwind'],
        reason: 'Solid frontend competencies and relevant degree background.',
      },
      status: 'under_review',
      statusHistory: [
        {
          status: 'applied',
          comment: 'Application submitted.',
          changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          changedBy: candidateFullStack._id,
        },
        {
          status: 'under_review',
          comment: 'Application under review by Microsoft recruiter.',
          changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          changedBy: recruiterMicrosoft._id,
        },
      ],
    });

    console.log('Seeding initial skills dictionary...');
    const sampleSkills = [
      { name: 'react', category: 'frontend', aliases: ['react.js', 'reactjs'], popularity: 98 },
      { name: 'node.js', category: 'backend', aliases: ['nodejs', 'node'], popularity: 95 },
      { name: 'mongodb', category: 'database', aliases: ['mongo', 'mongoose'], popularity: 90 },
      { name: 'python', category: 'programming_language', aliases: ['py'], popularity: 97 },
      { name: 'javascript', category: 'programming_language', aliases: ['js'], popularity: 99 },
      { name: 'machine learning', category: 'ai_ml', aliases: ['ml'], popularity: 88 },
      { name: 'docker', category: 'devops', aliases: ['containers'], popularity: 85 },
      { name: 'sql', category: 'database', aliases: ['mysql', 'postgres'], popularity: 92 },
    ];
    await Skill.insertMany(sampleSkills);

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log(`
      Demo Login Credentials:
      ======================================================
      SUPER ADMIN:
        Email:    admin@hirematch.ai
        Password: AdminPassword123!

      RECRUITER 1 (Google Cloud):
        Email:    recruiter@google.com
        Password: RecruiterPassword123!

      RECRUITER 2 (Microsoft):
        Email:    recruiter@microsoft.com
        Password: RecruiterPassword123!

      JOB SEEKER 1 (Full Stack Candidate):
        Email:    venu@example.com
        Password: CandidatePassword123!

      JOB SEEKER 2 (AI/ML Candidate):
        Email:    sophia@example.com
        Password: CandidatePassword123!
      ======================================================
    `);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
