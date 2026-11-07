/**
 * Explainable TF-IDF Vectorizer and Cosine Similarity Matching Engine
 * Implements pure mathematical NLP calculation without heavy ESM dependencies.
 */

// Common English stopwords to ignore during semantic comparison
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could', 'did', 'do',
  'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'let', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
  'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their',
  'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would',
  'you', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenize and normalize text into clean words
 */
const tokenize = (text) => {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9#+.]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
};

/**
 * Calculate Term Frequency (TF) for a token list
 */
const calculateTF = (tokens) => {
  const tf = {};
  const total = tokens.length;
  if (total === 0) return tf;

  tokens.forEach((t) => {
    tf[t] = (tf[t] || 0) + 1;
  });

  // Normalize by total tokens
  for (const t in tf) {
    tf[t] = tf[t] / total;
  }
  return tf;
};

/**
 * Compute cosine similarity between two texts using TF-IDF vectorization
 */
const calculateTfIdfCosineSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;

  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const tf1 = calculateTF(tokens1);
  const tf2 = calculateTF(tokens2);

  // Vocabulary
  const vocab = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);

  // IDF across these 2 documents
  const numDocs = 2;
  const idf = {};

  vocab.forEach((term) => {
    let docsWithTerm = 0;
    if (tf1[term]) docsWithTerm++;
    if (tf2[term]) docsWithTerm++;
    // Smoothed inverse document frequency: log(1 + (N / df))
    idf[term] = Math.log(1 + (numDocs / docsWithTerm));
  });

  // Dot product and Euclidean norms
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  vocab.forEach((term) => {
    const v1 = (tf1[term] || 0) * idf[term];
    const v2 = (tf2[term] || 0) * idf[term];

    dotProduct += v1 * v2;
    norm1 += v1 * v1;
    norm2 += v2 * v2;
  });

  if (norm1 === 0 || norm2 === 0) return 0;

  const cosineSimilarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  return Math.min(Math.max(cosineSimilarity, 0), 1);
};

/**
 * Compare candidate resume/profile with a Job posting
 */
const calculateJobCompatibility = (candidateData, job) => {
  // 1. Technical Skills Matching
  const candidateSkills = (candidateData.technicalSkills || candidateData.skills || []).map((s) =>
    s.toLowerCase().trim()
  );
  const requiredSkills = (job.requiredSkills || []).map((s) => s.toLowerCase().trim());
  const preferredSkills = (job.preferredSkills || []).map((s) => s.toLowerCase().trim());

  const matchingRequired = requiredSkills.filter((reqSkill) =>
    candidateSkills.some((candSkill) => candSkill.includes(reqSkill) || reqSkill.includes(candSkill))
  );

  const missingRequired = requiredSkills.filter((reqSkill) =>
    !candidateSkills.some((candSkill) => candSkill.includes(reqSkill) || reqSkill.includes(candSkill))
  );

  const matchingPreferred = preferredSkills.filter((prefSkill) =>
    candidateSkills.some((candSkill) => candSkill.includes(prefSkill) || prefSkill.includes(candSkill))
  );

  let technicalSkillMatch = 0;
  if (requiredSkills.length > 0) {
    const requiredWeightScore = (matchingRequired.length / requiredSkills.length) * 85;
    const preferredBonus = preferredSkills.length > 0
      ? (matchingPreferred.length / preferredSkills.length) * 15
      : 15;
    technicalSkillMatch = Math.min(Math.round(requiredWeightScore + preferredBonus), 100);
  } else {
    technicalSkillMatch = 75; // No strict required skills given
  }

  // 2. Experience Match
  const candidateYears = candidateData.totalYearsExperience || 0;
  let experienceMatch = 50;

  if (job.experienceMin !== undefined) {
    if (candidateYears >= job.experienceMin && candidateYears <= (job.experienceMax || 15)) {
      experienceMatch = 100;
    } else if (candidateYears < job.experienceMin) {
      const diff = job.experienceMin - candidateYears;
      experienceMatch = Math.max(30, Math.round(100 - diff * 25));
    } else {
      // Overqualified but suitable
      experienceMatch = 90;
    }
  }

  // 3. Education Match
  let educationMatch = 75;
  const eduText = (
    JSON.stringify(candidateData.education || []) + ' ' + (candidateData.rawText || '')
  ).toLowerCase();

  if (job.qualification) {
    const qualLower = job.qualification.toLowerCase();
    if (
      (qualLower.includes('master') && (eduText.includes('master') || eduText.includes('mca') || eduText.includes('m.sc'))) ||
      (qualLower.includes('bachelor') && (eduText.includes('bachelor') || eduText.includes('b.tech') || eduText.includes('bca') || eduText.includes('b.e')))
    ) {
      educationMatch = 100;
    } else if (eduText.includes('degree') || eduText.includes('graduate')) {
      educationMatch = 80;
    }
  }

  // 4. Content TF-IDF Relevance
  const jobFullText = `${job.title} ${job.description} ${(job.requiredSkills || []).join(' ')}`;
  const resumeText = candidateData.rawText || candidateSkills.join(' ');
  const tfidfScore = calculateTfIdfCosineSimilarity(resumeText, jobFullText);
  const keywordMatch = Math.round(tfidfScore * 100);

  // 5. Overall Weighted Compatibility Score
  // Weights: Skills: 45%, Experience: 25%, Keywords: 15%, Education: 15%
  const overallScore = Math.round(
    technicalSkillMatch * 0.45 +
    experienceMatch * 0.25 +
    keywordMatch * 0.15 +
    educationMatch * 0.15
  );

  // Build human-readable explanations
  const reasons = [];
  if (matchingRequired.length > 0) {
    reasons.push(`Strong overlap in ${matchingRequired.length} essential skill(s): ${matchingRequired.slice(0, 4).join(', ')}.`);
  }
  if (experienceMatch >= 80) {
    reasons.push(`Experience level matches the required ${job.experienceMin}–${job.experienceMax} years range.`);
  } else if (experienceMatch < 60) {
    reasons.push(`Candidate experience (${candidateYears} yrs) is below the preferred minimum (${job.experienceMin} yrs).`);
  }
  if (missingRequired.length > 0) {
    reasons.push(`Opportunity to learn missing key requirement(s): ${missingRequired.slice(0, 3).join(', ')}.`);
  }

  return {
    overallScore: Math.min(Math.max(overallScore, 10), 99),
    breakdown: {
      technicalSkillMatch,
      experienceMatch,
      educationMatch,
      keywordMatch,
      matchingSkills: Array.from(new Set([...matchingRequired, ...matchingPreferred])),
      missingSkills: missingRequired,
      reason: reasons.join(' '),
    },
    disclaimer:
      'This compatibility score is an algorithmic estimate calculated using skill overlap, keyword relevance, and experience criteria. It is designed to assist evaluation and does not guarantee job fit or hiring outcome.',
  };
};

module.exports = {
  tokenize,
  calculateTF,
  calculateTfIdfCosineSimilarity,
  calculateJobCompatibility,
};
