/**
 * Skill Gap Analyzer with Curated Learning Roadmaps
 */

const LEARNING_ROADMAP_DATABASE = {
  react: {
    skill: 'React.js',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    prerequisites: ['JavaScript ES6+', 'HTML5', 'CSS3'],
    topics: [
      'Component Lifecycle & Functional Components',
      'Hooks (useState, useEffect, useMemo, useCallback)',
      'State Management (Context API / Redux Toolkit)',
      'Routing with React Router v6',
      'Data Fetching and Performance Optimization',
    ],
    resources: [
      { title: 'Official React Documentation', url: 'https://react.dev' },
      { title: 'Full Stack Open - Modern React', url: 'https://fullstackopen.com' },
    ],
  },
  'node.js': {
    skill: 'Node.js & Express',
    difficulty: 'Intermediate',
    estimatedWeeks: 3,
    prerequisites: ['JavaScript', 'Asynchronous Programming'],
    topics: [
      'Event Loop & Non-blocking I/O',
      'Express Routing & RESTful API Architecture',
      'Middleware, Error Handling & Security Headers',
      'Authentication with JWT and bcrypt',
      'Database integration with Mongoose / PostgreSQL',
    ],
    resources: [
      { title: 'Node.js Official Guides', url: 'https://nodejs.org/en/docs' },
      { title: 'MDN Express Web Framework', url: 'https://developer.mozilla.org' },
    ],
  },
  mongodb: {
    skill: 'MongoDB & Mongoose',
    difficulty: 'Beginner to Intermediate',
    estimatedWeeks: 2,
    prerequisites: ['Basic Database Concepts', 'JSON'],
    topics: [
      'Document Schema Design & Relationships',
      'CRUD Operations & Query Operators',
      'Aggregation Pipeline (match, group, lookup)',
      'Indexing and Performance Optimization',
      'Transactions and ACID compliance',
    ],
    resources: [
      { title: 'MongoDB University Courses', url: 'https://learn.mongodb.com' },
    ],
  },
  docker: {
    skill: 'Docker & Containerization',
    difficulty: 'Intermediate',
    estimatedWeeks: 2,
    prerequisites: ['Linux Basics', 'Command Line'],
    topics: [
      'Containers vs Virtual Machines',
      'Writing Production Dockerfiles',
      'Multi-stage Builds and Image Optimization',
      'Docker Compose for Multi-container Apps',
      'Networking and Volume Persistence',
    ],
    resources: [
      { title: 'Docker Official Get Started', url: 'https://docs.docker.com/get-started/' },
    ],
  },
  kubernetes: {
    skill: 'Kubernetes (K8s)',
    difficulty: 'Advanced',
    estimatedWeeks: 4,
    prerequisites: ['Docker', 'Networking'],
    topics: [
      'Pods, Deployments, and Services',
      'ConfigMaps and Secrets Management',
      'Ingress Controllers & Load Balancing',
      'Persistent Volumes & StatefulSets',
      'Helm Charts and CI/CD Deployment',
    ],
    resources: [
      { title: 'Kubernetes Official Tutorials', url: 'https://kubernetes.io/docs/tutorials/' },
    ],
  },
  aws: {
    skill: 'Amazon Web Services (AWS)',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    prerequisites: ['Cloud Fundamentals'],
    topics: [
      'EC2, S3, and VPC Networking',
      'IAM Roles and Security Policies',
      'Serverless computing with AWS Lambda & API Gateway',
      'RDS and DynamoDB Managed Databases',
      'Monitoring with CloudWatch',
    ],
    resources: [
      { title: 'AWS Skill Builder', url: 'https://explore.skillbuilder.aws' },
    ],
  },
  python: {
    skill: 'Python for Backend / Data Science',
    difficulty: 'Beginner to Intermediate',
    estimatedWeeks: 3,
    prerequisites: ['Basic Programming Logic'],
    topics: [
      'OOP in Python, Iterators, and Generators',
      'Data Structures and Algorithms in Python',
      'FastAPI or Django for Web Services',
      'NumPy and Pandas for Data Manipulation',
    ],
    resources: [
      { title: 'Python Official Docs', url: 'https://docs.python.org/3/' },
    ],
  },
  'machine learning': {
    skill: 'Machine Learning Fundamentals',
    difficulty: 'Intermediate to Advanced',
    estimatedWeeks: 6,
    prerequisites: ['Python', 'Linear Algebra', 'Calculus'],
    topics: [
      'Supervised vs Unsupervised Learning',
      'Regression, Classification, and Clustering',
      'Scikit-Learn Pipeline and Model Evaluation',
      'Feature Engineering & Cross Validation',
      'Model Deployment with FastAPI or Docker',
    ],
    resources: [
      { title: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course' },
    ],
  },
  sql: {
    skill: 'SQL & Relational Database Design',
    difficulty: 'Beginner',
    estimatedWeeks: 2,
    prerequisites: ['Basic data concepts'],
    topics: [
      'DDL, DML, and Complex Joins (Inner, Left, Cross)',
      'Subqueries, CTEs, and Window Functions',
      'Normalization (1NF, 2NF, 3NF, BCNF)',
      'Query Optimization and Execution Plans',
    ],
    resources: [
      { title: 'SQLZoo Interactive Tutorials', url: 'https://sqlzoo.net' },
    ],
  },
};

/**
 * Generate generic roadmap for skills not in the database
 */
const generateGenericRoadmap = (skillName) => {
  return {
    skill: skillName.toUpperCase(),
    difficulty: 'Intermediate',
    estimatedWeeks: 2,
    prerequisites: ['Core computer science fundamentals'],
    topics: [
      `Core Architecture and Syntax of ${skillName}`,
      `Industry Best Practices and Design Patterns in ${skillName}`,
      `Building a Hands-on Production Project with ${skillName}`,
      `Integration with existing frontend/backend workflows`,
    ],
    resources: [
      { title: `${skillName} Official Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official documentation')}` },
      { title: `${skillName} Best Practices Guide`, url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' tutorial course')}` },
    ],
  };
};

/**
 * Analyze skill gap between candidate skills and required skills
 */
const analyzeSkillGap = (candidateSkills = [], targetSkills = []) => {
  const normalizedCandidate = candidateSkills.map((s) => s.toLowerCase().trim()).filter(Boolean);
  const normalizedTarget = targetSkills.map((s) => s.toLowerCase().trim()).filter(Boolean);

  const matchedSkills = [];
  const missingSkills = [];

  normalizedTarget.forEach((targetSkill) => {
    const isMatched = normalizedCandidate.some(
      (candSkill) => candSkill.includes(targetSkill) || targetSkill.includes(candSkill)
    );
    if (isMatched) {
      matchedSkills.push(targetSkill);
    } else {
      missingSkills.push(targetSkill);
    }
  });

  const total = normalizedTarget.length;
  const matchPercentage = total > 0 ? Math.round((matchedSkills.length / total) * 100) : 100;

  // Generate learning roadmaps for missing skills
  const learningRoadmaps = missingSkills.map((missingSkill) => {
    const key = Object.keys(LEARNING_ROADMAP_DATABASE).find(
      (k) => missingSkill.includes(k) || k.includes(missingSkill)
    );
    if (key) {
      return LEARNING_ROADMAP_DATABASE[key];
    }
    return generateGenericRoadmap(missingSkill);
  });

  return {
    totalRequired: total,
    existingSkills: normalizedCandidate,
    matchedSkills,
    missingSkills,
    matchPercentage,
    learningRoadmaps,
    recommendationSummary:
      missingSkills.length === 0
        ? 'Outstanding! You possess all required technical skills for this role.'
        : `You match ${matchPercentage}% of the required skills. Mastering the ${missingSkills.length} missing skill(s) will maximize your interview shortlist probability.`,
  };
};

module.exports = {
  analyzeSkillGap,
  LEARNING_ROADMAP_DATABASE,
};

