# HireMatch AI – REST API Documentation

This document provides complete endpoint specifications for the HireMatch AI Backend API.

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://hirematch-ai-backend.onrender.com/api`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Register a new Job Seeker or Recruiter account.
*(Administrative accounts cannot be self-registered)*

**Request Body:**
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "jobseeker", // "jobseeker" | "recruiter"
  "phone": "+1 555-0199",
  "location": "San Francisco, CA",
  "education": "Master of Computer Applications (MCA)",
  "experienceLevel": "entry",
  "primarySkills": "react, node.js, mongodb, javascript"
}
```

### `POST /api/auth/login`
Authenticate credentials and return JWT bearer token.

**Request Body:**
```json
{
  "email": "alex@example.com",
  "password": "Password123!"
}
```

### `GET /api/auth/me`
Retrieve currently authenticated user and associated profile.
**Header:** `Authorization: Bearer <token>`

---

## 2. Resumes (`/api/resumes`)

### `POST /api/resumes/upload`
Upload and extract entities from a PDF or DOCX resume.
**Content-Type:** `multipart/form-data`
**Field:** `resume: [binary]`

### `GET /api/resumes`
List all resumes owned by the authenticated candidate.

### `GET /api/resumes/:id`
Fetch single parsed resume details with quality analysis report.

### `PUT /api/resumes/:id/parsed-data`
Manually correct extracted skills, contact information, or education.

### `DELETE /api/resumes/:id`
Permanently delete resume and disk file.

---

## 3. Jobs (`/api/jobs`)

### `GET /api/jobs`
Search, filter, and paginate active jobs.
**Query Parameters:**
- `search`: string keyword
- `location`: string location
- `workplaceType`: `remote` | `hybrid` | `on-site`
- `employmentType`: `Full-time` | `Internship` | `Contract`
- `sortBy`: `latest` | `salary_high` | `experience`
- `page`: integer (default 1)
- `limit`: integer (default 10)

### `POST /api/jobs`
Publish a new job posting. *(Recruiter & Admin only)*

---

## 4. Recommendations & AI (`/api/recommendations`)

### `GET /api/recommendations/jobs`
Generate personalized job matches categorized by Best Matches (>= 65%), Recommended, Remote, and Internships.

### `POST /api/recommendations/skills`
Generate skill gap analysis comparing candidate skills with required job skills, returning curated week-by-week learning roadmaps.

### `POST /api/recommendations/assistant`
Interactive AI Career Assistant Q&A endpoint.

---

## 5. Applications (`/api/applications`)

### `POST /api/applications`
Apply for a job posting. Automatically computes weighted AI match score and logs initial status history.

### `GET /api/applications/my`
List all applications submitted by authenticated candidate.

### `GET /api/applications/job/:jobId`
Retrieve candidate pool for a specific job with **AI Candidate Ranking** (#1, #2, #3...). *(Recruiter only)*

### `PATCH /api/applications/:id/status`
Update application stage (`under_review`, `shortlisted`, `interview_scheduled`, `selected`, `rejected`) with audit comment.
