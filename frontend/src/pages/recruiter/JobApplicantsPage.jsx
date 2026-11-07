import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Award,
  ChevronRight,
  Send,
  MessageSquare,
  Building,
} from 'lucide-react';
import api from '../../services/api';

const JobApplicantsPage = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Status update modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('shortlisted');
  const [statusComment, setStatusComment] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });
      const res = await api.get(`/applications/job/${jobId}?${params.toString()}`);
      if (res.success) {
        setJob(res.data.job);
        setApplicants(res.data.applicants);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId, statusFilter]);

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setUpdateLoading(true);
      const res = await api.patch(`/applications/${selectedApp._id}/status`, {
        status: newStatus,
        comment: statusComment,
      });

      if (res.success) {
        setSelectedApp(null);
        fetchApplicants();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Title */}
      <div>
        <Link
          to="/recruiter/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Recruiter Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              AI Candidate Ranking Module
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Applicants for: {job?.title || 'Loading...'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {job?.company} • Required Skills: {(job?.requiredSkills || []).join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Stage:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Applicants ({applicants.length})</option>
              <option value="applied">Applied</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No applicants found for this filter</h3>
          <p className="text-xs text-slate-500 mt-1">Applications will appear here once submitted by job seekers.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* AI Rank Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">Rank</span>
                    <span className="text-lg font-black leading-none">#{app.aiRank}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {app.candidate?.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                      <span>{app.candidate?.email}</span>
                      <span>•</span>
                      <span>{app.candidate?.phone || 'No phone'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">AI Compatibility</span>
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {app.matchScore}%
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                      app.status === 'selected'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : app.status === 'rejected'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : app.status === 'shortlisted'
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Match Breakdown & Skills Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Matching Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {(app.matchBreakdown?.matchingSkills || []).map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {s}
                      </span>
                    ))}
                    {(app.matchBreakdown?.matchingSkills || []).length === 0 && (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Missing Requirements:</span>
                  <div className="flex flex-wrap gap-1">
                    {(app.matchBreakdown?.missingSkills || []).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                      >
                        {s}
                      </span>
                    ))}
                    {(app.matchBreakdown?.missingSkills || []).length === 0 && (
                      <span className="text-emerald-600 font-semibold">All requirements met</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Breakdown Score:</span>
                  <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Technical Skill:</span>
                      <strong>{app.matchBreakdown?.technicalSkillMatch || 0}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience Relevancy:</span>
                      <strong>{app.matchBreakdown?.experienceMatch || 0}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Explanation Text */}
              {app.matchBreakdown?.reason && (
                <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl">
                  <strong>AI Ranking Rationale:</strong> {app.matchBreakdown.reason}
                </p>
              )}

              {/* Cover Letter if any */}
              {app.coverLetter && (
                <div className="p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Candidate Cover Note:</span>
                  <p className="italic">"{app.coverLetter}"</p>
                </div>
              )}

              {/* Recruiter Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Applied: {new Date(app.createdAt).toLocaleDateString()}
                </span>

                <button
                  onClick={() => {
                    setSelectedApp(app);
                    setNewStatus(app.status);
                    setStatusComment('');
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs flex items-center gap-1.5"
                >
                  Update Decision & Status <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decision Update Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Update Candidate Decision
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate: {selectedApp.candidate?.name} (AI Rank #{selectedApp.aiRank})
            </p>

            <form onSubmit={handleUpdateStatusSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recruitment Stage
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="under_review">Under Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="selected">Selected / Offer Extended</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recruiter Feedback / Stage Note
                </label>
                <textarea
                  rows={3}
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="e.g. Cleared resume screening with 88% match. Round 1 technical interview scheduled..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  {updateLoading ? 'Saving...' : 'Confirm Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicantsPage;
