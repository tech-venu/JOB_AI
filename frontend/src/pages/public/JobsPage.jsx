import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bookmark,
  Share2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Send,
  Building,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const JobsPage = () => {
  const { user, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filters
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [workplaceType, setWorkplaceType] = useState('all');
  const [employmentType, setEmploymentType] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(null);
  const [applyError, setApplyError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 9,
        sortBy,
        ...(search && { search }),
        ...(location && { location }),
        ...(workplaceType !== 'all' && { workplaceType }),
        ...(employmentType !== 'all' && { employmentType }),
      });

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.success) {
        setJobs(res.data);
        setMeta(res.meta || { page: 1, totalPages: 1, total: res.data.length });
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, workplaceType, employmentType, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'jobseeker') {
      alert('Only candidate accounts can submit job applications.');
      return;
    }
    setSelectedJob(job);
    setCoverLetter('');
    setApplySuccess(null);
    setApplyError('');
  };

  const submitApplication = async () => {
    try {
      setApplyLoading(true);
      setApplyError('');
      const res = await api.post('/applications', {
        jobId: selectedJob._id,
        coverLetter,
      });

      if (res.success) {
        setApplySuccess(res.data);
        // Refresh job list to update applicant count
        fetchJobs();
      }
    } catch (err) {
      setApplyError(err.message || 'Application submission failed');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleToggleSave = async (jobId) => {
    if (!isAuthenticated || role !== 'jobseeker') {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/jobs/${jobId}/save`);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Your Next Career Opportunity
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore curated roles with instant AI skill compatibility screening.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role title, skill, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-4 relative">
            <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="City, state, or remote location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Search className="w-4 h-4" /> Search Jobs
            </button>
          </div>
        </div>

        {/* Filter Badges & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Workplace:
            </span>
            {['all', 'remote', 'hybrid', 'on-site'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setWorkplaceType(type);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition ${
                  workplaceType === type
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}

            <span className="font-semibold text-slate-500 ml-2 hidden sm:inline">Type:</span>
            {['all', 'Full-time', 'Internship', 'Contract'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setEmploymentType(type);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition ${
                  employmentType === type
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="font-semibold text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="latest">Latest Jobs</option>
              <option value="salary_high">Highest Salary</option>
              <option value="experience">Experience Level</option>
            </select>
          </div>
        </div>
      </form>

      {/* Job Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200/50 dark:border-slate-800"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No jobs matched your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, changing the workplace filter, or resetting search filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setLocation('');
              setWorkplaceType('all');
              setEmploymentType('all');
              setPage(1);
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/60 transition group"
            >
              <div>
                {/* Header: Workplace badge & Save */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {job.workplaceType} • {job.employmentType}
                  </span>
                  {role === 'jobseeker' && (
                    <button
                      onClick={() => handleToggleSave(job._id)}
                      className="text-slate-400 hover:text-indigo-600 transition p-1"
                      title="Save Job"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Job Title & Company */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                  <Building className="w-3.5 h-3.5 text-indigo-500" /> {job.company}
                </p>

                {/* Details strip */}
                <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  {job.salaryMax > 0 && (
                    <span className="flex items-center gap-0.5 font-semibold text-slate-700 dark:text-slate-300">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> {job.experienceMin}+ yrs
                  </span>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Required Skills tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(job.requiredSkills || []).slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {(job.requiredSkills || []).length > 4 && (
                    <span className="px-1.5 py-0.5 text-[11px] text-slate-400 font-medium">
                      +{(job.requiredSkills || []).length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(job.createdAt).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleApplyClick(job)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs flex items-center gap-1"
                >
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {meta.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-3">
            Page {page} of {meta.totalPages} ({meta.total} jobs)
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Job Application Modal with Instant AI Match Calculation */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Apply to {selectedJob.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedJob.company} • {selectedJob.location}
            </p>

            {applySuccess ? (
              <div className="my-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Application Submitted!
                </h4>
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Compatibility Match
                    </span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                      {applySuccess.matchScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {applySuccess.matchBreakdown?.reason ||
                      'Your skills and resume details were evaluated against the job criteria.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setApplySuccess(null);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Intelligent Screening Notice:
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Your primary resume will be automatically parsed to evaluate skill overlap, experience relevance, and degree credentials.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cover Note / Message to Recruiter (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Highlight your key achievements and why you are the best match for this role..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {applyError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 font-medium">
                    {applyError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitApplication}
                    disabled={applyLoading}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {applyLoading ? (
                      'Analyzing & Submitting...'
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;

