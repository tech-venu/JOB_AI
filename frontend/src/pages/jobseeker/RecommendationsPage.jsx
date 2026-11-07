import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ArrowRight,
  Sliders,
  DollarSign,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const RecommendationsPage = () => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('bestMatches'); // 'bestMatches' | 'recommendedJobs' | 'remoteJobs' | 'internshipJobs'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await api.get('/recommendations/jobs');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const getJobsForActiveTab = () => {
    if (!data) return [];
    return data[activeTab] || [];
  };

  const currentJobs = getJobsForActiveTab();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Algorithmic Matching
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Intelligent Job Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tailored job suggestions calculated against your extracted candidate profile and skills.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 max-w-2xl">
        <button
          onClick={() => setActiveTab('bestMatches')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'bestMatches'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Best Matches ({data?.bestMatches?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('recommendedJobs')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'recommendedJobs'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-indigo-500" /> All Recommended ({data?.recommendedJobs?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('remoteJobs')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'remoteJobs'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Remote Opportunities ({data?.remoteJobs?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('internshipJobs')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'internshipJobs'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Internships ({data?.internshipJobs?.length || 0})
        </button>
      </div>

      {/* Transparent Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <span>
          <strong>Explainability Notice:</strong> Match scores are calculated using a weighted combination of technical skill overlap (45%), experience alignment (25%), TF-IDF keyword relevancy (15%), and qualification background (15%). This algorithmic estimate is designed to assist evaluation, not guarantee hiring.
        </span>
      </div>

      {/* Grid of Recommended Jobs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : currentJobs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">No jobs found in this category</h4>
          <p className="text-xs text-slate-500 mt-1">Try switching to another tab or updating your skills.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentJobs.map((job) => (
            <div
              key={job._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {job.workplaceType} • {job.employmentType}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-indigo-500" /> {job.company} • {job.location}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Match Score</span>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {job.matchScore}%
                  </span>
                </div>
              </div>

              {/* Skills matched & missing */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Matching Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(job.matchBreakdown?.matchingSkills || []).map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {s}
                      </span>
                    ))}
                    {(job.matchBreakdown?.matchingSkills || []).length === 0 && (
                      <span className="text-slate-400 italic text-[11px]">No direct matches</span>
                    )}
                  </div>
                </div>

                {(job.matchBreakdown?.missingSkills || []).length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-500 block mb-1">Missing Skills to Learn:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.matchBreakdown.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Explanation statement */}
              {job.matchBreakdown?.reason && (
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                  {job.matchBreakdown.reason}
                </p>
              )}

              {/* Action bar */}
              <div className="pt-2 flex items-center justify-between">
                <Link
                  to={`/jobseeker/skill-gap?jobId=${job._id}`}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Analyze Skill Gap →
                </Link>
                <Link
                  to="/jobs"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-1"
                >
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
