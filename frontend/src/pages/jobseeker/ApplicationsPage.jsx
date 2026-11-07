import React, { useState, useEffect } from 'react';
import {
  Clock,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../../services/api';

const stages = [
  'applied',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'selected',
];

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/my');
        if (res.success) {
          setApplications(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStageIndex = (status) => {
    if (status === 'rejected') return -1;
    return stages.indexOf(status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 mb-2">
          <Clock className="w-3.5 h-3.5" /> Lifecycle Tracker
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Tracking System (ATS)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Follow your application status progress across all 6 recruitment stages in real time.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No active applications found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse open positions on the job board and apply to track your candidacy here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentIdx = getStageIndex(app.status);
            const isRejected = app.status === 'rejected';
            const isExpanded = expandedApp === app._id;

            return (
              <div
                key={app._id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6"
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-indigo-500" /> {app.job?.company}
                      </span>
                      <span>•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {app.job?.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">AI Match</span>
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {app.matchScore}%
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                        isRejected
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : app.status === 'selected'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper Visualizer */}
                {!isRejected ? (
                  <div className="pt-2">
                    <div className="grid grid-cols-5 gap-2 relative">
                      {stages.map((stageName, idx) => {
                        const isDone = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={stageName} className="text-center relative">
                            <div
                              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition mb-1.5 ${
                                isDone
                                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase block tracking-wider ${
                                isCurrent
                                  ? 'text-indigo-600 dark:text-indigo-400'
                                  : isDone
                                  ? 'text-slate-800 dark:text-slate-200'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stageName.replace('_', ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Application not moving forward at this time. Keep applying to other recommended roles!</span>
                  </div>
                )}

                {/* Status Timeline History Dropdown */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedApp(isExpanded ? null : app._id)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  >
                    {isExpanded ? 'Hide Status History' : 'View Status History & Audit Log'}
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Job ID: {app.job?._id?.slice(-6)}
                  </span>
                </div>

                {isExpanded && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-3 animate-in fade-in">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Audit Timeline
                    </h4>
                    <div className="space-y-2">
                      {(app.statusHistory || []).map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                                {h.status.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(h.changedAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] mt-0.5">{h.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
