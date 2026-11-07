# HireMatch AI – Intelligent Resume Screening & Job Recommendation System

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-emerald.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-sky.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-15%20Passed-brightgreen.svg)]()

> **Tagline:** "Your Skills. Your Career. Your Perfect Match."  
> **Degree Program:** MCA Major Project  
> **Author & Repository:** [tech-venu/hirematch-ai](https://github.com/tech-venu)

---

## 1. Project Introduction & Problem Statement

Modern recruitment processes are hindered by high applicant volumes, slow resume screening cycles, and opaque hiring criteria. Job seekers struggle to identify why they fail automated Applicant Tracking Systems (ATS) or which technical skills they need to acquire.

**HireMatch AI** solves this problem by delivering an integrated, transparent recruitment platform connecting **Job Seekers**, **Recruiters**, and **Super Administrators**. It automates resume entity extraction (PDF/DOCX), performs explainable TF-IDF cosine similarity job matching, highlights precise skill gaps with week-by-week learning roadmaps, and provides automated AI candidate ranking for hiring teams.

---

## 2. Key Features

### 🤖 8 Advanced AI & NLP Capabilities
1. **Intelligent Resume Analyzer**: Extracts candidate name, email, phone, location, education degrees (MCA, B.Tech), technical skills, soft skills, and projects from PDF and DOCX files. Includes manual correction capability to adjust auto-parsed data.
2. **AI Compatibility Match Engine**: Calculates explainable 0–100 compatibility scores using a weighted scoring model:
   - Technical Skill Match: 45%
   - Experience Alignment: 25%
   - TF-IDF Keyword Cosine Similarity: 15%
   - Qualification Background: 15%
3. **Intelligent Job Recommendations**: Categorizes opportunities into *Best Matches* (≥65%), *Recommended Roles*, *Remote Opportunities*, and *Internships*.
4. **Skill Gap Analyzer**: Compares candidate competencies against target job requirements, revealing missing requirements and providing curated learning roadmaps with official documentation links.
5. **AI-Powered Resume Improvement Assistant**: Scans uploaded resumes for missing sections, weak phrasing, and lack of quantifiable metrics without hallucinating false credentials.
6. **Recruiter AI Candidate Ranking**: Ranks applicants for any job posting automatically with full score transparency, skill breakdown, and human-in-the-loop shortlist/interview scheduling controls.
7. **AI Career Assistant**: Interactive career chat assistant providing guidance on resume enhancement, interview preparation, and salary negotiation (with local fallback and optional LLM provider adapter).
8. **6-Stage Application Tracking System (ATS)**: Complete lifecycle auditing: `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Selected` ➔ `Rejected`.

---

## 3. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons, Recharts, Axios, React Router DOM v6.
- **Backend**: Node.js, Express.js, REST API architecture, JWT authentication, bcryptjs password hashing, Multer file handling, Helmet security headers, Express-rate-limit.
- **Database**: MongoDB & Mongoose ODM with 12 normalized models, references, unique constraints, and search indexes.
- **AI & NLP**: `pdf2json`, `mammoth`, TF-IDF vectorizer, Cosine Similarity mathematical algorithms, skill taxonomy dictionary.
- **Testing & Quality**: Jest and Supertest automated test suites.

---

## 4. System Architecture Diagram

```
+-------------------------------------------------------------+
|                  React 18 + Vite Frontend                   |
|   (Responsive SaaS UI, Dark/Light Themes, Recharts, Lucide) |
+-------------------------------------------------------------+
                              |
                     HTTPS / JSON REST API
                              |
+-------------------------------------------------------------+
|               Node.js + Express.js Backend Server           |
|   (JWT Auth Middleware, RBAC Guard, Error Handler, Helmet)  |
+-------------------------------------------------------------+
       |                       |                      |
       v                       v                      v
+--------------+     +-------------------+   +----------------+
| Uploads Disk |     |  MongoDB Database |   | NLP & Matching |
| Storage      |     |  (12 Collections) |   | Engine Service |
+--------------+     +-------------------+   +----------------+
```

---

## 5. Local Installation & Execution Guide

### Prerequisites
- Node.js v18+ or v20+
- npm v9+
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### Step 1: Clone Repository
```bash
git clone https://github.com/tech-venu/hirematch-ai.git
cd hirematch-ai
```

### Step 2: Configure Backend Environment
```bash
cd backend
cp ../.env.example .env
```
Ensure your `.env` contains:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/hirematch_ai
JWT_SECRET=hirematch_super_secure_jwt_secret_key_2026_mca_project_key
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
AI_PROVIDER=none
AI_API_KEY=
```

### Step 3: Install Dependencies & Seed Database
```bash
# In backend/
npm install
npm run seed
```

### Step 4: Run Backend Tests
```bash
npm test
```
*(All 15 automated unit & integration tests will execute and pass)*

### Step 5: Start Backend Server
```bash
npm run dev
# Server will run on http://localhost:5000
```

### Step 6: Setup & Start Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 6. Pre-Configured Demo Credentials

The seeded environment includes pre-configured accounts for testing each role:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@hirematch.ai` | `AdminPassword123!` | Full platform administration & moderation |
| **Recruiter (Google Cloud)** | `recruiter@google.com` | `RecruiterPassword123!` | Job creator & candidate evaluation |
| **Recruiter (Microsoft)** | `recruiter@microsoft.com` | `RecruiterPassword123!` | Active job postings & applicants |
| **Job Seeker (Candidate)** | `venu@example.com` | `CandidatePassword123!` | MCA Graduate, MERN full-stack profile |
| **Job Seeker (AI/ML)** | `sophia@example.com` | `CandidatePassword123!` | M.S. in AI/ML candidate profile |

> **Evaluator Tip:** The login page includes 1-click demo login buttons to instantly sign in to any of these roles!

---

## 7. Cloud Deployment Configuration

### Frontend Deployment (Vercel)
1. Push repository to GitHub.
2. Connect repository to [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.
5. Set Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api`.
6. SPA routing rewrite is pre-configured in `frontend/vercel.json`.

### Backend Deployment (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `backend`.
3. Set Build Command: `npm install` and Start Command: `npm start`.
4. Add Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `CLIENT_URL=https://your-frontend.vercel.app`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hirematch_ai`
   - `JWT_SECRET=<your-random-32-char-secret>`

---

## 8. Academic Integrity & Ethics

HireMatch AI adheres strictly to fair recruitment principles. The matching algorithm explicitly excludes protected attributes such as age, gender, race, disability, and religion from candidate scoring. All match scores include transparent explanations of technical skill and experience criteria.

---

## 9. License

This project is licensed under the ISC License. Developed for MCA Major Project requirements.
