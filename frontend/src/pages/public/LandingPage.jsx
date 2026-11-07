import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  FileCheck2,
  TrendingUp,
  Briefcase,
  Users,
  Search,
  Cpu,
  BarChart2,
  ShieldCheck,
  ChevronRight,
  Sliders,
  Target,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, role, login } = useAuth();
  const navigate = useNavigate();
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);

  // Quick 1-click evaluator login helper
  const handleQuickLogin = async (email, password, targetRole) => {
    try {
      setQuickLoginLoading(true);
      await login(email, password);
      if (targetRole === 'admin') navigate('/admin/dashboard');
      else if (targetRole === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/jobseeker/dashboard');
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    } finally {
      setQuickLoginLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
          <span>Next-Generation AI Recruitment & Match Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
          Your Skills. Your Career.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600">
            Your Perfect Match.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          HireMatch AI automates resume screening, extracts key technical competencies, pinpoints skill gaps, and calculates explainable compatibility scores using TF-IDF NLP algorithms.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/jobs"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition flex items-center justify-center gap-2 transform active:scale-95"
          >
            Explore Active Jobs <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/jobseeker/resume"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition flex items-center justify-center gap-2"
          >
            <FileCheck2 className="w-4 h-4 text-indigo-600" /> Upload & Analyze Resume
          </Link>
        </div>

        {/* Evaluator Quick Access Strip */}
        <div className="mt-12 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 max-w-3xl mx-auto text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> MCA Project Evaluator 1-Click Access
            </span>
            <span className="text-[11px] text-slate-500">Live Seeded Accounts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => handleQuickLogin('venu@example.com', 'CandidatePassword123!', 'jobseeker')}
              disabled={quickLoginLoading}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-md transition text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                  Job Seeker Demo
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Venu Gopal (MCA Candidate)</p>
            </button>

            <button
              onClick={() => handleQuickLogin('recruiter@google.com', 'RecruiterPassword123!', 'recruiter')}
              disabled={quickLoginLoading}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-md transition text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                  Recruiter Demo
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Google Cloud Talent Acquisition</p>
            </button>

            <button
              onClick={() => handleQuickLogin('admin@hirematch.ai', 'AdminPassword123!', 'admin')}
              disabled={quickLoginLoading}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-md transition text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                  Super Admin Demo
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Platform Administrator</p>
            </button>
          </div>
        </div>

        {/* Live Interactive Matching Visualizer Card */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left transition">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Live Algorithm Preview
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Senior Full-Stack Engineer (MERN) vs. Candidate Resume
              </h3>
            </div>
            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-2xl">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                  AI Match Score
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">88%</span>
              </div>
              <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Matching Skills (4/5)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['React.js', 'Node.js', 'MongoDB', 'JavaScript'].map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Identified Gap
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Docker Containerization'].map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                  >
                    <Sliders className="w-3 h-3 text-amber-600" /> {s}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Curated 2-week roadmap ready to close this gap.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Explainable Breakdown
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Technical Skills (45%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">92%</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience Alignment (25%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">85%</span>
                </div>
                <div className="flex justify-between">
                  <span>TF-IDF Content Relevancy (15%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">80%</span>
                </div>
                <div className="flex justify-between">
                  <span>Qualification (15%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core AI Features Grid */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Innovative Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              8 Powerful AI Features in One Platform
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              Engineered with modern NLP, TF-IDF vector math, and structured data extraction to empower both job seekers and hiring teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                1. Intelligent Resume Analyzer
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Extracts contact details, technical & soft skills, degrees, work history, and projects from PDF/DOCX resumes with manual correction support.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                2. AI Compatibility Engine
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculates transparent 0–100 compatibility scores based on weighted skill overlap, experience ranges, and TF-IDF cosine similarity.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                3. Intelligent Job Recommendations
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatically serves Best Matches, Remote roles, Internships, and recently posted opportunities personalized to candidate profiles.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                4. Skill Gap Analyzer
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Analyzes missing competencies between candidates and jobs, providing personalized week-by-week learning roadmaps and curated tutorials.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                5. Resume Quality Assistant
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Flags missing sections, detects passive phrasing, and highlights the lack of measurable metrics without hallucinating false credentials.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                6. Recruiter Candidate Ranking
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Recruiters see applicants automatically ranked by AI match score, with full transparency, human shortlist controls, and interview scheduling.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                7. AI Career Assistant
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Interactive chat assistant for resume tips, interview prep questions, salary negotiation advice, with secure local fallback and LLM adapter.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                8. Application Tracking System
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Full 6-stage lifecycle (Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Rejected) with status timeline auditing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Match Your Skills with the Right Role?
            </h3>
            <p className="mt-3 text-sm text-indigo-200">
              Join HireMatch AI today as a Job Seeker or Recruiter and experience algorithmic hiring efficiency.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm hover:bg-indigo-50 shadow-md transition"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-700/60 text-white font-bold text-sm hover:bg-indigo-700 border border-indigo-500/40 transition"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

