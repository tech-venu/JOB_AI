import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Cpu, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                HireMatch<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              "Your Skills. Your Career. Your Perfect Match."
              <br />
              Intelligent resume parsing, explainable job compatibility scoring, and AI-driven recruitment.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>MCA Major Project</span>
            </div>
          </div>

          {/* Col 2: Candidates */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              For Job Seekers
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Search All Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobseeker/resume" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  AI Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/jobseeker/skill-gap" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Skill Gap & Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/jobseeker/assistant" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  AI Career Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Recruiters & Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              For Recruiters & Admins
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/recruiter/jobs/create" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Post a New Job
                </Link>
              </li>
              <li>
                <Link to="/recruiter/candidates" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  AI Candidate Ranking
                </Link>
              </li>
              <li>
                <Link to="/recruiter/analytics" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Recruitment Analytics
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Super Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Tech Stack & Verification */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Architecture & Tech
            </h4>
            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" /> React 18 + Vite + Tailwind
              </p>
              <p className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" /> Node.js + Express + Mongoose
              </p>
              <p className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" /> NLP + TF-IDF Vector Space
              </p>
              <p className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" /> MongoDB Atlas Database
              </p>
            </div>
            <div className="mt-3">
              <a
                href="https://github.com/tech-venu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600"
              >
                <Github className="w-4 h-4" /> github.com/tech-venu <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HireMatch AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for MCA Major Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
