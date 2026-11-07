const fs = require('fs');
const PDFParser = require('pdf2json');
const mammoth = require('mammoth');
const SKILL_TAXONOMY = require('./skillTaxonomy');

/**
 * Extract raw text from PDF file path using pdf2json with Promise
 */
const extractTextFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on('pdfParser_dataReady', () => {
      try {
        const rawText = pdfParser.getRawTextContent();
        resolve(rawText || '');
      } catch (err) {
        reject(err);
      }
    });

    pdfParser.on('pdfParser_dataError', (errData) => {
      reject(new Error(errData.parserError || 'Failed to parse PDF document'));
    });

    try {
      pdfParser.loadPDF(filePath);
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Extract raw text from PDF or DOCX file path
 */
const extractTextFromFile = async (filePath, fileType) => {
  if (fileType === 'pdf') {
    return await extractTextFromPDF(filePath);
  } else if (fileType === 'docx' || fileType === 'doc') {
    const fileBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value || '';
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
};

/**
 * Extract contact information from resume text
 */
const extractContactInfo = (text) => {
  // Email regex
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[1].toLowerCase() : '';

  // Phone regex (standard 10-14 digit numbers)
  const phoneRegex = /(?:(?:\+?([1-9]{1,4})[ -]?)?(?:(?:\(\d{1,4}\))|\d{1,4})[ -]?)?(\d{3,4}[ -]?\d{3,4}[ -]?\d{3,4})/;
  const phoneMatch = text.match(phoneRegex);
  let phone = '';
  if (phoneMatch && phoneMatch[0].trim().replace(/\D/g, '').length >= 10) {
    phone = phoneMatch[0].trim();
  }

  // Candidate name heuristic: scan early non-empty lines that aren't header keywords
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) =>
      l.length > 0 &&
      !l.includes('@') &&
      !l.toLowerCase().includes('curriculum vitae') &&
      !l.toLowerCase().includes('resume') &&
      !l.toLowerCase().includes('summary') &&
      !l.toLowerCase().includes('project')
    );

  let name = '';
  if (lines.length > 0) {
    const candidateLine = lines[0];
    if (candidateLine.length < 50 && /^[a-zA-Z\s.-]+$/.test(candidateLine)) {
      name = candidateLine;
    }
  }

  // Location heuristic
  const locationRegex = /(?:Location|Address|City|Resident of)[:\s]+([^\n,]+(?:,\s*[^\n]+)?)/i;
  const locationMatch = text.match(locationRegex);
  let location = locationMatch ? locationMatch[1].trim() : '';

  if (!location) {
    if (text.includes('Bengaluru') || text.includes('Bangalore')) location = 'Bengaluru, India';
    else if (text.includes('San Francisco')) location = 'San Francisco, CA';
    else if (text.includes('New York')) location = 'New York, NY';
    else if (text.includes('Seattle')) location = 'Seattle, WA';
  }

  return { name, email, phone, location };
};

/**
 * Extract skills based on taxonomy dictionary and pattern matching
 */
const extractSkills = (text) => {
  const normalizedText = ` ${text.toLowerCase().replace(/[^a-z0-9#+.]/g, ' ')} `;
  const technicalSkills = new Set();
  const softSkills = new Set();

  for (const [skillKey, meta] of Object.entries(SKILL_TAXONOMY)) {
    // Check main skill name with boundary checking
    const escapedKey = skillKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-z0-9#+.])${escapedKey}(?:$|[^a-z0-9#+.])`, 'i');

    let matched = regex.test(normalizedText);

    if (!matched && meta.aliases && meta.aliases.length > 0) {
      for (const alias of meta.aliases) {
        const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const aliasRegex = new RegExp(`(?:^|[^a-z0-9#+.])${escapedAlias}(?:$|[^a-z0-9#+.])`, 'i');
        if (aliasRegex.test(normalizedText)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      if (meta.category === 'soft_skills') {
        softSkills.add(skillKey);
      } else {
        technicalSkills.add(skillKey);
      }
    }
  }

  return {
    technicalSkills: Array.from(technicalSkills),
    softSkills: Array.from(softSkills),
  };
};

/**
 * Extract education degrees and institutions
 */
const extractEducation = (text) => {
  const educationList = [];
  const degreeKeywords = [
    { degree: 'Master of Computer Applications (MCA)', regex: /\b(MCA|Master of Computer Applications)\b/i },
    { degree: 'Bachelor of Technology (B.Tech / B.E.)', regex: /\b(B\.?Tech|B\.?E\.?|Bachelor of Technology|Bachelor of Engineering)\b/i },
    { degree: 'Bachelor of Computer Applications (BCA)', regex: /\b(BCA|Bachelor of Computer Applications)\b/i },
    { degree: 'Master of Science (M.Sc)', regex: /\b(M\.?Sc|Master of Science)\b/i },
    { degree: 'Bachelor of Science (B.Sc)', regex: /\b(B\.?Sc|Bachelor of Science)\b/i },
    { degree: 'Master of Business Administration (MBA)', regex: /\b(MBA|Master of Business Administration)\b/i },
    { degree: "Bachelor's Degree", regex: /\b(Bachelor|Bachelors)\b/i },
    { degree: "Master's Degree", regex: /\b(Master|Masters)\b/i },
  ];

  degreeKeywords.forEach((deg) => {
    if (deg.regex.test(text)) {
      educationList.push({
        degree: deg.degree,
        institution: 'Recognized University / Institute',
        year: 'Completed',
        details: 'Extracted from resume credentials',
      });
    }
  });

  return educationList;
};

/**
 * Extract projects, experience lines, and certifications
 */
const extractExperienceAndProjects = (text) => {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const experience = [];
  const projects = [];
  const certifications = [];

  let currentSection = null;

  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (lower.match(/^(experience|work experience|employment history|professional experience)/i)) {
      currentSection = 'experience';
      return;
    }
    if (lower.match(/^(projects|key projects|academic projects)/i)) {
      currentSection = 'projects';
      return;
    }
    if (lower.match(/^(certifications|certificates|licenses)/i)) {
      currentSection = 'certifications';
      return;
    }
    if (lower.match(/^(education|skills|hobbies|interests|languages)/i)) {
      currentSection = null;
      return;
    }

    if (currentSection === 'experience' && line.length > 15 && experience.length < 5) {
      experience.push({
        title: line.substring(0, 50),
        company: 'Relevant Employer',
        duration: 'Extracted timeline',
        description: line,
      });
    } else if (currentSection === 'projects' && line.length > 15 && projects.length < 5) {
      projects.push({
        title: line.substring(0, 50),
        technologies: [],
        description: line,
      });
    } else if (currentSection === 'certifications' && line.length > 10 && certifications.length < 5) {
      certifications.push({
        name: line,
        issuer: 'Recognized Organization',
        year: 'Recent',
      });
    }
  });

  return { experience, projects, certifications };
};

/**
 * Main parser entry point
 */
const parseResume = async (filePath, fileType) => {
  const rawText = await extractTextFromFile(filePath, fileType);
  const contactInfo = extractContactInfo(rawText);
  const { technicalSkills, softSkills } = extractSkills(rawText);
  const education = extractEducation(rawText);
  const { experience, projects, certifications } = extractExperienceAndProjects(rawText);

  // Extract top keywords
  const words = rawText
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4);

  const wordFreq = {};
  words.forEach((w) => {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  });

  const sortedKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w]) => w);

  return {
    rawText,
    parsedData: {
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      location: contactInfo.location,
      technicalSkills,
      softSkills,
      education,
      experience,
      projects,
      certifications,
      keywords: sortedKeywords,
    },
  };
};

module.exports = {
  extractTextFromFile,
  extractContactInfo,
  extractSkills,
  extractEducation,
  parseResume,
};
