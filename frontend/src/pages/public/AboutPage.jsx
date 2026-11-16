import React from 'react';
import { Sparkles, Code2, ShieldCheck, Database, Award, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          About The Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          VJOBAI Architecture & Engineering
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
          VJOBAI is an intelligent recruitment platform engineered by Venu to connect job seekers and hiring teams through explainable resume analysis, mathematical vector matching, and automated candidate ranking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-14">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Code2 className="w-8 h-8 text-indigo-600 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Architecture</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Decoupled React.js (Vite) client interacting with a modular Node.js/Express REST API secured by JWT, bcrypt, and Helmet headers.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Database className="w-8 h-8 text-emerald-600 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Data Modeling</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            12 normalized Mongoose models with references, unique indexes, text search indexes, and activity audit logging.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">AI & Machine Learning</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            TF-IDF cosine similarity, NLP skill extraction, skill gap roadmaps, and recruiter AI candidate ranking.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 max-w-3xl mx-auto">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-indigo-600" /> Engineering & Security Standards
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Developed according to rigorous software engineering best practices: test-driven development (TDD) with Jest, responsive UI/UX design, environment variable protection, role-based authorization, centralized error handling, and cloud deployment readiness.
        </p>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Platform Status:</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Production Grade & Verified
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

