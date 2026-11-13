# HIREMATCH AI – Intelligent Resume Screening & Job Recommendation System
## Complete Major Project Engineering Documentation & Technical Report

---

**Application Title:** HireMatch AI  
**Tagline:** "Your Skills. Your Career. Your Perfect Match."  
**Project Classification:** Full-Stack Enterprise Web Application / AI-Powered Recruitment Platform  
**Target Architecture:** Decoupled React 18 SPA + Node.js/Express REST API + MongoDB Mongoose ODM  
**Core AI Engine:** PDF/DOCX NLP Entity Extraction, Mathematical TF-IDF Vector Space Model & Cosine Similarity, Skill Gap Roadmap Engine, Conversational AI Career Assistant  
**Generated PDF Document:** [HireMatch_AI_Complete_Project_Report.pdf](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/HireMatch_AI_Complete_Project_Report.pdf) (23 Pages, Publication Quality)  
**Interactive HTML Report:** [HireMatch_AI_Complete_Project_Report.html](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/HireMatch_AI_Complete_Project_Report.html)  

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Project Overview & Problem Statement](#2-project-overview--problem-statement)
3. [Technology Stack & Requirements](#3-technology-stack--requirements)
4. [User Roles & Authentication Architecture](#4-user-roles--authentication-architecture)
5. [AI & Natural Language Processing Engine](#5-ai--natural-language-processing-engine)
6. [Database Schema & Data Models (12 Normalized Models)](#6-database-schema--data-models)
7. [Screen-by-Screen User Interface & Workflow Guide (21 Live Screens)](#7-screen-by-screen-user-interface--workflow-guide)
8. [REST API Specification](#8-rest-api-specification)
9. [Automated Testing & Verification (15 Passing Unit Tests)](#9-automated-testing--verification)
10. [Deployment & Production Cloud Infrastructure](#10-deployment--production-cloud-infrastructure)
11. [Conclusion & Future Roadmap](#11-conclusion--future-roadmap)

---

## 1. EXECUTIVE SUMMARY

**HireMatch AI** is a recruitment and career intelligence platform designed to replace legacy keyword-matching filters with mathematical, explainable, and multi-dimensional AI scoring. 

### Key Contributions:
- **Dual Document Extraction Engine:** Ingests raw `.pdf` (via `pdf2json`) and `.docx` (via `mammoth`) documents, automatically extracting candidate contact info, degrees, technical skills, soft skills, work experience, and measurable achievements.
- **Explainable 4-Factor Compatibility Scoring:** Computes matching scores from 0–100% using a transparent weighted formulation:
  $$\text{Match Score} = 0.50 \cdot S_{\text{skills}} + 0.20 \cdot S_{\text{tfidf}} + 0.15 \cdot S_{\text{experience}} + 0.15 \cdot S_{\text{education}}$$
- **Skill Gap Diagnostics & Dynamic Roadmaps:** Automatically identifies missing technical proficiencies and maps them to a structured multi-week progressive curriculum with curated documentation links.
- **Interactive AI Career Assistant:** Context-aware career coaching bot with interview preparation (STAR method), resume optimization, and local fallback architecture.
- **ATS Lifecycle Management:** Complete 6-stage candidate progression pipeline (`applied` → `under_review` → `shortlisted` → `interview_scheduled` → `selected` / `rejected`) with audit timestamps and notes.
- **3-Tier RBAC Architecture:** Custom-built command dashboards for Job Seekers, Recruiters, and Super Administrators.

---

## 2. PROJECT OVERVIEW & PROBLEM STATEMENT

### 2.1 The Problem
Traditional Applicant Tracking Systems (ATS) suffer from critical limitations:
1. **Literal Keyword Matching:** Candidates with equivalent skills (e.g., "Postgres" vs. "PostgreSQL", "React" vs. "React.js") are rejected.
2. **Black Box Scoring:** Candidates receive generic rejection emails without knowing why they were eliminated or what skills they lacked.
3. **Recruiter Fatigue:** Recruiters receive hundreds of unranked resumes and spend less than 7 seconds per resume, leading to biased and arbitrary human screening.

### 2.2 The HireMatch AI Solution
HireMatch AI solves these problems by providing:
- Transparent compatibility percentages with human-readable rationale.
- Candidate-centric skill gap analysis that empowers job seekers to learn missing competencies.
- Recruiter AI ranking dashboards that sort applicants mathematically while leaving final shortlisting/rejection decisions under human control.

---

## 3. TECHNOLOGY STACK & REQUIREMENTS

| Layer | Component | Version | Functional Role |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React.js with Vite | React 18.3 / Vite 5.4 | Single Page Application, sub-second HMR |
| **Styling & Theme** | Tailwind CSS | v3.4 | Responsive layout, dark/light mode toggle |
| **Icons & Visuals** | Lucide React | v0.460 | Consistent vector icon system |
| **Analytics Visualization** | Recharts | v2.13 | Bar charts and pie charts for recruitment funnels |
| **Backend Server** | Node.js & Express.js | Node 20.x / Express 4.19 | REST API architecture, centralized error handling |
| **Database & ODM** | MongoDB & Mongoose | Mongoose 8.7 | 12 normalized schemas with relational indexing |
| **Authentication & Crypto** | JWT & Bcrypt.js | jsonwebtoken 9.0 / bcrypt 2.4 | Salted password hashing, stateless Bearer tokens |
| **File Processing** | Multer, pdf2json, mammoth | Multer 1.4 / pdf2json 3.1 | Secure binary upload & document stream extraction |
| **Quality & Testing** | Jest & Supertest | Jest 29.7 / Supertest 7.0 | Automated unit and integration test suite |

---

## 4. USER ROLES & AUTHENTICATION ARCHITECTURE

### 4.1 Role-Based Access Control (RBAC)
HireMatch AI enforces strict server-side authorization middleware (`authorize('jobseeker')`, `authorize('recruiter')`, `authorize('admin')`):
1. **Job Seeker:** Uploads resumes, executes manual corrections, explores AI-recommended jobs, diagnoses skill gaps, tracks ATS stages, chats with career assistant, updates profile & settings.
2. **Recruiter:** Creates and updates job postings, views applicants ranked by AI compatibility, updates candidate statuses with feedback, reviews analytics.
3. **Super Admin:** Monitors platform-wide health, verifies recruiter accounts, suspends/activates users, audits system activity logs.

### 4.2 Security Guards
- **Admin Self-Registration Prevention:** Registration payloads requesting `role: 'admin'` are blocked with HTTP 403 Forbidden.
- **Password Salting:** Passwords hashed with 10 bcrypt salt rounds.
- **Token Recovery:** Two-step time-bound token generation for password recovery.

---

## 5. AI & NATURAL LANGUAGE PROCESSING ENGINE

### 5.1 Resume Parsing Pipeline
```
[Uploaded PDF/DOCX] 
        │
        ├──> (pdf2json / mammoth) ──> Raw Normalized Text
        ├──> Contact Regex Engine ──> Email, Phone, Location
        ├──> Degree Classifier ──> Bachelor's / Master's / Ph.D.
        └──> Skill Taxonomy Matcher ──> 70+ Categorized Tech Skills
```

### 5.2 TF-IDF & Cosine Similarity
Candidate project summaries and job descriptions are vectorized into a term space where:
$$\text{TF}(t, d) = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}$$
$$\text{IDF}(t, D) = 1 + \ln\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right)$$
$$\text{Cosine Similarity} = \frac{\mathbf{v}_{\text{resume}} \cdot \mathbf{v}_{\text{job}}}{\|\mathbf{v}_{\text{resume}}\| \|\mathbf{v}_{\text{job}}\|}$$

### 5.3 4-Dimensional Compatibility Scoring
$$\text{Total Score} = (0.50 \cdot S_{\text{skills}}) + (0.20 \cdot S_{\text{tfidf}}) + (0.15 \cdot S_{\text{experience}}) + (0.15 \cdot S_{\text{education}})$$

---

## 6. DATABASE SCHEMA & DATA MODELS

The platform utilizes 12 normalized Mongoose models:
1. `User` – Base identity table with role, status, and authentication credentials.
2. `CandidateProfile` – Extended career profile (headline, bio, education, skills, links).
3. `RecruiterProfile` – Company metadata, website, industry, and verification badge.
4. `Resume` – Uploaded resume metadata, parsed JSON entity tree, and quality score.
5. `Job` – Job opportunity details, eligibility, skills, and workplace type.
6. `Application` – Candidate application instance with AI match score and 6-stage lifecycle.
7. `Skill` – Global technology taxonomy with aliases and categorization.
8. `SavedJob` – Candidate bookmarks.
9. `Notification` – In-app real-time alerts.
10. `Interview` – Scheduled interview rounds and meeting details.
11. `ActivityLog` – System compliance and moderation audit logs.
12. `PasswordResetToken` – Cryptographic reset tokens for account recovery.

---

## 7. SCREEN-BY-SCREEN USER INTERFACE & WORKFLOW GUIDE

Every screen has been captured live from the running system:

### 7.1 Public & Authentication Tier
- **Figure 5.1: Landing Page** – Hero banner, value propositions, and 1-Click Interactive Demo Login.  
  *Image:* [01_landing_page.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/01_landing_page.png)
- **Figure 5.2: About Page** – Technology architecture and engineering standards.  
  *Image:* [02_about_page.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/02_about_page.png)
- **Figure 5.3: Features Page** – 6 core AI capabilities breakdown.  
  *Image:* [03_features_page.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/03_features_page.png)
- **Figure 5.4: How It Works Page** – 4-stage pipeline visualization.  
  *Image:* [04_how_it_works.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/04_how_it_works.png)
- **Figure 5.5: Public Job Listings** – Multi-criteria search and filter engine.  
  *Image:* [05_job_listings.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/05_job_listings.png)
- **Figure 5.6: Login Portal** – Show/hide password, remember me, role redirect.  
  *Image:* [06_login_page.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/06_login_page.png)
- **Figure 5.7: Registration Portal** – Dynamic fields toggled for Candidate vs. Recruiter.  
  *Image:* [07_register_page.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/07_register_page.png)
- **Figure 5.8: Password Recovery** – 2-step token verification and password reset.  
  *Image:* [08_forgot_password.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/08_forgot_password.png)

### 7.2 Candidate / Job Seeker Tier
- **Figure 5.9: Candidate Dashboard** – Welcome banner, profile completion meter, telemetry.  
  *Image:* [09_jobseeker_dashboard.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/09_jobseeker_dashboard.png)
- **Figure 5.10: Intelligent Resume Analyzer** – Extracted skills, completeness meter, manual correction modal.  
  *Image:* [10_resume_analyzer.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/10_resume_analyzer.png)
- **Figure 5.11: Job Recommendations** – Compatibility score badges and explainable matching breakdowns.  
  *Image:* [11_job_recommendations.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/11_job_recommendations.png)
- **Figure 5.12: Skill Gap Diagnostics** – Missing skill detection and 4-week learning curriculum.  
  *Image:* [12_skill_gap_analysis.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/12_skill_gap_analysis.png)
- **Figure 5.13: AI Career Assistant** – Chat interface with quick prompt templates and career coaching.  
  *Image:* [13_career_assistant.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/13_career_assistant.png)
- **Figure 5.14: Application Lifecycle Tracker** – 6-stage ATS timeline visualization.  
  *Image:* [14_application_tracking.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/14_application_tracking.png)
- **Figure 5.15: Candidate Profile & Settings** – Profile editing, password change, and theme preferences.  
  *Image:* [15_jobseeker_profile_settings.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/15_jobseeker_profile_settings.png)

### 7.3 Recruiter Tier
- **Figure 5.16: Recruiter Talent Hub** – Total applicants, shortlisted count, and pipeline metrics.  
  *Image:* [16_recruiter_dashboard.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/16_recruiter_dashboard.png)
- **Figure 5.17: Post & Edit Job Opportunities** – Job specification form with skill tags and salary bounds.  
  *Image:* [17_post_new_job.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/17_post_new_job.png)
- **Figure 5.18: Recruiter AI Candidate Ranking** – Candidate scores, missing skills, and status updates.  
  *Image:* [18_recruiter_candidate_ranking.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/18_recruiter_candidate_ranking.png)
- **Figure 5.19: Recruitment Analytics** – Recharts compatibility score distribution charts.  
  *Image:* [19_recruitment_analytics.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/19_recruitment_analytics.png)

### 7.4 Super Administrator Tier
- **Figure 5.20: Super Admin Console** – User management, recruiter verification badges, and system audit log.  
  *Image:* [20_admin_dashboard.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/20_admin_dashboard.png)
- **Figure 5.21: Super Admin Settings** – Administrator security status and password change.  
  *Image:* [21_admin_settings.png](file:///Users/admin/Documents/Projectsss/JOB_AI/docs/screenshots/21_admin_settings.png)

---

## 8. REST API SPECIFICATION

The backend exposes 21 RESTful endpoints:
- `GET /api/health` – Public system health
- `POST /api/auth/register` – Role-based registration
- `POST /api/auth/login` – JWT authentication
- `GET /api/auth/me` – Current authenticated user details
- `PUT /api/auth/profile` – Update profile details
- `PUT /api/auth/change-password` – Password modification
- `POST /api/auth/forgot-password` – Generate recovery token
- `POST /api/auth/reset-password` – Reset password using token
- `GET /api/jobs` – Paginated jobs with keyword & skill filter
- `POST /api/jobs` – Create job posting (Recruiter)
- `PUT /api/jobs/:id` – Modify job posting (Recruiter)
- `POST /api/resumes/upload` – Upload & parse PDF/DOCX (Job Seeker)
- `PUT /api/resumes/:id/manual-correct` – Edit parsed resume entities
- `GET /api/recommendations/jobs` – Retrieve ranked job matches
- `POST /api/recommendations/skill-gap` – Generate learning roadmap
- `POST /api/recommendations/assistant` – AI career coaching chatbot
- `POST /api/applications/apply/:jobId` – Apply for position
- `GET /api/applications/my` – Candidate application tracker
- `GET /api/applications/job/:jobId` – Recruiter AI applicant ranking
- `PATCH /api/applications/:id/status` – Update ATS stage
- `GET /api/admin/dashboard` – Admin platform statistics & audit logs

---

## 9. AUTOMATED TESTING & VERIFICATION

All 15 automated unit and integration tests execute successfully via Jest & Supertest:
```
PASS  tests/api.test.js
  HireMatch AI - Comprehensive Backend & AI Unit Tests
    1. Health Check & Public Endpoints
      ✓ GET /api/health should return 200 and healthy status (48 ms)
      ✓ GET /api/jobs should return a paginated list of active jobs (116 ms)
      ✓ GET /api/jobs with search query should filter results (22 ms)
    2. Authentication & Authorization Security
      ✓ POST /api/auth/register should successfully register a new job seeker (113 ms)
      ✓ POST /api/auth/register should reject duplicate email (6 ms)
      ✓ POST /api/auth/register should forbid self-registration as admin (4 ms)
      ✓ POST /api/auth/login should authenticate valid candidate and return JWT (90 ms)
      ✓ POST /api/auth/login should reject invalid credentials (76 ms)
      ✓ GET /api/auth/me should reject request without token (4 ms)
    3. AI Engine: NLP, Skill Extraction & Matching
      ✓ should accurately extract technical and soft skills from resume text (5 ms)
      ✓ should compute weighted compatibility score between resume and job description (1 ms)
      ✓ should analyze skill gaps and produce customized learning roadmap (1 ms)
    4. Recruiter & Admin Operations
      ✓ GET /api/recruiters/dashboard should return metrics for authenticated recruiter (25 ms)
      ✓ GET /api/admin/dashboard should return platform-wide statistics for super admin (33 ms)
      ✓ GET /api/admin/dashboard should deny non-admin access (7 ms)

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Time:        1.873 s
```

---

## 10. DEPLOYMENT & PRODUCTION CLOUD INFRASTRUCTURE

- **Vercel:** Single Page Application (SPA) client deployed with asset hashing and edge CDN caching.
- **Render:** Node.js Express server running with environment variables and auto-scaling.
- **MongoDB Atlas:** 3-node replica set with TLS 1.3 encryption, automatic failover, and automated backups.

---

## 11. CONCLUSION & FUTURE ROADMAP

HireMatch AI establishes a modern, functional, and explainable AI recruitment system that bridges the gap between candidates and recruiters.

### Planned Enhancements:
1. **Transformer Embeddings (BERT/RoBERTa):** Dense semantic vector embeddings for cross-lingual resume analysis.
2. **Integrated WebRTC Video Interviews:** Built-in video assessment and transcription.
3. **Automated Coding Challenges:** Dynamic micro-evaluations during application submission.

---
*Report Compiled: November 2026 • HireMatch AI Engineering Documentation*

