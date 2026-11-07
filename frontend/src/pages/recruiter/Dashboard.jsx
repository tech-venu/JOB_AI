import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Building,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/recruiters/dashboard');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-28 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { overview, scoreBuckets, recentApplications, jobPerformance, profile } = data || {};

  const scoreData = [
    { name: '>= 80% (Top Fit)', value: scoreBuckets?.excellent || 0 },
    { name: '60-79% (Good Fit)', value: scoreBuckets?.good || 0 },
    { name: '40-59% (Moderate)', value: scoreBuckets?.moderate || 0 },
    { name: '< 40% (Low Match)', value: scoreBuckets?.low || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 mb-2">
            <Building className="w-3.5 h-3.5" /> {profile?.companyName || 'Recruitment Console'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruiter Talent Command Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Automated applicant ranking, skill screening, and interview funnel management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/jobs/create"
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </Link>
          <Link
            to="/recruiter/analytics"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4" /> Full Analytics
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Job Postings</span>
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {overview?.totalJobs || 0}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            {overview?.activeJobs || 0} active postings
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Applicants</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {overview?.totalApplicants || 0}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">Screened via NLP</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {overview?.shortlistedCount || 0}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            High compatibility
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Avg Match Score</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {overview?.avgMatchScore || 0}%
          </p>
          <span className="text-[11px] text-amber-600 font-semibold block mt-1">
            TF-IDF compatibility
          </span>
        </div>
      </div>

      {/* Middle Row: Active Job Postings Performance & AI Match Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Performance List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Job Postings & Pipeline
              </h3>
              <p className="text-xs text-slate-500">
                Click on any job to view candidate rankings and match explanations.
              </p>
            </div>
            <Link
              to="/recruiter/jobs/create"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Post Job <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(jobPerformance || []).map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{job.applicantsCount} Total Applicants</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">{job.shortlistedCount} Shortlisted</span>
                    <span>•</span>
                    <span>Avg Score: <strong>{job.avgScore}%</strong></span>
                  </div>
                </div>

                <Link
                  to={`/recruiter/jobs/${job.id}/applicants`}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  View AI Rankings →
                </Link>
              </div>
            ))}
            {(jobPerformance || []).length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">
                No jobs published yet. Click "Post New Job" above to start hiring.
              </p>
            )}
          </div>
        </div>

        {/* Score Distribution Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            AI Compatibility Distribution
          </h3>
          <p className="text-xs text-slate-500">Applicant match breakdown across all roles.</p>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            {scoreData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span>{d.name}: <strong>{d.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
