import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import api from '../../services/api';

const SkillGapPage = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load jobs list for dropdown selection
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs?limit=50');
        if (res.success) {
          setJobs(res.data);
          if (!selectedJobId && res.data.length > 0) {
            setSelectedJobId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  const runSkillGapAnalysis = async (jobId) => {
    try {
      setLoading(true);
      const res = await api.post('/recommendations/skills', {
        jobId: jobId || undefined,
      });
      if (res.success) {
        setGapData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      runSkillGapAnalysis(selectedJobId);
    }
  }, [selectedJobId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 mb-2">
          <BrainCircuit className="w-3.5 h-3.5" /> Career Growth Engine
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Skill Gap Analyzer & Learning Roadmaps
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Benchmark your existing competencies against target job requirements and get an actionable learning path.
        </p>
      </div>

      {/* Role Selector Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Select Target Job Posting to Compare Against:
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full sm:w-96 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title} — {j.company}
              </option>
            ))}
          </select>
        </div>

        {gapData && (
          <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block">
                Skill Match Rate
              </span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {gapData.matchPercentage}%
              </span>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      ) : gapData ? (
        <div className="space-y-8">
          {/* Comparison Cards: Existing vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Existing Skills */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Existing / Matched Skills ({gapData.matchedSkills.length})
                </h3>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  Acquired
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {gapData.matchedSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {s}
                  </span>
                ))}
                {gapData.matchedSkills.length === 0 && (
                  <p className="text-xs text-slate-400 italic">None of the required skills were detected.</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Identified Missing Skills ({gapData.missingSkills.length})
                </h3>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                  Action Required
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {gapData.missingSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {s}
                  </span>
                ))}
                {gapData.missingSkills.length === 0 && (
                  <p className="text-xs text-emerald-600 font-semibold">
                    Outstanding! You have no skill gaps for this target role.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Curated Learning Roadmaps */}
          {gapData.learningRoadmaps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Curated Learning Roadmaps for Missing Skills
              </h3>
              <p className="text-xs text-slate-500">
                Follow these structured learning phases and recommended resources to bridge your skill gaps.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gapData.learningRoadmaps.map((rm, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {rm.skill}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-500" /> ~{rm.estimatedWeeks} Weeks
                          </span>
                          <span>•</span>
                          <span className="capitalize">{rm.difficulty}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-3">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Core Topics to Master:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                          {(rm.topics || []).map((t, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Official Tutorials & Documentation:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(rm.resources || []).map((r, i) => (
                          <a
                            key={i}
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition"
                          >
                            {r.title} <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SkillGapPage;
