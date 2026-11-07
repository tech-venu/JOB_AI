/**
 * AI-Powered Resume Improvement Assistant & Analysis
 */
const analyzeResumeQuality = (rawText, parsedData) => {
  const detectedSections = [];
  const missingSections = [];
  const strengths = [];
  const weaknesses = [];
  const suggestedImprovements = [];

  const lowerText = rawText.toLowerCase();

  // Section checks
  const sectionChecks = [
    { name: 'Contact Information', check: () => Boolean(parsedData.email || parsedData.phone) },
    { name: 'Professional Summary / Objective', check: () => /summary|objective|profile|about me/i.test(lowerText) },
    { name: 'Technical Skills', check: () => (parsedData.technicalSkills && parsedData.technicalSkills.length >= 3) },
    { name: 'Work Experience', check: () => /experience|employment|work history/i.test(lowerText) },
    { name: 'Education', check: () => /education|academics|university|college|degree/i.test(lowerText) },
    { name: 'Projects', check: () => /projects|portfolio|initiatives/i.test(lowerText) },
    { name: 'Certifications', check: () => /certif|credentials|licenses/i.test(lowerText) },
  ];

  sectionChecks.forEach((s) => {
    if (s.check()) {
      detectedSections.push(s.name);
    } else {
      missingSections.push(s.name);
    }
  });

  // Measurable achievements detection (e.g., 20%, $50k, 5x, reduced by, increased by, managed 10)
  const measurablePattern = /(\b\d+%\b|\$\d+|\b\d+x\b|\bincreased\b|\breduced\b|\bimproved\b|\bgrew\b|\bmanaged \d+|\blead \d+|\bdelivered\b|\bsaved\b)/i;
  const measurableAchievementsFound = measurablePattern.test(rawText);

  if (measurableAchievementsFound) {
    strengths.push('Includes quantitative metrics and impact-oriented achievements.');
  } else {
    weaknesses.push('Lacks quantifiable metrics (e.g. percentages, speed improvements, revenue or cost savings).');
    suggestedImprovements.push(
      'Add measurable metrics (e.g., "Improved response time by 35%", "Managed a team of 4 engineers", "Scaled system to 10k daily active users").'
    );
  }

  // Skills assessment
  if (parsedData.technicalSkills && parsedData.technicalSkills.length >= 6) {
    strengths.push(`Rich technical skills identified (${parsedData.technicalSkills.length} core competencies).`);
  } else if (parsedData.technicalSkills && parsedData.technicalSkills.length > 0) {
    suggestedImprovements.push(
      'Broaden your Technical Skills section with specific modern frameworks, databases, and deployment tools.'
    );
  } else {
    weaknesses.push('Very few recognizable technical skills were detected by the parser.');
    suggestedImprovements.push('Create a dedicated "Technical Skills" section categorized by Frontend, Backend, Databases, and Tools.');
  }

  // Contact info assessment
  if (parsedData.email && parsedData.phone) {
    strengths.push('Clear contact details present (email and phone detected).');
  } else {
    if (!parsedData.email) suggestedImprovements.push('Include a clear professional email address at the top.');
    if (!parsedData.phone) suggestedImprovements.push('Ensure your phone number is clearly formatted at the top header.');
  }

  // Missing sections suggestions
  if (missingSections.includes('Professional Summary / Objective')) {
    suggestedImprovements.push('Include a 2-3 sentence executive summary highlighting your domain expertise and career aspiration.');
  }
  if (missingSections.includes('Projects')) {
    suggestedImprovements.push('Add 2-3 prominent technical projects detailing the architecture, tech stack used, and live demo/repository URLs.');
  }
  if (missingSections.includes('Certifications')) {
    suggestedImprovements.push('Add cloud or domain certifications (e.g., AWS, MongoDB, Coursera) to boost applicant credibility.');
  }

  // Action verbs check
  const weakVerbs = ['worked on', 'helped with', 'responsible for', 'handled', 'did'];
  const foundWeakVerbs = weakVerbs.filter((wv) => lowerText.includes(wv));
  if (foundWeakVerbs.length > 0) {
    weaknesses.push(`Found passive phrasing such as: "${foundWeakVerbs.slice(0, 2).join('", "')}".`);
    suggestedImprovements.push(
      'Replace passive phrases like "responsible for" with strong action verbs such as "Architected", "Engineered", "Orchestrated", "Implemented".'
    );
  }

  // Calculate scores
  let completenessScore = Math.round((detectedSections.length / sectionChecks.length) * 100);
  let formattingScore = 75;
  if (rawText.length > 400 && rawText.length < 5000) formattingScore += 15;
  if (detectedSections.length >= 5) formattingScore += 10;
  formattingScore = Math.min(formattingScore, 100);

  let overallScore = Math.round(
    completenessScore * 0.5 +
    formattingScore * 0.3 +
    (measurableAchievementsFound ? 20 : 5)
  );
  overallScore = Math.min(Math.max(overallScore, 10), 100);

  return {
    completenessScore,
    formattingScore,
    overallScore,
    detectedSections,
    missingSections,
    strengths,
    weaknesses,
    suggestedImprovements,
    measurableAchievementsFound,
  };
};

module.exports = {
  analyzeResumeQuality,
};
