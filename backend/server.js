const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const { testMySQLConnection, getMySQLPool } = require('./config/mysql');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobRoutes = require('./routes/jobRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Connect to Databases (MongoDB + MySQL XAMPP)
connectDB();
testMySQLConnection();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost',
  'http://127.0.0.1',
  'http://localhost:80',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://tech-venu.github.io',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      // or from explicit origins, or any local XAMPP / Apache / development origin
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests created from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// Serve uploaded files securely
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// Health Check API
app.get('/api/health', async (req, res) => {
  const mysqlStatus = await testMySQLConnection();
  res.status(200).json({
    status: 'healthy',
    application: 'VJOBAI Backend by Venu',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    databases: {
      mongodb: 'Connected (hirematch_ai)',
      mysql: mysqlStatus.connected ? `Connected (${mysqlStatus.database} via XAMPP phpMyAdmin)` : 'Optional',
    },
  });
});

// Live MySQL phpMyAdmin Database Stats Endpoint
app.get('/api/database/mysql-stats', async (req, res) => {
  try {
    const pool = getMySQLPool();
    const [tables] = await pool.query('SHOW TABLES');
    const [userCount] = await pool.query('SELECT COUNT(*) AS count FROM users');
    const [jobCount] = await pool.query('SELECT COUNT(*) AS count FROM jobs');
    const [appCount] = await pool.query('SELECT COUNT(*) AS count FROM applications');
    const [profileCount] = await pool.query('SELECT COUNT(*) AS count FROM candidate_profiles');
    res.json({
      success: true,
      database: 'JOB_AI',
      connection: 'MySQL / MariaDB via XAMPP phpMyAdmin (Port 3306)',
      tables: tables.map((t) => Object.values(t)[0]),
      counts: {
        users: userCount[0].count,
        jobs: jobCount[0].count,
        applications: appCount[0].count,
        candidateProfiles: profileCount[0].count,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 Route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Export app for automated testing (Supertest)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[VJOBAI] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;

