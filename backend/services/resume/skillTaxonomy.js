// Comprehensive tech and soft skill taxonomy with categories and aliases
const SKILL_TAXONOMY = {
  // Programming Languages
  javascript: { category: 'programming_language', aliases: ['js', 'ecmascript'] },
  typescript: { category: 'programming_language', aliases: ['ts'] },
  python: { category: 'programming_language', aliases: ['py'] },
  java: { category: 'programming_language', aliases: ['core java', 'j2ee'] },
  c: { category: 'programming_language', aliases: [] },
  'c++': { category: 'programming_language', aliases: ['cpp'] },
  'c#': { category: 'programming_language', aliases: ['csharp', '.net'] },
  ruby: { category: 'programming_language', aliases: [] },
  php: { category: 'programming_language', aliases: [] },
  go: { category: 'programming_language', aliases: ['golang'] },
  rust: { category: 'programming_language', aliases: [] },
  swift: { category: 'programming_language', aliases: [] },
  kotlin: { category: 'programming_language', aliases: [] },
  scala: { category: 'programming_language', aliases: [] },
  sql: { category: 'database', aliases: ['structured query language', 'ansi sql'] },
  r: { category: 'ai_ml', aliases: ['r-lang'] },

  // Frontend Frameworks & Libraries
  react: { category: 'frontend', aliases: ['react.js', 'reactjs'] },
  angular: { category: 'frontend', aliases: ['angular.js', 'angularjs', 'angular2+'] },
  vue: { category: 'frontend', aliases: ['vue.js', 'vuejs'] },
  nextjs: { category: 'frontend', aliases: ['next.js'] },
  nuxtjs: { category: 'frontend', aliases: ['nuxt.js'] },
  svelte: { category: 'frontend', aliases: ['sveltekit'] },
  html: { category: 'frontend', aliases: ['html5'] },
  css: { category: 'frontend', aliases: ['css3'] },
  sass: { category: 'frontend', aliases: ['scss'] },
  tailwind: { category: 'frontend', aliases: ['tailwindcss', 'tailwind css'] },
  bootstrap: { category: 'frontend', aliases: ['bootstrap5', 'bootstrap 5'] },
  redux: { category: 'frontend', aliases: ['redux toolkit', 'rtk'] },

  // Backend Frameworks & Runtimes
  'node.js': { category: 'backend', aliases: ['nodejs', 'node'] },
  express: { category: 'backend', aliases: ['express.js', 'expressjs'] },
  nestjs: { category: 'backend', aliases: ['nest.js'] },
  django: { category: 'backend', aliases: ['django rest framework', 'drf'] },
  flask: { category: 'backend', aliases: [] },
  fastapi: { category: 'backend', aliases: [] },
  'spring boot': { category: 'backend', aliases: ['springboot', 'spring'] },
  laravel: { category: 'backend', aliases: [] },
  'asp.net': { category: 'backend', aliases: ['asp.net core', 'dotnet core'] },
  graphql: { category: 'backend', aliases: ['apollo graphql'] },
  'rest api': { category: 'backend', aliases: ['restful api', 'rest apis'] },

  // Databases & Storage
  mongodb: { category: 'database', aliases: ['mongo', 'mongoose'] },
  postgresql: { category: 'database', aliases: ['postgres', 'psql'] },
  mysql: { category: 'database', aliases: [] },
  redis: { category: 'database', aliases: ['redis cache'] },
  sqlite: { category: 'database', aliases: [] },
  oracle: { category: 'database', aliases: ['oracle db'] },
  cassandra: { category: 'database', aliases: [] },
  elasticsearch: { category: 'database', aliases: ['elastic search'] },
  firebase: { category: 'database', aliases: ['firestore'] },

  // DevOps & Cloud
  docker: { category: 'devops', aliases: ['containerization'] },
  kubernetes: { category: 'devops', aliases: ['k8s'] },
  aws: { category: 'cloud', aliases: ['amazon web services', 'ec2', 's3', 'lambda'] },
  azure: { category: 'cloud', aliases: ['microsoft azure'] },
  gcp: { category: 'cloud', aliases: ['google cloud', 'google cloud platform'] },
  git: { category: 'devops', aliases: ['github', 'gitlab', 'bitbucket'] },
  'ci/cd': { category: 'devops', aliases: ['jenkins', 'github actions', 'gitlab ci'] },
  terraform: { category: 'devops', aliases: ['iac'] },
  linux: { category: 'devops', aliases: ['ubuntu', 'bash', 'shell scripting'] },
  nginx: { category: 'devops', aliases: [] },

  // AI & Data Science
  'machine learning': { category: 'ai_ml', aliases: ['ml'] },
  'deep learning': { category: 'ai_ml', aliases: ['dl'] },
  'natural language processing': { category: 'ai_ml', aliases: ['nlp'] },
  tensorflow: { category: 'ai_ml', aliases: ['tf'] },
  pytorch: { category: 'ai_ml', aliases: ['torch'] },
  'scikit-learn': { category: 'ai_ml', aliases: ['sklearn'] },
  pandas: { category: 'ai_ml', aliases: [] },
  numpy: { category: 'ai_ml', aliases: [] },
  opencv: { category: 'ai_ml', aliases: ['computer vision'] },
  'large language models': { category: 'ai_ml', aliases: ['llm', 'llms', 'genai', 'generative ai'] },

  // Soft Skills & Methodologies
  agile: { category: 'soft_skills', aliases: ['scrum', 'kanban'] },
  leadership: { category: 'soft_skills', aliases: ['team leadership', 'mentoring'] },
  communication: { category: 'soft_skills', aliases: ['verbal communication', 'presentation'] },
  'problem solving': { category: 'soft_skills', aliases: ['analytical skills', 'critical thinking'] },
  teamwork: { category: 'soft_skills', aliases: ['collaboration'] },
  'time management': { category: 'soft_skills', aliases: ['multitasking'] },
};

module.exports = SKILL_TAXONOMY;

