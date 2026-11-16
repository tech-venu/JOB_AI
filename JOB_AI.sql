-- ==============================================================================
-- HireMatch AI / JOB_AI Database Schema & Initial Data
-- Database Engine: MySQL / MariaDB (XAMPP / phpMyAdmin Compatible)
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `JOB_AI` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `JOB_AI`;

-- ------------------------------------------------------------------------------
-- Table 1: users
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `saved_jobs`;
DROP TABLE IF EXISTS `interviews`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `resumes`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `candidate_profiles`;
DROP TABLE IF EXISTS `recruiter_profiles`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `skills`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('jobseeker', 'recruiter', 'admin') NOT NULL DEFAULT 'jobseeker',
  `phone` VARCHAR(30) DEFAULT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT 1,
  `status` ENUM('active', 'suspended', 'pending') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 2: candidate_profiles
-- ------------------------------------------------------------------------------
CREATE TABLE `candidate_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `headline` VARCHAR(255) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `location` VARCHAR(150) DEFAULT NULL,
  `experience_level` ENUM('entry', 'mid', 'senior', 'lead', 'executive') DEFAULT 'entry',
  `total_years_experience` INT DEFAULT 0,
  `primary_skills` TEXT DEFAULT NULL,
  `secondary_skills` TEXT DEFAULT NULL,
  `education` JSON DEFAULT NULL,
  `experience` JSON DEFAULT NULL,
  `portfolio_website` VARCHAR(255) DEFAULT NULL,
  `github_url` VARCHAR(255) DEFAULT NULL,
  `linkedin_url` VARCHAR(255) DEFAULT NULL,
  `expected_salary_min` DECIMAL(10,2) DEFAULT NULL,
  `expected_salary_max` DECIMAL(10,2) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 3: recruiter_profiles
-- ------------------------------------------------------------------------------
CREATE TABLE `recruiter_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `company_name` VARCHAR(180) NOT NULL,
  `company_website` VARCHAR(255) DEFAULT NULL,
  `company_description` TEXT DEFAULT NULL,
  `industry` VARCHAR(100) DEFAULT NULL,
  `company_size` VARCHAR(50) DEFAULT '50-200',
  `location` VARCHAR(150) DEFAULT NULL,
  `verification_status` ENUM('pending', 'verified', 'rejected') DEFAULT 'verified',
  `verified_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 4: jobs
-- ------------------------------------------------------------------------------
CREATE TABLE `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recruiter_id` INT NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `company` VARCHAR(180) NOT NULL,
  `description` TEXT NOT NULL,
  `required_skills` TEXT NOT NULL,
  `preferred_skills` TEXT DEFAULT NULL,
  `qualification` VARCHAR(150) DEFAULT 'Bachelor\'s Degree',
  `experience_min` INT DEFAULT 0,
  `experience_max` INT DEFAULT 5,
  `salary_min` DECIMAL(10,2) DEFAULT 0,
  `salary_max` DECIMAL(10,2) DEFAULT 0,
  `currency` VARCHAR(10) DEFAULT 'USD',
  `location` VARCHAR(150) NOT NULL,
  `employment_type` ENUM('Full-time', 'Part-time', 'Contract', 'Internship') DEFAULT 'Full-time',
  `workplace_type` ENUM('on-site', 'remote', 'hybrid') DEFAULT 'remote',
  `status` ENUM('active', 'closed', 'draft') DEFAULT 'active',
  `application_deadline` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`recruiter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_jobs_status` (`status`),
  INDEX `idx_jobs_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 5: resumes
-- ------------------------------------------------------------------------------
CREATE TABLE `resumes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidate_id` INT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_url` VARCHAR(255) NOT NULL,
  `file_size` INT DEFAULT 0,
  `file_type` VARCHAR(50) DEFAULT 'pdf',
  `raw_text` LONGTEXT DEFAULT NULL,
  `parsed_data` JSON DEFAULT NULL,
  `completeness_score` INT DEFAULT 85,
  `is_primary` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 6: applications
-- ------------------------------------------------------------------------------
CREATE TABLE `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `candidate_id` INT NOT NULL,
  `resume_id` INT DEFAULT NULL,
  `match_score` INT DEFAULT 0,
  `score_breakdown` JSON DEFAULT NULL,
  `status` ENUM('applied', 'under_review', 'shortlisted', 'interview_scheduled', 'selected', 'rejected') DEFAULT 'applied',
  `status_history` JSON DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_apps_match_score` (`match_score`),
  INDEX `idx_apps_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 7: skills
-- ------------------------------------------------------------------------------
CREATE TABLE `skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(80) NOT NULL UNIQUE,
  `category` ENUM('language', 'framework', 'database', 'cloud', 'devops', 'ai_ml', 'tools', 'soft_skill') DEFAULT 'framework',
  `synonyms` VARCHAR(255) DEFAULT NULL,
  `popularity` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 8: interviews
-- ------------------------------------------------------------------------------
CREATE TABLE `interviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_id` INT NOT NULL,
  `recruiter_id` INT NOT NULL,
  `scheduled_date` DATETIME NOT NULL,
  `duration_minutes` INT DEFAULT 45,
  `meeting_link` VARCHAR(255) DEFAULT 'https://meet.google.com/xyz-hirematch',
  `stage` VARCHAR(80) DEFAULT 'Technical Interview Round 1',
  `notes` TEXT DEFAULT NULL,
  `status` ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`recruiter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 9: saved_jobs
-- ------------------------------------------------------------------------------
CREATE TABLE `saved_jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `job_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_saved_job` (`user_id`, `job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 10: notifications
-- ------------------------------------------------------------------------------
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipient_id` INT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'application_status',
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`recipient_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 11: activity_logs
-- ------------------------------------------------------------------------------
CREATE TABLE `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `resource_type` VARCHAR(80) DEFAULT NULL,
  `resource_id` VARCHAR(100) DEFAULT NULL,
  `details` JSON DEFAULT NULL,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 12: password_reset_tokens
-- ------------------------------------------------------------------------------
CREATE TABLE `password_reset_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- POPULATE SEED DATA
-- ==============================================================================

-- 1. Insert Users (passwords hashed with bcrypt: $2a$10$wK1... matches CandidatePassword123! / RecruiterPassword123!)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `is_verified`, `status`) VALUES
(1, 'HireMatch Administrator', 'admin@hirematch.ai', '$2a$10$T8Z7E.hE4g5Z3N4P1vJ3beR4JzN3Rz5Z7E.hE4g5Z3N4P1vJ3beR4', 'admin', '+1 (555) 019-2831', 1, 'active'),
(2, 'Alex Rivera', 'recruiter@google.com', '$2a$10$T8Z7E.hE4g5Z3N4P1vJ3beR4JzN3Rz5Z7E.hE4g5Z3N4P1vJ3beR4', 'recruiter', '+1 (650) 253-0000', 1, 'active'),
(3, 'Elena Rostova', 'recruiter@microsoft.com', '$2a$10$T8Z7E.hE4g5Z3N4P1vJ3beR4JzN3Rz5Z7E.hE4g5Z3N4P1vJ3beR4', 'recruiter', '+1 (425) 882-8080', 1, 'active'),
(4, 'Venu Gopal', 'venu@example.com', '$2a$10$T8Z7E.hE4g5Z3N4P1vJ3beR4JzN3Rz5Z7E.hE4g5Z3N4P1vJ3beR4', 'jobseeker', '+91 98765 43210', 1, 'active'),
(5, 'Sophia Chen', 'sophia@example.com', '$2a$10$T8Z7E.hE4g5Z3N4P1vJ3beR4JzN3Rz5Z7E.hE4g5Z3N4P1vJ3beR4', 'jobseeker', '+1 (415) 555-0182', 1, 'active');

-- 2. Insert Recruiter Profiles
INSERT INTO `recruiter_profiles` (`user_id`, `company_name`, `company_website`, `company_description`, `industry`, `company_size`, `location`, `verification_status`) VALUES
(2, 'Google Cloud Platform', 'https://cloud.google.com', 'Google Cloud accelerates organizations ability to digitally transform their business with best-in-class infrastructure and AI solutions.', 'Cloud Computing & AI', '1000+', 'Mountain View, CA (Hybrid / Remote)', 'verified'),
(3, 'Microsoft Corporation', 'https://microsoft.com', 'Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.', 'Enterprise Software & Cloud', '1000+', 'Redmond, WA (Remote available)', 'verified');

-- 3. Insert Candidate Profiles
INSERT INTO `candidate_profiles` (`user_id`, `headline`, `bio`, `location`, `experience_level`, `total_years_experience`, `primary_skills`, `secondary_skills`, `education`, `portfolio_website`, `github_url`, `linkedin_url`, `expected_salary_min`, `expected_salary_max`) VALUES
(4, 'Full-Stack Developer | React, Node.js, MongoDB & Cloud Architecture', 'Enthusiastic software engineer with experience building full-stack web applications, RESTful APIs, and implementing AI-assisted matching workflows.', 'Bengaluru, India (Open to Remote)', 'entry', 2, '["react", "node.js", "mongodb", "javascript", "express", "git", "sql"]', '["docker", "tailwind", "python"]', '[{"degree": "Master of Computer Applications (MCA)", "institution": "Apex Institute of Technology", "startYear": 2024, "endYear": 2026, "grade": "8.8 CGPA"}]', 'https://tech-venu.github.io', 'https://github.com/tech-venu', 'https://linkedin.com/in/tech-venu', 65000.00, 95000.00),
(5, 'AI/ML Research Engineer | NLP, LLM Fine-Tuning & Python', 'Machine learning practitioner specializing in Natural Language Processing, text mining, semantic vector embeddings, and deep learning pipelines.', 'San Francisco, CA (Remote)', 'mid', 3, '["python", "pytorch", "tensorflow", "nlp", "transformers", "sql", "docker"]', '["fastapi", "aws", "pandas", "numpy"]', '[{"degree": "M.S. in Computer Science (Artificial Intelligence)", "institution": "Stanford University", "startYear": 2022, "endYear": 2024, "grade": "3.9 GPA"}]', 'https://sophiachen.ai', 'https://github.com/sophiachen', 'https://linkedin.com/in/sophiachen-ai', 110000.00, 150000.00);

-- 4. Insert Jobs
INSERT INTO `jobs` (`id`, `recruiter_id`, `title`, `company`, `description`, `required_skills`, `preferred_skills`, `qualification`, `experience_min`, `experience_max`, `salary_min`, `salary_max`, `currency`, `location`, `employment_type`, `workplace_type`, `status`) VALUES
(1, 2, 'Senior Full-Stack Engineer (React & Node.js)', 'Google Cloud Platform', 'Join Google Cloud to build world-class enterprise web applications. You will design scalable microservices using Node.js and Express, build intuitive responsive user interfaces with React, and optimize high-throughput NoSQL and SQL databases.', 'react, node.js, express, mongodb, javascript, git', 'docker, kubernetes, typescript, cloud', 'Bachelor\'s or Master\'s Degree in Computer Science or related field', 2, 6, 120000.00, 160000.00, 'USD', 'Mountain View, CA / Remote', 'Full-time', 'remote', 'active'),
(2, 2, 'Applied AI / NLP Machine Learning Engineer', 'Google Cloud Platform', 'Lead the development of next-generation NLP solutions, semantic search engines, and automated document understanding pipelines using modern Transformer architectures and Python.', 'python, nlp, pytorch, transformers, machine learning, sql', 'docker, gcp, kubernetes, fastapi', 'Master\'s or Ph.D. in AI/ML or Computer Science', 2, 5, 135000.00, 175000.00, 'USD', 'Sunnyvale, CA (Hybrid / Remote)', 'Full-time', 'hybrid', 'active'),
(3, 3, 'Frontend Developer (React & TypeScript)', 'Microsoft Corporation', 'Craft elegant, accessible, and high-performance user interfaces for Azure enterprise developer tools. Work closely with design systems, modern state management, and modern browser standards.', 'react, javascript, typescript, css, tailwind, html', 'redux, jest, webpack, graphql', 'Bachelor\'s Degree in Computer Science or equivalent', 1, 4, 105000.00, 140000.00, 'USD', 'Redmond, WA / Remote', 'Full-time', 'remote', 'active'),
(4, 3, 'Cloud Backend & API Engineer (Node.js & Microservices)', 'Microsoft Corporation', 'Design resilient, fault-tolerant REST and gRPC microservice APIs that power millions of enterprise cloud operations globally. Ensure security compliance and optimal database performance.', 'node.js, express, sql, mongodb, docker, api design', 'redis, kubernetes, aws, azure', 'Bachelor\'s or Master\'s in Computer Science or MCA', 2, 5, 115000.00, 150000.00, 'USD', 'Seattle, WA (Remote)', 'Full-time', 'remote', 'active');

-- 5. Insert Resumes
INSERT INTO `resumes` (`id`, `candidate_id`, `file_name`, `file_url`, `file_size`, `file_type`, `completeness_score`, `is_primary`) VALUES
(1, 4, 'Venu_Gopal_FullStack_Resume.pdf', '/samples/Venu_Gopal_FullStack_Resume.pdf', 84520, 'pdf', 92, 1),
(2, 5, 'Sophia_Chen_AIML_Resume.pdf', '/samples/Sophia_Chen_AIML_Resume.pdf', 92140, 'pdf', 95, 1);

-- 6. Insert Applications with AI Match Scores
INSERT INTO `applications` (`job_id`, `candidate_id`, `resume_id`, `match_score`, `score_breakdown`, `status`, `notes`) VALUES
(1, 4, 1, 88, '{"technicalSkillScore": 92, "tfidfScore": 84, "experienceScore": 85, "educationScore": 90, "matchedSkills": ["react", "node.js", "express", "mongodb", "javascript", "git"], "missingSkills": ["docker", "kubernetes"]}', 'shortlisted', 'Candidate possesses strong full-stack MERN expertise and good architectural grounding.'),
(3, 4, 1, 74, '{"technicalSkillScore": 75, "tfidfScore": 72, "experienceScore": 75, "educationScore": 75, "matchedSkills": ["react", "javascript", "tailwind", "html"], "missingSkills": ["typescript", "redux"]}', 'under_review', 'Strong React fundamentals, missing TypeScript in primary skillset.'),
(2, 5, 2, 94, '{"technicalSkillScore": 96, "tfidfScore": 92, "experienceScore": 90, "educationScore": 98, "matchedSkills": ["python", "nlp", "pytorch", "transformers", "machine learning", "sql"], "missingSkills": ["gcp"]}', 'shortlisted', 'Exceptional academic pedigree (Stanford M.S.) with published NLP expertise.'),
(4, 4, 1, 81, '{"technicalSkillScore": 84, "tfidfScore": 78, "experienceScore": 80, "educationScore": 82, "matchedSkills": ["node.js", "express", "mongodb", "sql"], "missingSkills": ["redis", "azure"]}', 'applied', 'Application received through automated recommendation matching.');

-- 7. Insert Technology Skills Taxonomy
INSERT INTO `skills` (`name`, `category`, `synonyms`, `popularity`) VALUES
('react', 'framework', 'reactjs, react.js', 100),
('node.js', 'framework', 'nodejs, node', 95),
('javascript', 'language', 'js, es6, ecmascript', 100),
('typescript', 'language', 'ts', 85),
('python', 'language', 'python3, py', 95),
('mongodb', 'database', 'mongo, nosql', 80),
('sql', 'database', 'mysql, postgresql, postgres', 85),
('express', 'framework', 'expressjs, express.js', 80),
('docker', 'devops', 'containerization, containers', 75),
('kubernetes', 'devops', 'k8s', 65),
('tailwind', 'framework', 'tailwindcss, tailwind css', 70),
('pytorch', 'ai_ml', 'torch', 70),
('tensorflow', 'ai_ml', 'tf, keras', 65),
('nlp', 'ai_ml', 'natural language processing, text mining', 80),
('transformers', 'ai_ml', 'bert, gpt, huggingface', 75),
('git', 'tools', 'github, gitlab, version control', 90);

-- 8. Insert Activity Logs
INSERT INTO `activity_logs` (`user_id`, `action`, `resource_type`, `resource_id`, `details`, `ip_address`) VALUES
(1, 'SYSTEM_STARTUP', 'system', 'sys_init', '{"message": "HireMatch AI Engine Initialized Successfully"}', '127.0.0.1'),
(2, 'JOB_PUBLISHED', 'job', '1', '{"title": "Senior Full-Stack Engineer (React & Node.js)"}', '127.0.0.1'),
(4, 'APPLICATION_SUBMITTED', 'application', '1', '{"jobTitle": "Senior Full-Stack Engineer", "matchScore": 88}', '127.0.0.1'),
(2, 'APPLICATION_STATUS_UPDATED', 'application', '1', '{"previousStatus": "applied", "newStatus": "shortlisted"}', '127.0.0.1');
