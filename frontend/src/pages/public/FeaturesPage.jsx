import React from 'react';
import {
  FileText,
  BrainCircuit,
  Target,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Workflow,
  Cpu,
  ShieldAlert,
  Sliders,
  Scale,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Core AI Capabilities
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Deep Dive: VJOBAI Technologies
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
          VJOBAI is engineered with transparent, explainable Natural Language Processing algorithms to eliminate black-box bias, improve candidate shortlisting, and empower career advancement.
        </p>
      </div>

      <div className="space-y-16">
        {/* Feature 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Feature 1
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Intelligent Resume Parser & Entity Extraction
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              Accepts PDF and DOCX files. Converts binary documents into parsed JSON containing contact info, education levels, technical and soft skills (mapped against our 70+ skill taxonomy), work history, and project summaries.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Boundary-aware regex & phrase tokenization.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Manual correction UI to adjust parsed skills if needed.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-format document normalization.
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
            <span className="text-slate-500">// Parsed Resume JSON Payload Output</span>
            <pre className="text-indigo-300 mt-2">
{`{
  "name": "Venu Gopal",
  "technicalSkills": ["react", "node.js", "mongodb", "sql"],
  "education": [{
    "degree": "MCA",
    "grade": "8.8 CGPA"
  }],
  "completenessScore": 92,
  "measurableAchievementsFound": true
}`}
            </pre>
          </div>
        </div>

        {/* Feature 2 & 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="order-2 lg:order-1 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>Weighted Formula Model</span>
              <Scale className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-xs space-y-1.5 font-mono text-slate-600 dark:text-slate-400">
              <p>Score = (0.45 * SkillMatch)</p>
              <p>        + (0.25 * ExperienceMatch)</p>
              <p>        + (0.15 * TF-IDF Relevancy)</p>
              <p>        + (0.15 * EducationMatch)</p>
            </div>
            <p className="text-[11px] text-slate-500">
              Zero demographic bias: age, gender, and personal traits are strictly excluded from calculation.
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 mb-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Feature 2 & 3
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Explainable Compatibility & Recommendation Engine
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              Every job match score (0–100%) is paired with full explainability: matching required skills, missing skills, and detailed rationale. Jobs are automatically segmented into Best Matches, Remote roles, and Internships.
            </p>
          </div>
        </div>

        {/* Feature 4 & 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 mb-4">
              <Sliders className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Feature 4 & 5
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Skill Gap Analyzer & Quality Assistant
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              Candidates can select any target job to instantly see exact missing qualifications and access a week-by-week learning syllabus. The Quality Assistant highlights passive verbs and recommends metric-driven improvements.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Interactive Gap Example
            </h4>
            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p><strong>Candidate:</strong> Python, SQL, HTML, CSS, JavaScript</p>
              <p><strong>Target Role:</strong> Python, SQL, React.js, Node.js, MongoDB</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-xs">
              <span className="font-bold text-emerald-600">40% Match</span> • 3 Missing Skills (React, Node, Mongo) with immediate learning roadmaps attached.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition"
        >
          Try All Features Free
        </Link>
      </div>
    </div>
  );
};

export default FeaturesPage;

