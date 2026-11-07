import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, Users, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/recruiters/analytics');
        if (res.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  const funnelData = analytics?.funnel || [];
  const statusCounts = analytics?.statusCounts || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/recruiter/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Recruiter Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Recruitment Funnel & Candidate Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed metrics across screening, shortlisting, and hiring velocity.
        </p>
      </div>

      {/* Funnel Bar Chart Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" /> Hiring Conversion Funnel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate progression from initial application to final offer selection.
            </p>
          </div>
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-xl">
            {analytics?.totalApplications || 0} Total Evaluated
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(statusCounts).map(([stage, count]) => (
          <div
            key={stage}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center"
          >
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              {stage.replace('_', ' ')}
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1 block">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
