# HireMatch AI – System Architecture Documentation

## Overview
HireMatch AI is an intelligent recruitment web application designed to eliminate recruitment bottlenecks and human bias using transparent Natural Language Processing (NLP) and vector-space TF-IDF matching.

---

## 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------+
|                   React + Vite SPA Client                       |
|   (Tailwind CSS, Lucide Icons, Recharts, React Router DOM)       |
+-----------------------------------------------------------------+
                               |
                   HTTPS / JSON REST API
                               |
+-----------------------------------------------------------------+
|                  Node.js + Express.js Backend                   |
|   (Helmet, CORS, JWT Auth, Express-Rate-Limit, Cookie Parser)   |
+-----------------------------------------------------------------+
     |                     |                      |
     v                     v                      v
+------------+     +-------------------+   +--------------------+
| Local /    |     |  Mongoose ODM     |   | AI & NLP Pipeline  |
| Multer Disk|     |  MongoDB Database |   | - pdf2json/Mammoth |
| Storage    |     |  (12 Models)      |   | - Skill Taxonomy   |
+------------+     +-------------------+   | - TF-IDF Matching  |
                                           | - Skill Gap Engine |
                                           | - Career Assistant |
                                           +--------------------+
```

---

## 2. Explainable Matching Algorithm

Compatibility Score between candidate $C$ and job $J$ is calculated using a transparent weighted multi-criteria model:

$$\text{Score} = (0.45 \times \text{SkillMatch}) + (0.25 \times \text{ExperienceMatch}) + (0.15 \times \text{Relevancy}_{\text{TF-IDF}}) + (0.15 \times \text{EducationMatch})$$

Where:
- $\text{SkillMatch}$: Overlap between candidate extracted skills and required/preferred skills.
- $\text{ExperienceMatch}$: Candidate years compared to $[J_{\min}, J_{\max}]$.
- $\text{Relevancy}_{\text{TF-IDF}}$: Cosine similarity of term frequency vectors between resume raw text and job description:
  $$\cos(\theta) = \frac{\mathbf{v}_{\text{resume}} \cdot \mathbf{v}_{\text{job}}}{\|\mathbf{v}_{\text{resume}}\| \|\mathbf{v}_{\text{job}}\|}$$
- $\text{EducationMatch}$: Alignment of degree credential (e.g. MCA, B.Tech, M.S.) with job qualifications.

---

## 3. Database Models (MongoDB Mongoose)

1. `User`: Core authentication, hashed passwords, RBAC roles (`jobseeker`, `recruiter`, `admin`), account status.
2. `CandidateProfile`: Candidate headline, location, education array, experience array, primary skills, expected salary.
3. `RecruiterProfile`: Company name, website, description, industry, company size, verification status.
4. `Resume`: Original & stored filenames, file size, raw text, structured `parsedData`, AI quality score.
5. `Job`: Title, company, recruiter reference, required & preferred skills, experience range, salary, text indexes.
6. `Application`: Job and candidate references, match score, breakdown, cover letter, and 6-stage status history.
7. `Skill`: Catalog of technical and soft skills, categories, aliases, and learning resources.
8. `SavedJob`: Candidate bookmarked jobs.
9. `Notification`: System and application notifications with unread tracking.
10. `Interview`: Scheduled interview rounds, timestamps, meeting links, and feedback.
11. `ActivityLog`: Security and administrative audit trail.
12. `PasswordResetToken`: SHA-256 hashed password reset tokens with automatic TTL index expiration.
