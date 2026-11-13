const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SCREENSHOTS_DIR = path.join(__dirname, '../docs/screenshots');
const OUTPUT_HTML = path.join(__dirname, '../docs/HireMatch_AI_Complete_Project_Report.html');
const OUTPUT_PDF = path.join(__dirname, '../docs/HireMatch_AI_Complete_Project_Report.pdf');

// Helper to convert image to base64
function getBase64Image(filename) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return '';
  }
  const ext = path.extname(filename).replace('.', '');
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:image/${ext};base64,${data}`;
}

const images = {
  landing: getBase64Image('01_landing_page.png'),
  about: getBase64Image('02_about_page.png'),
  features: getBase64Image('03_features_page.png'),
  howItWorks: getBase64Image('04_how_it_works.png'),
  jobs: getBase64Image('05_job_listings.png'),
  login: getBase64Image('06_login_page.png'),
  register: getBase64Image('07_register_page.png'),
  forgotPassword: getBase64Image('08_forgot_password.png'),
  jobseekerDashboard: getBase64Image('09_jobseeker_dashboard.png'),
  resumeAnalyzer: getBase64Image('10_resume_analyzer.png'),
  recommendations: getBase64Image('11_job_recommendations.png'),
  skillGap: getBase64Image('12_skill_gap_analysis.png'),
  assistant: getBase64Image('13_career_assistant.png'),
  applications: getBase64Image('14_application_tracking.png'),
  jobseekerSettings: getBase64Image('15_jobseeker_profile_settings.png'),
  recruiterDashboard: getBase64Image('16_recruiter_dashboard.png'),
  createJob: getBase64Image('17_post_new_job.png'),
  candidateRanking: getBase64Image('18_recruiter_candidate_ranking.png'),
  analytics: getBase64Image('19_recruitment_analytics.png'),
  adminDashboard: getBase64Image('20_admin_dashboard.png'),
  adminSettings: getBase64Image('21_admin_settings.png'),
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>HireMatch AI - Complete Project Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

  @page {
    size: A4;
    margin: 18mm 15mm 20mm 15mm;
    @bottom-right {
      content: counter(page);
    }
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.6;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }

  .page-break {
    page-break-before: always;
  }

  .avoid-break {
    page-break-inside: avoid;
  }

  /* Cover Page */
  .cover {
    min-height: 95vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 20px;
    border: 2px solid #e2e8f0;
    border-radius: 20px;
    box-sizing: border-box;
    background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  }

  .cover-header {
    border-bottom: 3px solid #4f46e5;
    padding-bottom: 25px;
  }

  .tagline-badge {
    display: inline-block;
    background: #eef2ff;
    color: #4f46e5;
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 50px;
    border: 1px solid #c7d2fe;
    margin-bottom: 15px;
  }

  .cover-title {
    font-size: 30pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.15;
    margin: 0 0 10px 0;
  }

  .cover-subtitle {
    font-size: 13pt;
    font-weight: 600;
    color: #475569;
    margin: 0;
  }

  .cover-body {
    margin: 40px 0;
  }

  .meta-box {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 14px;
    padding: 20px 25px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }

  .meta-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed #e2e8f0;
    font-size: 9.5pt;
  }
  .meta-row:last-child {
    border-bottom: none;
  }

  .meta-label {
    font-weight: 700;
    color: #64748b;
  }

  .meta-value {
    font-weight: 600;
    color: #0f172a;
  }

  .cover-footer {
    border-top: 2px solid #e2e8f0;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9pt;
    color: #64748b;
  }

  /* Headings */
  h1 {
    font-size: 18pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #4f46e5;
    padding-bottom: 6px;
    margin-top: 30px;
    margin-bottom: 15px;
  }

  h2 {
    font-size: 13pt;
    font-weight: 700;
    color: #1e1b4b;
    margin-top: 22px;
    margin-bottom: 10px;
    border-left: 4px solid #4f46e5;
    padding-left: 10px;
  }

  h3 {
    font-size: 11pt;
    font-weight: 700;
    color: #334155;
    margin-top: 16px;
    margin-bottom: 6px;
  }

  p {
    margin: 0 0 10px 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0 0 12px 0;
    padding-left: 22px;
  }

  li {
    margin-bottom: 4px;
  }

  /* Code & Formulas */
  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    background: #f1f5f9;
    padding: 2px 5px;
    border-radius: 4px;
    color: #0f172a;
  }

  pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    background: #0f172a;
    color: #f8fafc;
    padding: 12px 16px;
    border-radius: 10px;
    overflow-x: auto;
    line-height: 1.45;
  }

  .formula-box {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 4px solid #10b981;
    padding: 12px 18px;
    border-radius: 8px;
    margin: 14px 0;
    font-size: 9.5pt;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 8.5pt;
  }

  th, td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    text-align: left;
  }

  th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  /* Screenshots */
  .screenshot-card {
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    padding: 10px;
    background: #ffffff;
    box-shadow: 0 3px 6px -1px rgba(0,0,0,0.06);
    margin: 18px 0;
    text-align: center;
  }

  .screenshot-img {
    width: 100%;
    max-height: 480px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    display: block;
    margin: 0 auto;
  }

  .screenshot-caption {
    font-size: 8.5pt;
    font-weight: 700;
    color: #475569;
    margin-top: 8px;
    display: block;
  }

  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
  }
  .badge-get { background: #dbeafe; color: #1e40af; }
  .badge-post { background: #dcfce7; color: #166534; }
  .badge-put { background: #fef3c7; color: #92400e; }
  .badge-patch { background: #e0e7ff; color: #3730a3; }
  .badge-delete { background: #fee2e2; color: #991b1b; }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-header">
    <span class="tagline-badge">MCA Major Project • Comprehensive Engineering Report</span>
    <h1 class="cover-title">HIREMATCH AI</h1>
    <p class="cover-subtitle">Intelligent Resume Screening & AI-Powered Job Recommendation System</p>
  </div>

  <div class="cover-body">
    <div class="meta-box">
      <div class="meta-row">
        <span class="meta-label">Project Domain</span>
        <span class="meta-value">Artificial Intelligence, Natural Language Processing, Full-Stack Web Architecture</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Application Type</span>
        <span class="meta-value">Full-Stack Cloud SaaS Application (Candidate, Recruiter, Super Admin)</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Core Algorithms</span>
        <span class="meta-value">TF-IDF Vector Space Model, Cosine Similarity, Taxonomy Extraction, Skill Gap Roadmaps</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Frontend Stack</span>
        <span class="meta-value">React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Backend Stack</span>
        <span class="meta-value">Node.js, Express.js REST API, Mongoose ODM, JWT, Bcrypt, Multer</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Database Management</span>
        <span class="meta-value">MongoDB Atlas / Local MongoDB Engine (12 Normalized Schemas)</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Quality & Testing</span>
        <span class="meta-value">15/15 Automated Unit & Integration Tests (Jest & Supertest Passing)</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Deployment Architecture</span>
        <span class="meta-value">Vercel (Client SPA) + Render (Node.js API) + MongoDB Atlas Cloud</span>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <span>Platform Status: <strong>Production Ready & Live Tested</strong></span>
    <span>Date: November 2026</span>
  </div>
</div>

<div class="page-break"></div>

<!-- TABLE OF CONTENTS -->
<h1>TABLE OF CONTENTS</h1>
<table style="font-size: 9pt;">
  <tr><th>Section</th><th>Chapter / Topic Title</th></tr>
  <tr><td><strong>Executive Summary</strong></td><td>Abstract, Key Contributions & Architectural Highlights</td></tr>
  <tr><td><strong>Chapter 1</strong></td><td>Introduction, Problem Statement, Project Objectives & Scope</td></tr>
  <tr><td><strong>Chapter 2</strong></td><td>System Requirements, Technology Stack & Feasibility Analysis</td></tr>
  <tr><td><strong>Chapter 3</strong></td><td>System Architecture, Component Flow & 12 Database Schemas</td></tr>
  <tr><td><strong>Chapter 4</strong></td><td>AI & NLP Algorithms: Parsing, TF-IDF, Cosine Similarity & Roadmaps</td></tr>
  <tr><td><strong>Chapter 5</strong></td><td>End-to-End Screen Guide with High-Resolution Screenshots (21 Screens)</td></tr>
  <tr><td><strong>Chapter 6</strong></td><td>REST API Specification & Endpoint Documentation</td></tr>
  <tr><td><strong>Chapter 7</strong></td><td>Software Testing, Security Auditing & Verification Results</td></tr>
  <tr><td><strong>Chapter 8</strong></td><td>Deployment Configuration & Cloud Infrastructure (Vercel & Render)</td></tr>
  <tr><td><strong>Chapter 9</strong></td><td>Conclusion, Engineering Limitations & Future Enhancements</td></tr>
</table>

<!-- EXECUTIVE SUMMARY -->
<h2>EXECUTIVE SUMMARY</h2>
<p>
<strong>HireMatch AI</strong> is an enterprise-grade recruitment and career enablement web application developed to modernize the hiring process. Traditional Applicant Tracking Systems (ATS) rely on rigid keyword searches that frequently overlook highly qualified candidates due to trivial vocabulary discrepancies. HireMatch AI solves this by introducing an explainable, multi-dimensional AI scoring engine combining:
</p>
<ul>
  <li><strong>Dual-Engine Document Parsing:</strong> Extracts text, contact data, education, work experience, projects, and skills from PDF (via <code>pdf2json</code>) and DOCX (via <code>mammoth</code>).</li>
  <li><strong>Mathematical Vector Space Matching:</strong> Calculates TF-IDF vectors and Cosine Similarity between resumes and job descriptions without relying on brittle black-box models.</li>
  <li><strong>Four-Factor Weighted Scoring:</strong> Evaluates Technical Skills (50%), TF-IDF Keyword Match (20%), Experience Level (15%), and Education Compatibility (15%).</li>
  <li><strong>Skill Gap Analysis & Roadmaps:</strong> Directly analyzes deficiencies in candidate skillsets and produces multi-week progressive learning roadmaps with curated documentation links.</li>
  <li><strong>Interactive AI Career Assistant:</strong> A context-aware chatbot providing interview coaching, resume optimization, and career guidance with automated local fallbacks.</li>
  <li><strong>Three-Tier Role Architecture:</strong> Tailored portals for Job Seekers, Recruiters, and Platform Super Admins with role-based access control (RBAC).</li>
</ul>

<div class="page-break"></div>

<!-- CHAPTER 1: INTRODUCTION -->
<h1>CHAPTER 1: INTRODUCTION & PROBLEM STATEMENT</h1>

<h2>1.1 Background & Context</h2>
<p>
In the contemporary software and technology job market, companies receive hundreds or thousands of applicants for a single open position. Recruiters spend on average only 6 to 7 seconds screening an initial resume. As a result, companies deploy automated screening filters that eliminate candidates based on primitive keyword matching. Consequently:
</p>
<ul>
  <li>Qualified candidates are rejected simply because their resume uses synonymous or alternate technical phrasing.</li>
  <li>Candidates receive no actionable feedback regarding why they were rejected or what skills they need to bridge the gap.</li>
  <li>Recruiters lack transparent, mathematically explainable candidate rankings and spend hours manually sorting applicants.</li>
</ul>

<h2>1.2 Project Objectives</h2>
<p>
The core objective of <strong>HireMatch AI</strong> is to construct a transparent, full-stack recruitment ecosystem that bridges the gap between candidates and recruiters through explainable artificial intelligence. Key objectives include:
</p>
<ol>
  <li><strong>Automated Resume Extraction:</strong> Ingest unstructured PDF/DOCX documents and convert them into structured JSON candidate profiles with a manual correction interface.</li>
  <li><strong>Explainable Compatibility Scoring:</strong> Provide candidate-job match percentages from 0% to 100% accompanied by explicit reasons, matching skills, and missing skills.</li>
  <li><strong>Proactive Job Recommendations:</strong> Algorithmically rank open positions to present candidates with high-fit opportunities based on profile telemetry.</li>
  <li><strong>Skill Gap Diagnostics:</strong> Calculate missing skills for any target role and produce customized, multi-week learning roadmaps.</li>
  <li><strong>Recruiter Talent Hub:</strong> Provide automated candidate ranking, applicant status pipeline management, and recruitment analytics.</li>
  <li><strong>Platform Governance:</strong> Provide Super Administrators with moderation tools, recruiter verification badges, and comprehensive audit logging.</li>
</ol>

<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<!-- CHAPTER 2: TECHNOLOGY REQUIREMENTS -->
<h1>CHAPTER 2: SYSTEM REQUIREMENTS & TECHNOLOGY STACK</h1>

<h2>2.1 Full-Stack Technology Matrix</h2>
<table>
  <tr><th>Layer</th><th>Technology</th><th>Version</th><th>Purpose in HireMatch AI</th></tr>
  <tr><td>Frontend Framework</td><td>React.js (Vite)</td><td>React 18.3 / Vite 5.4</td><td>Single Page Application (SPA), lightning-fast HMR and bundling</td></tr>
  <tr><td>Styling & UI</td><td>Tailwind CSS</td><td>v3.4</td><td>Modern responsive design, dark mode, SaaS visual aesthetic</td></tr>
  <tr><td>Icons & Visuals</td><td>Lucide React</td><td>v0.460</td><td>Crisp vector icons for actions, badges, and statuses</td></tr>
  <tr><td>Analytics Charts</td><td>Recharts</td><td>v2.13</td><td>Interactive bar charts and pie charts for recruitment analytics</td></tr>
  <tr><td>Backend Server</td><td>Node.js & Express.js</td><td>Node 20.x / Express 4.19</td><td>RESTful API micro-architecture with centralized middleware</td></tr>
  <tr><td>Database & ODM</td><td>MongoDB & Mongoose</td><td>Mongoose 8.7</td><td>NoSQL document database with normalized relational references</td></tr>
  <tr><td>Authentication</td><td>JWT & Bcrypt.js</td><td>jsonwebtoken 9.0 / bcrypt 2.4</td><td>Stateless Bearer token auth and salted password hashing</td></tr>
  <tr><td>File Uploads</td><td>Multer</td><td>v1.4</td><td>Controlled multipart form-data parsing with disk storage & size bounds</td></tr>
  <tr><td>PDF & DOCX Parsing</td><td>pdf2json & mammoth</td><td>Stable</td><td>Raw text and structural stream extraction from resumes</td></tr>
  <tr><td>Unit & API Testing</td><td>Jest & Supertest</td><td>Jest 29.7 / Supertest 7.0</td><td>Automated testing suite with 15 passing integration tests</td></tr>
</table>

<div class="page-break"></div>

<!-- CHAPTER 3: ARCHITECTURE & DATABASE DESIGN -->
<h1>CHAPTER 3: SYSTEM ARCHITECTURE & DATABASE DESIGN</h1>

<h2>3.1 Decoupled 3-Tier Architecture</h2>
<p>
HireMatch AI adheres to a decoupled client-server architecture. The React SPA communicates with the Express backend strictly via JSON REST APIs. All sensitive credentials, database keys, and JWT secrets remain strictly in backend environment variables.
</p>
<pre>
+-----------------------------------------------------------------------------------+
|                            CLIENT TIER (React 18 + Vite)                          |
|  - Candidate Portal      - Recruiter Talent Hub      - Super Admin Governance      |
|  - Dynamic Role Forms    - Recharts Analytics         - Profile & Settings Engine  |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / JSON Bearer Tokens
                                           v
+-----------------------------------------------------------------------------------+
|                          API & LOGIC TIER (Node.js + Express)                     |
|  - Helmet & CORS         - Rate Limiter Middleware    - Auth & RBAC Guard          |
|  - Resume Parser (PDF)   - TF-IDF Vectorizer Engine   - Activity Audit Logger      |
|  - Skill Gap Analyzer    - Recruiter Candidate Ranker - Career Assistant Fallback  |
+------------------------------------------+----------------------------------------+
                                           | Mongoose ODM Connections
                                           v
+-----------------------------------------------------------------------------------+
|                         DATABASE TIER (MongoDB Engine / Atlas)                    |
|  12 Normalized Models: User, CandidateProfile, RecruiterProfile, Resume, Job,     |
|  Application, Skill, SavedJob, Notification, Interview, ActivityLog, PasswordReset|
+-----------------------------------------------------------------------------------+
</pre>

<h2>3.2 Database Schema Architecture (12 Normalized Collections)</h2>
<table>
  <tr><th>Model Name</th><th>Key Attributes & Types</th><th>Relationships & Purpose</th></tr>
  <tr><td><code>User</code></td><td>name, email, password (hashed), role, status, avatar</td><td>Core identity table for candidate, recruiter, admin</td></tr>
  <tr><td><code>CandidateProfile</code></td><td>user (Ref), headline, bio, location, education[], skills[], links</td><td>Stores comprehensive job seeker career portfolio</td></tr>
  <tr><td><code>RecruiterProfile</code></td><td>user (Ref), companyName, website, industry, size, verified</td><td>Stores verified hiring company credentials</td></tr>
  <tr><td><code>Resume</code></td><td>candidate (Ref), fileUrl, parsedData, score, isPrimary</td><td>Parsed candidate resume with extracted entities</td></tr>
  <tr><td><code>Job</code></td><td>recruiter (Ref), title, company, skills[], salary, workplaceType</td><td>Open job postings with eligibility requirements</td></tr>
  <tr><td><code>Application</code></td><td>job (Ref), candidate (Ref), resume (Ref), matchScore, status</td><td>Tracks candidate application through 6 ATS stages</td></tr>
  <tr><td><code>Skill</code></td><td>name, category, synonyms[], popularity</td><td>Normalized taxonomy of 70+ technology skills</td></tr>
  <tr><td><code>SavedJob</code></td><td>user (Ref), job (Ref), createdAt</td><td>Bookmarked job opportunities for candidates</td></tr>
  <tr><td><code>Notification</code></td><td>recipient (Ref), type, title, message, isRead</td><td>Real-time in-app alerts for status updates</td></tr>
  <tr><td><code>Interview</code></td><td>application (Ref), recruiter (Ref), date, meetingLink, notes</td><td>Scheduled interview events and rounds</td></tr>
  <tr><td><code>ActivityLog</code></td><td>userId, action, resourceType, ipAddress, details</td><td>Immutable security and compliance audit trail</td></tr>
  <tr><td><code>PasswordResetToken</code></td><td>userId (Ref), token (hashed), expiresAt</td><td>Time-limited tokens for account recovery</td></tr>
</table>

<div class="page-break"></div>

<!-- CHAPTER 4: AI & NLP ALGORITHMS -->
<h1>CHAPTER 4: AI & NATURAL LANGUAGE PROCESSING ALGORITHMS</h1>

<h2>4.1 Resume Entity & Skill Extraction Pipeline</h2>
<p>
When a resume file (PDF or DOCX) is uploaded, HireMatch AI initiates an extraction pipeline:
</p>
<ol>
  <li><strong>Binary Stream Parsing:</strong> <code>pdf2json</code> extracts textual glyphs with positional coordinates; <code>mammoth</code> converts Word documents to clean plain text.</li>
  <li><strong>Normalization & Tokenization:</strong> Punctuation is stripped, accents normalized, and text converted to lower-case token sequences.</li>
  <li><strong>Entity Extraction:</strong> Regular expressions extract contact emails, phone numbers, and degree classifications (B.Tech, MCA, M.S., Ph.D.).</li>
  <li><strong>Skill Taxonomy Matching:</strong> Candidate tokens are cross-referenced with a comprehensive 70+ technical skill taxonomy using boundary matching to prevent false positives (e.g. distinguishing "Java" from "JavaScript").</li>
</ol>

<h2>4.2 Mathematical Vector Space Model: TF-IDF & Cosine Similarity</h2>
<p>
To evaluate textual semantic similarity between the candidate's resume and the recruiter's job description, HireMatch AI computes the Cosine Similarity over Term Frequency-Inverse Document Frequency (TF-IDF) vectors:
</p>

<div class="formula-box">
  <strong>Term Frequency (TF):</strong><br>
  $$\text{TF}(t, d) = \frac{\text{count}(t, d)}{\sum_{t' \in d} \text{count}(t', d)}$$
  <br>
  <strong>Inverse Document Frequency (IDF):</strong><br>
  $$\text{IDF}(t, D) = 1 + \ln\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right)$$
  <br>
  <strong>Cosine Similarity Metric:</strong><br>
  $$\text{CosineSimilarity}(v_{\text{resume}}, v_{\text{job}}) = \frac{\mathbf{v}_{\text{resume}} \cdot \mathbf{v}_{\text{job}}}{\|\mathbf{v}_{\text{resume}}\| \|\mathbf{v}_{\text{job}}\|}$$
</div>

<h2>4.3 Four-Factor Explainable Compatibility Scoring Model</h2>
<p>
Unlike opaque AI systems, HireMatch AI uses an explainable weighted scoring formula that evaluates four distinct dimensions:
</p>

<div class="formula-box">
  <strong>Overall Match Score Formula:</strong><br>
  $$S = \mathbf{0.50} \cdot S_{\text{skills}} + \mathbf{0.20} \cdot S_{\text{tfidf}} + \mathbf{0.15} \cdot S_{\text{experience}} + \mathbf{0.15} \cdot S_{\text{education}}$$
</div>
<ul>
  <li><strong>Technical Skill Match ($S_{\text{skills}}$ - 50%):</strong> Jaccard overlap between candidate's extracted skills and job required skills.</li>
  <li><strong>TF-IDF Vector Relevance ($S_{\text{tfidf}}$ - 20%):</strong> Textual cosine similarity across project descriptions and role requirements.</li>
  <li><strong>Experience Match ($S_{\text{experience}}$ - 15%):</strong> Proximity of candidate's verified years of experience to job experience bounds.</li>
  <li><strong>Education Match ($S_{\text{education}}$ - 15%):</strong> Qualification tier matching required degree level.</li>
</ul>

<h2>4.4 Skill Gap Diagnostics & Adaptive Learning Roadmap Engine</h2>
<p>
When a candidate selects any target job, the <code>skillGapAnalyzer</code> detects every missing skill and maps it to a structured 4-week learning curriculum with curated learning topics and official documentation URLs.
</p>

<div class="page-break"></div>

<!-- CHAPTER 5: COMPLETE SCREEN-BY-SCREEN USER INTERFACE GUIDE -->
<h1>CHAPTER 5: COMPLETE SCREEN-BY-SCREEN APPLICATION GUIDE</h1>
<p>
This chapter presents every screen of the HireMatch AI application captured live from the running system, categorized by functional tier.
</p>

<!-- Screen 1: Landing Page -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.landing}" alt="HireMatch AI Landing Page">
  <span class="screenshot-caption">Figure 5.1: HireMatch AI Modern Landing Page with 1-Click Interactive Demo Login Access</span>
</div>
<p>
<strong>Description:</strong> The public landing page introduces HireMatch AI's value proposition ("Your Skills. Your Career. Your Perfect Match."). It features a quick-access evaluator banner with one-click instant authentication into Job Seeker, Recruiter, and Super Admin demo accounts without manual credential typing.
</p>

<div class="page-break"></div>

<!-- Screen 2 & 3: About & Features -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.about}" alt="HireMatch AI About Page">
  <span class="screenshot-caption">Figure 5.2: About Platform & Technology Architecture</span>
</div>

<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.features}" alt="HireMatch AI Features Showcase">
  <span class="screenshot-caption">Figure 5.3: Core Features & AI Capabilities Showcase</span>
</div>

<div class="page-break"></div>

<!-- Screen 4 & 5: How It Works & Job Listings -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.howItWorks}" alt="HireMatch AI How It Works">
  <span class="screenshot-caption">Figure 5.4: 4-Step Operational Recruitment Lifecycle Workflow</span>
</div>

<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.jobs}" alt="HireMatch AI Public Job Listings">
  <span class="screenshot-caption">Figure 5.5: Public Job Exploration Engine with Multi-Parameter Filtering</span>
</div>

<div class="page-break"></div>

<!-- Screen 6 & 7: Login & Registration -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.login}" alt="HireMatch AI Secure Login Portal">
  <span class="screenshot-caption">Figure 5.6: Enterprise Authentication Portal with Password Visibility & Validation</span>
</div>

<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.register}" alt="HireMatch AI Dual-Role Registration">
  <span class="screenshot-caption">Figure 5.7: Dynamic Dual-Role Registration (Job Seeker / Recruiter Field Switching)</span>
</div>

<div class="page-break"></div>

<!-- Screen 8 & 9: Forgot Password & Candidate Dashboard -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.forgotPassword}" alt="HireMatch AI Password Recovery">
  <span class="screenshot-caption">Figure 5.8: Two-Step Secure Password Recovery & Token Reset Interface</span>
</div>

<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.jobseekerDashboard}" alt="HireMatch AI Job Seeker Dashboard">
  <span class="screenshot-caption">Figure 5.9: Candidate Command Dashboard with Profile Completion & Telemetry</span>
</div>

<div class="page-break"></div>

<!-- Screen 10 & 11: Resume Analyzer & Recommendations -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.resumeAnalyzer}" alt="HireMatch AI Resume Analyzer">
  <span class="screenshot-caption">Figure 5.10: Intelligent Resume Analyzer with PDF/DOCX Parser & Manual Correction</span>
</div>

<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.recommendations}" alt="HireMatch AI Job Recommendations">
  <span class="screenshot-caption">Figure 5.11: AI Job Recommendation Engine with Explainable Compatibility Scores</span>
</div>

<div class="page-break"></div>

<!-- Screen 12 & 13: Skill Gap & Career Assistant -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.skillGap}" alt="HireMatch AI Skill Gap Analyzer">
  <span class="screenshot-caption">Figure 5.12: Skill Gap Diagnostics with Multi-Week Adaptive Learning Roadmaps</span>
</div>

<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.assistant}" alt="HireMatch AI Career Assistant">
  <span class="screenshot-caption">Figure 5.13: Conversational AI Career Assistant & Interview Preparation Coach</span>
</div>

<div class="page-break"></div>

<!-- Screen 14 & 15: ATS Lifecycle & Candidate Settings -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.applications}" alt="HireMatch AI Application Tracking">
  <span class="screenshot-caption">Figure 5.14: 6-Stage Application Tracking System (ATS Lifecycle Progression)</span>
</div>

<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.jobseekerSettings}" alt="HireMatch AI Profile & Settings">
  <span class="screenshot-caption">Figure 5.15: Candidate Profile Management, Password Updates & Theme Controls</span>
</div>

<div class="page-break"></div>

<!-- Screen 16 & 17: Recruiter Dashboard & Post Job -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.recruiterDashboard}" alt="HireMatch AI Recruiter Dashboard">
  <span class="screenshot-caption">Figure 5.16: Recruiter Talent Command Hub & Real-Time Pipeline Overview</span>
</div>

<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.createJob}" alt="HireMatch AI Post New Job">
  <span class="screenshot-caption">Figure 5.17: Job Posting & Editing Engine with Skill Taxonomy Tagging</span>
</div>

<div class="page-break"></div>

<!-- Screen 18 & 19: Candidate Ranking & Analytics -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.candidateRanking}" alt="HireMatch AI Recruiter Candidate Ranking">
  <span class="screenshot-caption">Figure 5.18: AI-Powered Candidate Ranking, Score Breakdown & Status Pipeline</span>
</div>

<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.analytics}" alt="HireMatch AI Recruitment Analytics">
  <span class="screenshot-caption">Figure 5.19: Comprehensive Recruitment Pipeline Analytics & Match Distribution Charts</span>
</div>

<div class="page-break"></div>

<!-- Screen 20 & 21: Super Admin Console & Settings -->
<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.adminDashboard}" alt="HireMatch AI Super Admin Dashboard">
  <span class="screenshot-caption">Figure 5.20: Super Admin Console: User Moderation, Recruiter Verification & Audit Logs</span>
</div>

<div class="screenshot-card avoid-break">
  <img class="screenshot-img" src="${images.adminSettings}" alt="HireMatch AI Admin Security Settings">
  <span class="screenshot-caption">Figure 5.21: Super Administrator Security Settings & Session Management</span>
</div>

<div class="page-break"></div>

<!-- CHAPTER 6: API SPECIFICATION -->
<h1>CHAPTER 6: REST API SPECIFICATION</h1>
<p>
The HireMatch AI backend provides a structured RESTful interface adhering to HTTP standards:
</p>

<table>
  <tr><th>Method</th><th>Endpoint</th><th>Auth Required</th><th>Description</th></tr>
  <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/health</code></td><td>Public</td><td>Server health check and MongoDB connection status</td></tr>
  <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/auth/register</code></td><td>Public</td><td>Create candidate or recruiter account (blocks admin self-registration)</td></tr>
  <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/auth/login</code></td><td>Public</td><td>Verify credentials and return JWT bearer token</td></tr>
  <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/auth/me</code></td><td>Bearer JWT</td><td>Get current authenticated user and linked role profile</td></tr>
  <tr><td><span class="badge badge-put">PUT</span></td><td><code>/api/auth/profile</code></td><td>Bearer JWT</td><td>Update candidate or recruiter profile information</td></tr>
  <tr><td><span class="badge badge-put">PUT</span></td><td><code>/api/auth/change-password</code></td><td>Bearer JWT</td><td>Update account password with current password verification</td></tr>
  <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/auth/forgot-password</code></td><td>Public</td><td>Generate time-bound password reset token</td></tr>
  <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/auth/reset-password</code></td><td>Public</td><td>Reset password using valid reset token</td></tr>
  <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/jobs</code></td><td>Public</td><td>List jobs with full text search, skills filter & pagination</td></tr>
  <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/jobs</code></td><td>Recruiter/Admin</td><td>Publish new job posting with skill requirements</td></tr>
  <tr><td><span class="badge badge-put">PUT</span></td><td><code>/api/jobs/:id</code></td><td>Recruiter/Admin</td><td>Update existing job posting specifications</td></tr>
  <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/resumes/upload</code></td><td>Jobseeker/Admin</td><td>Upload resume file (PDF/DOCX) and run NLP extraction</td></tr>
  <tr><td><span class="badge badge-put">PUT</span></td><td><code>/api/resumes/:id/manual-correct</code></td><td>Jobseeker/Admin</td><td>Manually adjust extracted resume skills & contact info</td></tr>
  <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/recommendations/jobs</code></td><td>Jobseeker</td><td>Retrieve compatibility-ranked jobs for current candidate</td></tr>
  <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/recommendations/skill-gap</code></td><td>Jobseeker</td><td>Analyze skill gaps against target job and generate roadmap</td></tr>
  <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/recommendations/assistant</code></td><td>Jobseeker</td><td>Interactive career advice with rule & AI provider fallback</td></tr>
  <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/applications/apply/:jobId</code></td><td>Jobseeker</td><td>Submit job application and compute initial match score</td></tr>
  <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/applications/job/:jobId</code></td><td>Recruiter/Admin</td><td>Get ranked applicants for a job with explainable scores</td></tr>
  <tr><td><span class="badge badge-patch">PATCH</span></td><td><code>/api/applications/:id/status</code></td><td>Recruiter/Admin</td><td>Update candidate status across the 6 ATS stages</td></tr>
  <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/admin/dashboard</code></td><td>Admin</td><td>Platform statistics, user management, and audit logs</td></tr>
  <tr><td><span class="badge badge-patch">PATCH</span></td><td><code>/api/admin/recruiters/:id/verify</code></td><td>Admin</td><td>Approve or revoke verified recruiter status</td></tr>
</table>

<div class="page-break"></div>

<!-- CHAPTER 7: TESTING & QA -->
<h1>CHAPTER 7: TESTING, SECURITY AUDITING & VERIFICATION</h1>

<h2>7.1 Automated Test Execution Results (15/15 Passed)</h2>
<p>
HireMatch AI includes an automated Jest and Supertest test suite exercising authentication, authorization, RBAC boundary enforcement, NLP parsing, mathematical matching, and administration endpoints.
</p>

<pre>
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
Snapshots:   0 total
Time:        1.873 s
Ran all test suites.
</pre>

<h2>7.2 Security Hardening Measures</h2>
<ul>
  <li><strong>RBAC Enforcement:</strong> All endpoints verify role permissions server-side (never relying on hidden frontend UI buttons).</li>
  <li><strong>Admin Escalation Prevention:</strong> Registration requests attempting to set <code>role: 'admin'</code> are immediately rejected with HTTP 403 Forbidden.</li>
  <li><strong>Bcrypt Password Hashing:</strong> User passwords are salted and hashed with 10 rounds of bcrypt before persistent database storage.</li>
  <li><strong>HTTP Security Headers:</strong> Helmet middleware automatically enforces DNS prefetch control, frameguard (anti-clickjacking), and XSS filters.</li>
  <li><strong>CORS & Rate Limiting:</strong> Configured to allow authenticated client origins while throttling malicious requests via <code>express-rate-limit</code>.</li>
</ul>

<div class="page-break"></div>

<!-- CHAPTER 8 & 9: DEPLOYMENT & CONCLUSION -->
<h1>CHAPTER 8: DEPLOYMENT & CLOUD INFRASTRUCTURE</h1>
<p>
The HireMatch AI platform is fully architected for continuous cloud deployment:
</p>
<ul>
  <li><strong>Frontend (Vercel):</strong> Built using <code>npm run build</code> into static assets distributed globally via Vercel Edge CDN with automatic SPA routing rewrites.</li>
  <li><strong>Backend (Render / Railway):</strong> Containerized Node.js service running behind a reverse proxy with automated TLS certificate management.</li>
  <li><strong>Production Database (MongoDB Atlas):</strong> Managed replica set with automated backups, encryption at rest, and IP access lists.</li>
</ul>

<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<h1>CHAPTER 9: CONCLUSION & FUTURE ENHANCEMENTS</h1>

<h2>9.1 Conclusion</h2>
<p>
HireMatch AI successfully demonstrates an end-to-end recruitment platform that unites modern web engineering with explainable artificial intelligence. By combining automated PDF/DOCX parsing, mathematical TF-IDF vector matching, multi-week learning roadmaps, an interactive career assistant, and a 6-stage ATS lifecycle, the system eliminates traditional screening biases while providing transparent, actionable insights for candidates and recruiters alike.
</p>

<h2>9.2 Future Enhancements</h2>
<ol>
  <li><strong>Transformer Embeddings:</strong> Complementing TF-IDF with BERT/RoBERTa dense embeddings for deeper contextual nuance.</li>
  <li><strong>WebRTC Video Interviews:</strong> Conducting and recording live video interviews directly within the scheduled interview module.</li>
  <li><strong>Automated Assessment Quizzes:</strong> Instant skill verification quizzes triggered dynamically when candidates apply for technical roles.</li>
  <li><strong>Webhook & Calendar Integrations:</strong> Automatic synchronization with Google Calendar, Outlook, and Slack notifications.</li>
</ol>

<div style="margin-top: 40px; padding: 15px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; text-align: center; font-size: 8.5pt; color: #64748b;">
  HireMatch AI • Intelligent Resume Screening & Job Recommendation System • Complete Engineering Project Report
</div>

</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, htmlContent);
console.log('HTML report generated at:', OUTPUT_HTML);

async function convertHtmlToPdf() {
  console.log('Generating PDF via headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm',
    },
  });

  await browser.close();
  console.log('PDF successfully generated at:', OUTPUT_PDF);
  const stats = fs.statSync(OUTPUT_PDF);
  console.log(`PDF Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

convertHtmlToPdf();

