/**
 * AI Career Assistant Service
 * Provides backend-only adapter with LLM integration support (e.g. OpenAI / Gemini)
 * and an intelligent, contextual local rule/knowledge engine fallback.
 */

// Local fallback knowledge engine with expert career advice
const generateLocalResponse = (message, context = {}) => {
  const query = (message || '').toLowerCase();
  const { role, skills = [], experienceLevel = 'entry', targetJobTitle = '' } = context;

  if (query.includes('interview') || query.includes('prepare') || query.includes('questions')) {
    return {
      reply: `Here is a structured 4-pillar interview preparation guide tailored for ${targetJobTitle || 'software engineering'}:

1. **System & Technical Architecture**:
   - Master Data Structures & Algorithms (Arrays, Hash Maps, Trees, Graphs, Dynamic Programming).
   - Review Core System Design principles: horizontal vs vertical scaling, load balancing, caching (Redis), database indexing, and microservices.

2. **STAR Method for Behavioral Rounds**:
   - Frame your project experience using **Situation, Task, Action, and Result**.
   - Emphasize quantifiable achievements (e.g., "Reduced page load time by 40% by implementing Redis caching").

3. **Core Language & Framework Mastery**:
   - Be prepared for live coding and deep-dive technical questions on ${skills.slice(0, 3).join(', ') || 'your primary stack'}.
   - Understand asynchronous patterns, closures, database query optimization, and REST/GraphQL API security.

4. **Questions to Ask the Interviewer**:
   - "What does the engineering deployment cycle look like on your team?"
   - "What are the biggest scalability challenges your architecture is facing this quarter?"`,
      source: 'HireMatch Expert Career System',
    };
  }

  if (query.includes('resume') || query.includes('cv') || query.includes('improve')) {
    return {
      reply: `Here are the top high-impact recommendations to elevate your resume for ATS screening:

1. **Quantify Every Bullet Point**:
   - Replace generic tasks ("worked on APIs") with impact statements: *"Engineered 12 RESTful microservice endpoints with Node.js & MongoDB, handling 15,000+ daily requests with 99.9% uptime."*

2. **Align Keywords with Job Descriptions**:
   - Ensure the specific technologies mentioned in the job post (e.g. Docker, CI/CD, React, TypeScript) are listed explicitly in both your Skills section and project descriptions.

3. **Format for ATS Scanners**:
   - Use clean single-column layouts, standard headers (Summary, Skills, Experience, Projects, Education), and export as standard PDF or DOCX without nested tables or graphic text boxes.

4. **Showcase Live Projects**:
   - Include direct GitHub repository links and live deployed application URLs for at least two comprehensive full-stack projects.`,
      source: 'HireMatch Expert Career System',
    };
  }

  if (query.includes('skill') || query.includes('learn') || query.includes('gap') || query.includes('roadmap')) {
    return {
      reply: `Based on current tech recruitment trends for modern web and AI development, here is a targeted learning progression:

1. **Phase 1: Full-Stack Fundamentals**
   - Deepen your command of React 18+ (Hooks, Context, State management) and Node.js/Express.
   - Master MongoDB aggregation pipelines, indexing, and Mongoose schema validation.

2. **Phase 2: Cloud & DevOps**
   - Learn Docker containerization for both frontend and backend services.
   - Practice deploying to cloud providers (Render, Vercel, AWS) and configuring automated GitHub Actions CI/CD workflows.

3. **Phase 3: AI & Next-Gen Capabilities**
   - Explore integrating NLP, vector embeddings, and LLM APIs into web applications.
   - Master prompt engineering, secure API key management, and streaming responses.`,
      source: 'HireMatch Expert Career System',
    };
  }

  if (query.includes('salary') || query.includes('negotiate') || query.includes('offer')) {
    return {
      reply: `Tips for successful salary and compensation negotiation:

1. **Benchmark Before You Answer**:
   - Research market compensation ranges for your location and experience level on platforms like Glassdoor, Levels.fyi, and AmbitionBox.
2. **Deflect Early Numbers**:
   - If asked for expectations early, say: *"I am focused on finding the right role match and would like to understand the full scope of responsibilities before discussing exact figures."*
3. **Anchor with a Range**:
   - When providing a figure, offer a realistic range where your minimum acceptable salary is near the bottom of that range.
4. **Negotiate Total Rewards**:
   - Consider the whole package: base pay, bonuses, remote work flexibility, learning stipends, and equity.`,
      source: 'HireMatch Expert Career System',
    };
  }

  // General helpful response
  return {
    reply: `Welcome to HireMatch AI Career Assistant! I am here to help accelerate your career journey. You can ask me:

- **"How can I optimize my resume for ATS screening?"**
- **"What skills should I learn to become a Senior Full-Stack Engineer?"**
- **"Give me technical and behavioral interview preparation questions."**
- **"How do I analyze skill gaps for a specific job posting?"**
- **"Tips for salary negotiation and portfolio building."**

What specific topic would you like to explore today?`,
    source: 'HireMatch Expert Career System',
  };
};

/**
 * Handle Career Assistant query
 */
const askCareerAssistant = async (message, context = {}) => {
  const provider = (process.env.AI_PROVIDER || 'none').toLowerCase();
  const apiKey = process.env.AI_API_KEY;

  // If an external LLM is configured (e.g., openai or gemini) and API key is present
  if (provider === 'gemini' && apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are the AI Career Assistant for HireMatch AI, an intelligent recruitment platform. Provide clear, professional, actionable, and encouraging career advice for job seekers and candidates. Format responses with markdown headings and bullet points.\n\nUser Question: ${message}`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return {
          reply: data.candidates[0].content.parts[0].text,
          source: 'Gemini AI Provider',
        };
      }
    } catch (err) {
      console.warn('[AI Assistant Adapter Warning] Remote LLM failed, falling back to local engine:', err.message);
    }
  }

  // Secure local fallback
  return generateLocalResponse(message, context);
};

module.exports = {
  askCareerAssistant,
  generateLocalResponse,
};

