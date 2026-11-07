const fs = require('fs');
const path = require('path');

// Generates a valid standard PDF 1.4 file with candidate resume text
function createPdfWithText(outputPath, textLines) {
  const streamContent = `BT
/F1 12 Tf
50 750 Td
16 TL
${textLines.map(line => `(${line.replace(/[()\\]/g, '\\$&')}) '`).join('\n')}
ET`;

  const streamLength = Buffer.byteLength(streamContent);

  const objects = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj`,
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`,
  ];

  let header = '%PDF-1.4\n';
  let body = '';
  const xref = ['xref\n0 6\n0000000000 65535 f \n'];

  let offset = header.length;
  for (let i = 0; i < objects.length; i++) {
    const objStr = objects[i] + '\n';
    xref.push(String(offset).padStart(10, '0') + ' 00000 n \n');
    body += objStr;
    offset += Buffer.byteLength(objStr);
  }

  const xrefOffset = offset;
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const pdfData = header + body + xref.join('') + trailer;
  fs.writeFileSync(outputPath, pdfData, 'binary');
  console.log(`Generated sample resume PDF: ${outputPath}`);
}

const sampleCandidateLines = [
  "Venu Gopal",
  "Email: venu@example.com | Phone: +91 98765 43210 | Bengaluru, India",
  "GitHub: github.com/tech-venu | LinkedIn: linkedin.com/in/venu-gopal",
  "",
  "PROFESSIONAL SUMMARY",
  "Full-Stack Engineer with 2+ years of experience designing scalable MERN applications.",
  "Engineered 15+ RESTful microservices and optimized MongoDB queries reducing latency by 40%.",
  "",
  "TECHNICAL SKILLS",
  "Programming Languages: JavaScript, TypeScript, Python, SQL",
  "Frontend Frameworks: React, Next.js, Tailwind CSS, HTML5, CSS3, Redux",
  "Backend & Runtime: Node.js, Express, REST API, GraphQL",
  "Databases: MongoDB, PostgreSQL, Redis",
  "DevOps & Tools: Docker, Git, CI/CD, AWS, Linux",
  "Soft Skills: Problem Solving, Teamwork, Leadership, Communication",
  "",
  "WORK EXPERIENCE",
  "Associate Full-Stack Developer - Nexus Infotech Solutions (2025 - Present)",
  "- Engineered responsive React user dashboards with 99.9% uptime and zero regressions.",
  "- Integrated secure JWT authentication, rate limiting, and bcrypt password hashing.",
  "- Reduced page payload by 35% using dynamic chunking and asset compression.",
  "",
  "EDUCATION",
  "Master of Computer Applications (MCA) - Apex Institute of Technology (2024 - 2026)",
  "Grade: 8.8 CGPA | Focus: Distributed Systems and Artificial Intelligence",
  "",
  "PROJECTS",
  "HireMatch AI - Intelligent Recruitment & Job Recommendation System",
  "Built an intelligent hiring platform using React, Node.js, Express, MongoDB and TF-IDF NLP algorithms."
];

const target1 = path.join(__dirname, '../../docs/sample_resumes/Venu_Gopal_FullStack_Resume.pdf');
const target2 = path.join(__dirname, '../../frontend/public/samples/Venu_Gopal_FullStack_Resume.pdf');

createPdfWithText(target1, sampleCandidateLines);
createPdfWithText(target2, sampleCandidateLines);

