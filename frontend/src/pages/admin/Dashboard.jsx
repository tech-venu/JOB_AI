import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Trash2,
  Lock,
  Unlock,
  Check,
  X,
  Search,
  Filter,
  Settings,
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'jobs' | 'activity'
  const [loading, setLoading] = useState(true);

  // User filters
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, usersRes, jobsRes, actRes] = await Promise.allSettled([
        api.get('/admin/dashboard'),
        api.get('/admin/users?limit=50'),
        api.get('/admin/jobs?limit=50'),
        api.get('/admin/activity?limit=30'),
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value.success) {
        setStats(dashRes.value.data.stats);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setUsers(usersRes.value.data);
      }
      if (jobsRes.status === 'fulfilled' && jobsRes.value.success) {
        setJobs(jobsRes.value.data);
      }
      if (actRes.status === 'fulfilled' && actRes.value.success) {
        setActivity(actRes.value.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to change ${user.name}'s status to ${newStatus}?`)) return;

    try {
      const res = await api.patch(`/admin/users/${user._id}/status`, { status: newStatus });
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u)));
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleVerifyRecruiter = async (userId, newStatus) => {
    try {
      const res = await api.patch(`/admin/recruiters/${userId}/verify`, { verificationStatus: newStatus });
      if (res.success) {
        alert(`Recruiter marked as ${newStatus}`);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message || 'Verification failed');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job posting from the platform?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearch) {
      const q = userSearch.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 border border-purple-400/30 text-purple-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Governance & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            System health, recruiter compliance verification, user management, and security audit logs.
          </p>
        </div>
        <Link
          to="/settings"
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-purple-200 bg-purple-900/60 hover:bg-purple-800 border border-purple-600/40 transition flex items-center gap-1.5 shrink-0"
        >
          <Settings className="w-4 h-4" /> Admin Security & Settings
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 max-w-2xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'users'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'jobs'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Job Postings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'activity'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Audit Logs ({activity.length})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Registered Users</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {stats?.totalUsers || 0}
              </p>
              <span className="text-[11px] text-slate-400">
                {stats?.totalJobSeekers || 0} candidates • {stats?.totalRecruiters || 0} recruiters
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Active Job Postings</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {stats?.activeJobs || 0}
              </p>
              <span className="text-[11px] text-slate-400">{stats?.totalJobs || 0} total created</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Applications</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {stats?.totalApplications || 0}
              </p>
              <span className="text-[11px] text-slate-400">Processed by AI matcher</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Verified Recruiters</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {stats?.verifiedRecruiters || 0}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">Authorized to publish</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              All User Accounts
            </h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="jobseeker">Job Seekers</option>
                <option value="recruiter">Recruiters</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Created</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                            u.status === 'active'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Job Management */}
      {activeTab === 'jobs' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Platform Job Postings Moderation
          </h3>
          <div className="space-y-3">
            {jobs.map((j) => (
              <div
                key={j._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{j.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {j.company} • {j.location} • {j.applicantsCount} Applicants
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteJob(j._id)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                  title="Delete job posting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'activity' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Security & Activity Audit Logs
          </h3>
          <div className="space-y-2">
            {activity.map((act) => (
              <div
                key={act._id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{act.action}</span>
                  <span className="text-slate-400 ml-2">by {act.user?.name || 'System / Guest'}</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(act.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

